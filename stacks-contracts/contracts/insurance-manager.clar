;; insurance-manager.clar
;; Jagantara - Insurance Premium Management Contract
;;
;; Manages user insurance subscriptions (policy premium payments) and
;; distributes collected premiums to various modules (staking, claims, treasury).
;; Users pay premiums in USDC (SIP-010) and the contract distributes funds.

;; ============================================================================
;; Constants
;; ============================================================================

;; Premium duration in blocks (~10 min blocks = 144 blocks/day * 30 = 4320 for 30 days)
(define-constant PREMIUM-DURATION u4320)
(define-constant ERR-NOT-OWNER (err u100))
(define-constant ERR-INVALID-TIER (err u101))
(define-constant ERR-ZERO-AMOUNT (err u103))

;; Tier percentages in basis points (per 100,000)
;; Tier 1: 0.1% = 10 per 100,000
;; Tier 2: 0.3% = 30 per 100,000
;; Tier 3: 0.5% = 50 per 100,000
(define-constant BASIS-POINTS u100000)
(define-constant TIER-1-PCT u10)
(define-constant TIER-2-PCT u30)
(define-constant TIER-3-PCT u50)

;; ============================================================================
;; Data Variables
;; ============================================================================

(define-data-var owner principal tx-sender)
(define-data-var total-users uint u0)
(define-data-var total-collected uint u0)

;; ============================================================================
;; Maps
;; ============================================================================

;; Tier to percentage mapping
(define-map tier-percentages uint uint)

;; Policy data by user address
(define-map policies principal {
  last-paid-at: uint,
  duration: uint,
  covered-address: principal,
  tier: uint,
  active: bool,
  amount-to-cover: uint
})

;; ============================================================================
;; Private Helpers
;; ============================================================================

(define-private (is-owner)
  (is-eq tx-sender (var-get owner))
)

;; Get tier percentage (returns 0 if invalid tier)
(define-private (tier-percentage (tier uint))
  (default-to u0 (map-get? tier-percentages tier))
)

;; Calculate premium price: (amountToCover * tierPercentage) / 100000
(define-private (calculate-premium (amount-to-cover uint) (tier uint))
  (/ (* amount-to-cover (tier-percentage tier)) BASIS-POINTS)
)

;; Check if a policy is currently active
(define-private (is-policy-active (user principal))
  (match (map-get? policies user)
    policy
      (and
        (get active policy)
        (<= block-height (+ (get last-paid-at policy) (* PREMIUM-DURATION (get duration policy))))
      )
    false
  )
)

;; ============================================================================
;; Public Functions - Admin
;; ============================================================================

;; Initialize tier percentages (called once after deployment)
(define-public (initialize-tiers)
  (begin
    (asserts! (is-owner) ERR-NOT-OWNER)
    (map-set tier-percentages u1 TIER-1-PCT)
    (map-set tier-percentages u2 TIER-2-PCT)
    (map-set tier-percentages u3 TIER-3-PCT)
    (print {
      event: "tiers-initialized",
      tier-1: TIER-1-PCT,
      tier-2: TIER-2-PCT,
      tier-3: TIER-3-PCT
    })
    (ok true)
  )
)

;; ============================================================================
;; Public Functions - User
;; ============================================================================

;; Pay insurance premium
;; Users pay based on tier percentage and duration
;; Simplified version - just tracks policy data
(define-public (pay-premium
  (tier uint)
  (duration uint)
  (covered-address principal)
  (amount-to-cover uint)
)
  (begin
    ;; Validate tier
    (asserts! (> (tier-percentage tier) u0) ERR-INVALID-TIER)
    
    (let (
      (premium-price (calculate-premium amount-to-cover tier))
      (existing-policy (map-get? policies tx-sender))
    )
      ;; Calculate total price: premiumPrice * duration
      (let ((total-price (* premium-price duration)))
        ;; Check if this is a new user
        (if (is-none existing-policy)
          (var-set total-users (+ (var-get total-users) u1))
          true
        )
        
        ;; Update policy state
        (map-set policies tx-sender {
          last-paid-at: block-height,
          duration: duration,
          covered-address: covered-address,
          tier: tier,
          active: true,
          amount-to-cover: amount-to-cover
        })
        
        ;; Update total collected
        (var-set total-collected (+ (var-get total-collected) premium-price))
        
        (print {
          event: "premium-paid",
          user: tx-sender,
          tier: tier,
          duration: duration,
          covered-address: covered-address,
          amount-to-cover: amount-to-cover,
          premium: premium-price,
          total: total-price
        })
        (ok true)
      )
    )
  )
)

;; Deactivate a policy
(define-public (deactivate-policy)
  (let ((policy (map-get? policies tx-sender)))
    (match policy
      p
        (begin
          (map-set policies tx-sender (merge p { active: false }))
          (ok true)
        )
      (err ERR-NOT-OWNER)
    )
  )
)

;; ============================================================================
;; Read-Only Functions
;; ============================================================================

(define-read-only (get-owner)
  (var-get owner)
)

(define-read-only (get-total-users)
  (var-get total-users)
)

(define-read-only (get-total-collected)
  (var-get total-collected)
)

(define-read-only (get-tier-percentage (tier uint))
  (tier-percentage tier)
)

(define-read-only (get-policy (user principal))
  (map-get? policies user)
)

(define-read-only (is-active (user principal))
  (is-policy-active user)
)

(define-read-only (get-premium-price (amount-to-cover uint) (tier uint))
  (calculate-premium amount-to-cover tier)
)

(define-read-only (get-premium-duration)
  PREMIUM-DURATION
)
