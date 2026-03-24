;; claim-manager-v2.clar
;; Jagantara - Claim Payout Management Contract (Multi-asset Settlement)
;;
;; Claim approvals originate from dao-governance-v2 and payouts are made in the
;; recorded claim asset (USDCx, sBTC, or STX).

;; Claim expiry: 7 days = 1008 blocks
(define-constant CLAIM-EXPIRY u1008)
(define-constant ERR-NOT-OWNER (err u100))
(define-constant ERR-ALREADY-PAID (err u102))
(define-constant ERR-NOT-CLAIMANT (err u103))
(define-constant ERR-CLAIM-EXPIRED (err u105))
(define-constant ERR-CLAIM-NOT-FOUND (err u107))
(define-constant ERR-INSUFFICIENT-BALANCE (err u108))
(define-constant ERR-NOT-AUTHORIZED (err u109))
(define-constant ERR-INVALID-ASSET (err u110))

;; Asset identifiers
(define-constant ASSET-USDCX u1)
(define-constant ASSET-SBTC u2)
(define-constant ASSET-STX u3)

(define-private (is-valid-asset (asset uint))
  (or (is-eq asset ASSET-USDCX)
      (is-eq asset ASSET-SBTC)
      (is-eq asset ASSET-STX))
)

(define-data-var owner principal tx-sender)

;; Track if a claim has been executed/paid
(define-map claim-executed uint bool)

(define-map claims
  { id: uint }
  {
    claimant: principal,
    asset: uint,
    amount: uint,
    approved-at: uint,
    executed: bool
  }
)

(define-data-var claim-count uint u0)

;; Backwards-compat accounting (USDCx)
(define-data-var contract-balance uint u0)

;; Per-asset internal accounting
(define-map contract-balance-by-asset uint uint)

(define-private (contract-self)
  (as-contract tx-sender)
)

(define-private (is-owner)
  (is-eq tx-sender (var-get owner))
)

;; Fund (USDCx only; backwards compat)
(define-public (fund-contract (amount uint))
  (begin
    (asserts! (> amount u0) ERR-INSUFFICIENT-BALANCE)
    (try! (contract-call? .usdcx-token transfer amount tx-sender (contract-self) none))
    (var-set contract-balance (+ (var-get contract-balance) amount))
    (map-set contract-balance-by-asset ASSET-USDCX
      (+ (default-to u0 (map-get? contract-balance-by-asset ASSET-USDCX)) amount))
    (print { event: "contract-funded", asset: ASSET-USDCX, from: tx-sender, amount: amount })
    (ok true)
  )
)

;; Fund in a specific asset
(define-public (fund-contract-asset (asset uint) (amount uint))
  (begin
    (asserts! (is-valid-asset asset) ERR-INVALID-ASSET)
    (asserts! (> amount u0) ERR-INSUFFICIENT-BALANCE)

    (if (is-eq asset ASSET-STX)
      (try! (stx-transfer? amount tx-sender (contract-self)))
      (try! (if (is-eq asset ASSET-USDCX)
              (contract-call? .usdcx-token transfer amount tx-sender (contract-self) none)
              (contract-call? .sbtc-token transfer amount tx-sender (contract-self) none)))
    )

    (if (is-eq asset ASSET-USDCX)
      (var-set contract-balance (+ (var-get contract-balance) amount))
      true)

    (map-set contract-balance-by-asset asset
      (+ (default-to u0 (map-get? contract-balance-by-asset asset)) amount))

    (print { event: "contract-funded", asset: asset, from: tx-sender, amount: amount })
    (ok true)
  )
)

;; Submit a claim (called by dao-governance-v2)
(define-public (submit-claim (claimant principal) (asset uint) (amount uint))
  (begin
    (asserts! (is-eq contract-caller .dao-governance-v2) ERR-NOT-AUTHORIZED)
    (asserts! (is-valid-asset asset) ERR-INVALID-ASSET)
    (let ((claim-id (var-get claim-count))
          (approved-block block-height))
      (map-set claims
        { id: claim-id }
        {
          claimant: claimant,
          asset: asset,
          amount: amount,
          approved-at: approved-block,
          executed: false
        }
      )
      (var-set claim-count (+ claim-id u1))
      (print { event: "claim-submitted", claim-id: claim-id, claimant: claimant, asset: asset, amount: amount })
      (ok claim-id)
    )
  )
)

;; Claim payout
(define-public (claim-payout (claim-id uint))
  (let ((claim (unwrap! (map-get? claims { id: claim-id }) ERR-CLAIM-NOT-FOUND)))
    (let (
      (claimant (get claimant claim))
      (asset (get asset claim))
      (amount (get amount claim))
      (approved-at (get approved-at claim))
      (current-block block-height)
    )
      (begin
        (asserts! (not (default-to false (map-get? claim-executed claim-id))) ERR-ALREADY-PAID)
        (asserts! (is-eq tx-sender claimant) ERR-NOT-CLAIMANT)
        (asserts! (<= current-block (+ approved-at CLAIM-EXPIRY)) ERR-CLAIM-EXPIRED)

        (let ((bal (default-to u0 (map-get? contract-balance-by-asset asset))))
          (asserts! (>= bal amount) ERR-INSUFFICIENT-BALANCE)
          (map-set contract-balance-by-asset asset (- bal amount))
        )

        (if (is-eq asset ASSET-USDCX)
          (var-set contract-balance (- (var-get contract-balance) amount))
          true)

        (as-contract
          (begin
            (if (is-eq asset ASSET-STX)
              (try! (stx-transfer? amount tx-sender claimant))
              (try! (if (is-eq asset ASSET-USDCX)
                      (contract-call? .usdcx-token transfer amount tx-sender claimant none)
                      (contract-call? .sbtc-token transfer amount tx-sender claimant none)))
            )
          )
        )

        (map-set claim-executed claim-id true)
        (map-set claims { id: claim-id } (merge claim { executed: true }))

        (print { event: "claim-paid", claim-id: claim-id, claimant: claimant, asset: asset, amount: amount })
        (ok true)
      )
    )
  )
)

;; Read-only
(define-read-only (get-owner) (var-get owner))
(define-read-only (get-claim-executed (claim-id uint)) (default-to false (map-get? claim-executed claim-id)))
(define-read-only (get-claim-data (claim-id uint)) (map-get? claims { id: claim-id }))
(define-read-only (is-claim-approved (claim-id uint))
  (let ((claim (map-get? claims { id: claim-id })))
    (match claim c (> (get approved-at c) u0) false)
  )
)
(define-read-only (get-claim-count) (var-get claim-count))
(define-read-only (get-contract-balance) (ok (var-get contract-balance)))
(define-read-only (get-contract-balance-by-asset (asset uint))
  (begin
    (asserts! (is-valid-asset asset) ERR-INVALID-ASSET)
    (ok (default-to u0 (map-get? contract-balance-by-asset asset)))
  )
)

;; Backwards-compat alias expected by frontend service layer
(define-read-only (vault-balance) (ok (var-get contract-balance)))
(define-read-only (get-claim-expiry) CLAIM-EXPIRY)

