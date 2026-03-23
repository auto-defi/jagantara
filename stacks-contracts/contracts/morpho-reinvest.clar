;; morpho-reinvest.clar
;; Jagantara - Morpho Reinvestment Contract
;;
;; Handles reinvestment of yields from Morpho protocol back into the staking pool.
;; Simplified version for testing - no cross-contract calls.

;; ============================================================================
;; Constants
;; ============================================================================

(define-constant ERR-NOT-OWNER (err u100))
(define-constant ERR-ZERO-AMOUNT (err u101))
(define-constant ERR-INSUFFICIENT-BALANCE (err u102))

;; ============================================================================
;; Data Variables
;; ============================================================================

(define-data-var owner principal tx-sender)
(define-data-var total-reinvested uint u0)
(define-data-var reinvest-count uint u0)

;; ============================================================================
;; Maps
;; ============================================================================

;; Track reinvestments by user
(define-map reinvestments principal {
  amount: uint,
  timestamp: uint
})

;; ============================================================================
;; Private Helpers
;; ============================================================================

(define-private (is-owner)
  (is-eq tx-sender (var-get owner))
)

;; ============================================================================
;; Public Functions - Admin
;; ============================================================================

;; Set owner (admin only)
(define-public (set-owner (new-owner principal))
  (begin
    (asserts! (is-owner) ERR-NOT-OWNER)
    (var-set owner new-owner)
    (print { event: "owner-set", new-owner: new-owner })
    (ok true)
  )
)

;; ============================================================================
;; Public Functions - Reinvestment
;; ============================================================================

;; Reinvest yield back into staking pool (simplified)
(define-public (reinvest (amount uint))
  (begin
    (asserts! (> amount u0) ERR-ZERO-AMOUNT)
    
    ;; Update totals
    (var-set total-reinvested (+ (var-get total-reinvested) amount))
    (var-set reinvest-count (+ (var-get reinvest-count) u1))
    
    ;; Record reinvestment
    (map-set reinvestments tx-sender {
      amount: amount,
      timestamp: block-height
    })
    
    (print {
      event: "reinvested",
      user: tx-sender,
      amount: amount
    })
    (ok true)
  )
)

;; Compound yield (admin only)
(define-public (compound-yield (amount uint))
  (begin
    (asserts! (is-owner) ERR-NOT-OWNER)
    (asserts! (> amount u0) ERR-ZERO-AMOUNT)
    
    ;; Update totals
    (var-set total-reinvested (+ (var-get total-reinvested) amount))
    
    (print {
      event: "yield-compounded",
      amount: amount
    })
    (ok true)
  )
)

;; ============================================================================
;; Read-Only Functions
;; ============================================================================

(define-read-only (get-owner)
  (var-get owner)
)

(define-read-only (get-total-reinvested)
  (var-get total-reinvested)
)

(define-read-only (get-reinvest-count)
  (var-get reinvest-count)
)

(define-read-only (get-reinvestment (user principal))
  (map-get? reinvestments user)
)
