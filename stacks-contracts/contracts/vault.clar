;; vault.clar
;; Jagantara - Multi-asset Vault for real on-chain settlement
;;
;; Supports deposits/withdrawals in:
;; - USDCx (SIP-010): .usdcx-token
;; - sBTC  (SIP-010): .sbtc-token
;; - STX   (native)
;;
;; The vault maintains per-user balances per asset and allows an owner (insurance-manager)
;; to pay out approved claims from vault liquidity.

(define-constant ERR-NOT-OWNER (err u100))
(define-constant ERR-INVALID-ASSET (err u101))
(define-constant ERR-INVALID-AMOUNT (err u102))
(define-constant ERR-INSUFFICIENT (err u103))
(define-constant ERR-UNAUTHORIZED (err u104))

;; Asset identifiers
(define-constant ASSET-USDCX u1)
(define-constant ASSET-SBTC u2)
(define-constant ASSET-STX u3)

(define-data-var owner principal tx-sender)

;; balances: (asset-id, user) -> uint
(define-map balances { asset: uint, user: principal } uint)

(define-private (is-owner)
  (is-eq tx-sender (var-get owner))
)

(define-private (contract-self)
  (as-contract tx-sender)
)

(define-private (is-valid-asset (asset uint))
  (or (is-eq asset ASSET-USDCX)
      (is-eq asset ASSET-SBTC)
      (is-eq asset ASSET-STX))
)

(define-read-only (get-owner) (var-get owner))

(define-public (set-owner (new-owner principal))
  (begin
    (asserts! (is-owner) ERR-NOT-OWNER)
    (var-set owner new-owner)
    (print { event: "owner-set", new-owner: new-owner })
    (ok true)
  )
)

(define-read-only (get-balance (asset uint) (user principal))
  (begin
    (asserts! (is-valid-asset asset) ERR-INVALID-ASSET)
    (ok (default-to u0 (map-get? balances { asset: asset, user: user })))
  )
)

;; ----------------------------
;; User deposits
;; ----------------------------

(define-public (deposit-ft (asset uint) (amount uint))
  (begin
    (asserts! (or (is-eq asset ASSET-USDCX) (is-eq asset ASSET-SBTC)) ERR-INVALID-ASSET)
    (asserts! (> amount u0) ERR-INVALID-AMOUNT)

    ;; Pull token from user into this contract.
    (try! (if (is-eq asset ASSET-USDCX)
            (contract-call? .usdcx-token transfer amount tx-sender (contract-self) none)
            (contract-call? .sbtc-token transfer amount tx-sender (contract-self) none)))

    (map-set balances { asset: asset, user: tx-sender }
      (+ (default-to u0 (map-get? balances { asset: asset, user: tx-sender })) amount))

    (print { event: "deposit", asset: asset, user: tx-sender, amount: amount })
    (ok true)
  )
)

(define-public (deposit-stx (amount uint))
  (begin
    (asserts! (> amount u0) ERR-INVALID-AMOUNT)
    ;; Pull STX from the user into this contract.
    ;; This avoids relying on attaching STX to a contract-call (wallet UX varies).
    (try! (stx-transfer? amount tx-sender (contract-self)))

    (map-set balances { asset: ASSET-STX, user: tx-sender }
      (+ (default-to u0 (map-get? balances { asset: ASSET-STX, user: tx-sender })) amount))

    (print { event: "deposit", asset: ASSET-STX, user: tx-sender, amount: amount })
    (ok true)
  )
)

;; ----------------------------
;; User withdrawals
;; ----------------------------

(define-public (withdraw-ft (asset uint) (amount uint))
  (begin
    (asserts! (or (is-eq asset ASSET-USDCX) (is-eq asset ASSET-SBTC)) ERR-INVALID-ASSET)
    (asserts! (> amount u0) ERR-INVALID-AMOUNT)
    (let ((user tx-sender)
          (bal (default-to u0 (map-get? balances { asset: asset, user: tx-sender }))))
      (asserts! (>= bal amount) ERR-INSUFFICIENT)
      (map-set balances { asset: asset, user: user } (- bal amount))
      (as-contract
        (begin
          (try! (if (is-eq asset ASSET-USDCX)
                  (contract-call? .usdcx-token transfer amount tx-sender user none)
                  (contract-call? .sbtc-token transfer amount tx-sender user none)))
          (print { event: "withdraw", asset: asset, user: user, amount: amount })
          (ok true)
        )
      )
    )
  )
)

(define-public (withdraw-stx (amount uint))
  (begin
    (asserts! (> amount u0) ERR-INVALID-AMOUNT)
    (let ((user tx-sender)
          (bal (default-to u0 (map-get? balances { asset: ASSET-STX, user: tx-sender }))))
      (asserts! (>= bal amount) ERR-INSUFFICIENT)
      (map-set balances { asset: ASSET-STX, user: user } (- bal amount))
      (as-contract
        (begin
          (try! (stx-transfer? amount tx-sender user))
          (print { event: "withdraw", asset: ASSET-STX, user: user, amount: amount })
          (ok true)
        )
      )
    )
  )
)

;; ----------------------------
;; Settlement payouts (owner-only)
;; ----------------------------

;; Pay an amount to a recipient from vault liquidity.
;; NOTE: This debits only the vault's on-chain holdings and does not touch user balances.
(define-public (payout (asset uint) (recipient principal) (amount uint))
  (begin
    (asserts! (is-owner) ERR-NOT-OWNER)
    (asserts! (is-valid-asset asset) ERR-INVALID-ASSET)
    (asserts! (> amount u0) ERR-INVALID-AMOUNT)

    (as-contract
      (begin
        (if (is-eq asset ASSET-STX)
          (try! (stx-transfer? amount tx-sender recipient))
          (try! (if (is-eq asset ASSET-USDCX)
                  (contract-call? .usdcx-token transfer amount tx-sender recipient none)
                  (contract-call? .sbtc-token transfer amount tx-sender recipient none))))
        (print { event: "payout", asset: asset, to: recipient, amount: amount })
        (ok true)
      )
    )
  )
)
