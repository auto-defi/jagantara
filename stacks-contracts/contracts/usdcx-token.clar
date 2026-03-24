;; usdcx-token.clar
;; Testnet-only SIP-010 stablecoin for Jagantara real settlement.

(define-fungible-token usdcx-token)

(define-data-var admin principal tx-sender)
(define-data-var token-name (string-ascii 32) "USD Coin (USDCx)")
(define-data-var token-symbol (string-ascii 10) "USDCx")
(define-data-var token-decimals uint u6)

(define-constant ERR-NOT-ADMIN (err u100))
(define-constant ERR-INVALID-AMOUNT (err u101))
(define-constant ERR-UNAUTHORIZED (err u102))

(define-private (is-admin)
  (is-eq tx-sender (var-get admin))
)

(define-public (set-admin (new-admin principal))
  (begin
    (asserts! (is-admin) ERR-NOT-ADMIN)
    (var-set admin new-admin)
    (ok true)
  )
)

;; Faucet mint (testnet/dev convenience)
(define-constant FAUCET-MAX u500000000) ;; 500 USDCx (6 decimals)

(define-public (faucet (amount uint))
  (begin
    (asserts! (> amount u0) ERR-INVALID-AMOUNT)
    (asserts! (<= amount FAUCET-MAX) ERR-UNAUTHORIZED)
    (try! (ft-mint? usdcx-token amount tx-sender))
    (print { event: "faucet", to: tx-sender, amount: amount })
    (ok true)
  )
)

(define-public (mint (to principal) (amount uint))
  (begin
    (asserts! (is-admin) ERR-NOT-ADMIN)
    (asserts! (> amount u0) ERR-INVALID-AMOUNT)
    (try! (ft-mint? usdcx-token amount to))
    (ok true)
  )
)

(define-public (burn (amount uint))
  (begin
    (asserts! (> amount u0) ERR-INVALID-AMOUNT)
    (try! (ft-burn? usdcx-token amount tx-sender))
    (ok true)
  )
)

(define-public (transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34))))
  (begin
    (asserts! (is-eq tx-sender sender) ERR-UNAUTHORIZED)
    (asserts! (> amount u0) ERR-INVALID-AMOUNT)
    (try! (ft-transfer? usdcx-token amount sender recipient))
    (match memo m (print m) 0x)
    (ok true)
  )
)

(define-read-only (get-name) (ok (var-get token-name)))
(define-read-only (get-symbol) (ok (var-get token-symbol)))
(define-read-only (get-decimals) (ok (var-get token-decimals)))
(define-read-only (get-balance (account principal)) (ok (ft-get-balance usdcx-token account)))
(define-read-only (get-total-supply) (ok (ft-get-supply usdcx-token)))

