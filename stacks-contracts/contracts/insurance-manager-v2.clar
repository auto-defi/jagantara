;; insurance-manager-v2.clar
;; Jagantara - Insurance Premium Management Contract (Multi-asset Settlement)
;;
;; Supports premiums in USDCx (SIP-010), sBTC (SIP-010), or STX (native).
;; Records the asset per policy and exposes pay-premium-asset for explicit settlement.

;; ============================================================================
;; Constants
;; ============================================================================

;; Premium duration in blocks (~10 min blocks = 144 blocks/day * 30 = 4320 for 30 days)
(define-constant PREMIUM-DURATION u4320)
(define-constant ERR-NOT-OWNER (err u100))
(define-constant ERR-INVALID-TIER (err u101))
(define-constant ERR-ZERO-AMOUNT (err u103))

;; Tier percentages in basis points (per 100,000)
(define-constant BASIS-POINTS u100000)
(define-constant TIER-1-PCT u10)
(define-constant TIER-2-PCT u30)
(define-constant TIER-3-PCT u50)

;; Revenue split basis points (per 100,000)
(define-constant STAKE-SHARE u30000)
(define-constant CLAIM-SHARE u25000)
(define-constant OWNER-SHARE u20000)
(define-constant TREASURY-SHARE u25000)

(define-constant ERR-TOKEN-TRANSFER (err u111))
(define-constant ERR-INVALID-ASSET (err u112))

;; Asset identifiers (kept consistent with vault)
(define-constant ASSET-USDCX u1)
(define-constant ASSET-SBTC u2)
(define-constant ASSET-STX u3)

;; ============================================================================
;; Data Variables
;; ============================================================================

(define-data-var owner principal tx-sender)
(define-data-var total-users uint u0)
(define-data-var total-collected uint u0)

;; Default settlement asset for new policies
(define-data-var default-asset uint ASSET-USDCX)

;; ============================================================================
;; Maps
;; ============================================================================

(define-map tier-percentages uint uint)

(define-map policies principal {
  last-paid-at: uint,
  duration: uint,
  covered-address: principal,
  tier: uint,
  active: bool,
  amount-to-cover: uint,
  asset: uint
})

;; Track total collected per asset
(define-map collected-by-asset uint uint)

;; ============================================================================
;; Private Helpers
;; ============================================================================

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

(define-private (tier-percentage (tier uint))
  (default-to u0 (map-get? tier-percentages tier))
)

(define-private (calculate-premium (amount-to-cover uint) (tier uint))
  (/ (* amount-to-cover (tier-percentage tier)) BASIS-POINTS)
)

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

;; Internal implementation that supports per-policy asset selection.
(define-private (pay-premium-internal
  (asset uint)
  (tier uint)
  (duration uint)
  (covered-address principal)
  (amount-to-cover uint)
)
  (begin
    (asserts! (is-valid-asset asset) ERR-INVALID-ASSET)
    (asserts! (> (tier-percentage tier) u0) ERR-INVALID-TIER)

    (let (
      (premium-price (calculate-premium amount-to-cover tier))
      (existing-policy (map-get? policies tx-sender))
    )
      (let ((total-price (* premium-price duration)))
        (asserts! (> total-price u0) ERR-ZERO-AMOUNT)

        ;; Pull payment from tx-sender into this contract
        (if (is-eq asset ASSET-STX)
          (try! (stx-transfer? total-price tx-sender (contract-self)))
          (try! (if (is-eq asset ASSET-USDCX)
                  (contract-call? .usdcx-token transfer total-price tx-sender (contract-self) none)
                  (contract-call? .sbtc-token transfer total-price tx-sender (contract-self) none)))
        )

        (if (is-none existing-policy)
          (var-set total-users (+ (var-get total-users) u1))
          true
        )

        (map-set policies tx-sender {
          last-paid-at: block-height,
          duration: duration,
          covered-address: covered-address,
          tier: tier,
          active: true,
          amount-to-cover: amount-to-cover,
          asset: asset
        })

        (var-set total-collected (+ (var-get total-collected) total-price))
        (map-set collected-by-asset asset
          (+ (default-to u0 (map-get? collected-by-asset asset)) total-price))

        (print {
          event: "premium-paid",
          user: tx-sender,
          asset: asset,
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

;; ============================================================================
;; Public Functions - Admin
;; ============================================================================

(define-public (initialize-tiers)
  (begin
    (asserts! (is-owner) ERR-NOT-OWNER)
    (map-set tier-percentages u1 TIER-1-PCT)
    (map-set tier-percentages u2 TIER-2-PCT)
    (map-set tier-percentages u3 TIER-3-PCT)
    (print { event: "tiers-initialized", tier-1: TIER-1-PCT, tier-2: TIER-2-PCT, tier-3: TIER-3-PCT })
    (ok true)
  )
)

(define-public (set-default-asset (asset uint))
  (begin
    (asserts! (is-owner) ERR-NOT-OWNER)
    (asserts! (is-valid-asset asset) ERR-INVALID-ASSET)
    (var-set default-asset asset)
    (print { event: "default-asset-set", asset: asset })
    (ok true)
  )
)

;; ============================================================================
;; Public Functions - User
;; ============================================================================

;; Backwards-compat entrypoint: uses default-asset
(define-public (pay-premium
  (tier uint)
  (duration uint)
  (covered-address principal)
  (amount-to-cover uint)
)
  (pay-premium-internal (var-get default-asset) tier duration covered-address amount-to-cover)
)

;; New: explicit asset per-policy
(define-public (pay-premium-asset
  (asset uint)
  (tier uint)
  (duration uint)
  (covered-address principal)
  (amount-to-cover uint)
)
  (pay-premium-internal asset tier duration covered-address amount-to-cover)
)

;; Distribute accumulated USDCx held by this contract according to the revenue split.
;; (kept USDCx-only for now; sends claim share to claim-manager-v2)
(define-public (transfer-revenue)
  (begin
    (asserts! (is-owner) ERR-NOT-OWNER)
    (let (
      (bal (unwrap! (contract-call? .usdcx-token get-balance (contract-self)) ERR-TOKEN-TRANSFER))
      (stake-amt (/ (* bal STAKE-SHARE) BASIS-POINTS))
      (claim-amt (/ (* bal CLAIM-SHARE) BASIS-POINTS))
      (owner-amt (/ (* bal OWNER-SHARE) BASIS-POINTS))
      (treasury-amt (/ (* bal TREASURY-SHARE) BASIS-POINTS))
    )
      (as-contract
        (begin
          (if (> stake-amt u0)
            (try! (contract-call? .usdcx-token transfer stake-amt tx-sender .jaga-stake none))
            true
          )
          (if (> claim-amt u0)
            (try! (contract-call? .usdcx-token transfer claim-amt tx-sender .claim-manager-v2 none))
            true
          )
          (if (> owner-amt u0)
            (try! (contract-call? .usdcx-token transfer owner-amt tx-sender (var-get owner) none))
            true
          )
          (if (> treasury-amt u0)
            (try! (contract-call? .usdcx-token transfer treasury-amt tx-sender .morpho-reinvest none))
            true
          )
          (print { event: "revenue-transferred", asset: ASSET-USDCX, balance: bal, stake: stake-amt, claims: claim-amt, owner: owner-amt, treasury: treasury-amt })
          (ok true)
        )
      )
    )
  )
)

(define-public (deactivate-policy)
  (let ((policy (map-get? policies tx-sender)))
    (match policy
      p (begin (map-set policies tx-sender (merge p { active: false })) (ok true))
      (err ERR-NOT-OWNER)
    )
  )
)

;; ============================================================================
;; Read-Only Functions
;; ============================================================================

(define-read-only (get-owner) (var-get owner))
(define-read-only (get-total-users) (var-get total-users))
(define-read-only (get-total-collected) (var-get total-collected))
(define-read-only (get-tier-percentage (tier uint)) (tier-percentage tier))
(define-read-only (get-policy (user principal)) (map-get? policies user))
(define-read-only (get-default-asset) (var-get default-asset))
(define-read-only (get-total-collected-by-asset (asset uint))
  (begin
    (asserts! (is-valid-asset asset) ERR-INVALID-ASSET)
    (ok (default-to u0 (map-get? collected-by-asset asset)))
  )
)
(define-read-only (is-active (user principal)) (is-policy-active user))
(define-read-only (get-premium-price (amount-to-cover uint) (tier uint)) (calculate-premium amount-to-cover tier))
(define-read-only (get-premium-duration) PREMIUM-DURATION)

