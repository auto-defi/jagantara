;; jaga-stake.clar
;; Jagantara - Synthetix Style Staking Contract
;;
;; A staking contract using Synthetix-style continuous rewards distribution.
;; Users stake USDCx (SIP-010) and receive JagaToken for governance voting.
;; Rewards are distributed continuously based on time-weighted stake participation.
;; Simplified version for testing - no cross-contract calls.

;; ============================================================================
;; Constants
;; ============================================================================

;; 30 days in blocks (assuming ~10 min blocks = 144 blocks/day * 30 = 4320)
(define-constant REWARDS-DURATION u4320)
(define-constant ERR-NOT-OWNER (err u100))
(define-constant ERR-ZERO-AMOUNT (err u103))
(define-constant ERR-INSUFFICIENT-BALANCE (err u104))

;; Scale factor for reward calculations (1e6 for 6 decimals)
(define-constant SCALE u1000000)

;; ============================================================================
;; Data Variables
;; ============================================================================

(define-data-var owner principal tx-sender)
(define-data-var total-supply uint u0)
(define-data-var reward-rate uint u0)
(define-data-var last-update-time uint u0)
(define-data-var reward-per-token-stored uint u0)
(define-data-var period-finish uint u0)
(define-data-var staker-count uint u0)

;; ============================================================================
;; Maps
;; ============================================================================

;; User staking balances
(define-map balances principal uint)

;; User reward per token paid (last claimed rewardPerToken)
(define-map user-reward-per-token-paid principal uint)

;; User rewards to be claimed
(define-map rewards principal uint)

;; Staker index tracking for enumeration
(define-map staker-at uint principal)
(define-map staker-status principal bool)

;; ============================================================================
;; Private Helpers
;; ============================================================================

(define-private (is-owner)
  (is-eq tx-sender (var-get owner))
)

;; Returns the last timestamp at which rewards were applicable
(define-private (last-time-reward-applicable)
  (if (< block-height (var-get period-finish))
    block-height
    (var-get period-finish)
  )
)

;; Returns the accumulated reward per token
(define-private (reward-per-token)
  (if (is-eq (var-get total-supply) u0)
    (var-get reward-per-token-stored)
    (+
      (var-get reward-per-token-stored)
      (/
        (*
          (- (last-time-reward-applicable) (var-get last-update-time))
          (var-get reward-rate)
          SCALE
        )
        (var-get total-supply)
      )
    )
  )
)

;; Returns the earned rewards for a specific user
(define-private (earned (account principal))
  (+
    (/
      (*
        (default-to u0 (map-get? balances account))
        (- (reward-per-token) (default-to u0 (map-get? user-reward-per-token-paid account)))
      )
      SCALE
    )
    (default-to u0 (map-get? rewards account))
  )
)

;; Update reward state (called before state-changing operations)
(define-private (update-reward (account (optional principal)))
  (let ((new-rpt (reward-per-token)))
    (var-set reward-per-token-stored new-rpt)
    (var-set last-update-time (last-time-reward-applicable))
    (match account
      acc
        (begin
          (map-set rewards acc (earned acc))
          (map-set user-reward-per-token-paid acc new-rpt)
        )
      true
    )
  )
)

;; Add staker to index if not already present
(define-private (add-staker-index (staker principal))
  (if (not (default-to false (map-get? staker-status staker)))
    (begin
      (map-set staker-at (var-get staker-count) staker)
      (map-set staker-status staker true)
      (var-set staker-count (+ (var-get staker-count) u1))
      true
    )
    true
  )
)

;; Remove staker from index if balance is zero
(define-private (remove-staker-index (staker principal))
  (if (is-eq (default-to u0 (map-get? balances staker)) u0)
    (begin
      (map-delete staker-status staker)
      ;; Note: We don't remove from staker-at to avoid complex array shifting
      ;; Frontend can filter using staker-status map
      true
    )
    true
  )
)

;; ============================================================================
;; Public Functions - Admin
;; ============================================================================

;; Set reward rate (admin only)
(define-public (set-reward-rate (rate uint))
  (begin
    (asserts! (is-owner) ERR-NOT-OWNER)
    (var-set reward-rate rate)
    (var-set last-update-time block-height)
    (var-set period-finish (+ block-height REWARDS-DURATION))
    (print { event: "reward-rate-set", rate: rate })
    (ok true)
  )
)

;; ============================================================================
;; Public Functions - Staking
;; ============================================================================

;; Stake tokens (simplified - just tracks balance)
(define-public (stake (amount uint))
  (begin
    (asserts! (> amount u0) ERR-ZERO-AMOUNT)
    
    ;; Update rewards state
    (update-reward (some tx-sender))
    
    ;; Add staker to index
    (add-staker-index tx-sender)
    
    ;; Update balances
    (var-set total-supply (+ (var-get total-supply) amount))
    (map-set balances tx-sender (+ (default-to u0 (map-get? balances tx-sender)) amount))
    
    (print {
      event: "staked",
      user: tx-sender,
      amount: amount
    })
    (ok true)
  )
)

;; Unstake tokens
(define-public (unstake (amount uint))
  (begin
    (asserts! (> amount u0) ERR-ZERO-AMOUNT)
    (asserts! (>= (default-to u0 (map-get? balances tx-sender)) amount) ERR-INSUFFICIENT-BALANCE)
    
    ;; Update rewards state
    (update-reward (some tx-sender))
    
    ;; Update balances
    (var-set total-supply (- (var-get total-supply) amount))
    (map-set balances tx-sender (- (default-to u0 (map-get? balances tx-sender)) amount))
    
    ;; Remove from staker index if no more stake
    (remove-staker-index tx-sender)
    
    (print {
      event: "unstaked",
      user: tx-sender,
      amount: amount
    })
    (ok true)
  )
)

;; Claim all pending rewards for the caller
(define-public (claim-reward)
  (begin
    ;; Update rewards state
    (update-reward (some tx-sender))
    
    (let ((reward (default-to u0 (map-get? rewards tx-sender))))
      (if (> reward u0)
        (begin
          (map-set rewards tx-sender u0)
          (print {
            event: "reward-claimed",
            user: tx-sender,
            reward: reward
          })
          (ok reward)
        )
        (ok u0)
      )
    )
  )
)

;; Add rewards to be distributed over the rewards duration (admin only)
(define-public (notify-reward-amount (reward uint))
  (begin
    (asserts! (is-owner) ERR-NOT-OWNER)
    
    ;; Update rewards state
    (update-reward none)
    
    (if (>= block-height (var-get period-finish))
      (var-set reward-rate (/ reward REWARDS-DURATION))
      (let ((remaining (- (var-get period-finish) block-height))
            (leftover (* remaining (var-get reward-rate))))
        (var-set reward-rate (/ (+ reward leftover) REWARDS-DURATION))
      )
    )
    
    (var-set last-update-time block-height)
    (var-set period-finish (+ block-height REWARDS-DURATION))
    
    (print {
      event: "reward-added",
      reward: reward
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

(define-read-only (get-total-supply)
  (var-get total-supply)
)

(define-read-only (get-reward-rate)
  (var-get reward-rate)
)

(define-read-only (get-last-update-time)
  (var-get last-update-time)
)

(define-read-only (get-reward-per-token-stored)
  (var-get reward-per-token-stored)
)

(define-read-only (get-period-finish)
  (var-get period-finish)
)

(define-read-only (get-balance (account principal))
  (default-to u0 (map-get? balances account))
)

(define-read-only (get-user-reward-per-token-paid (account principal))
  (default-to u0 (map-get? user-reward-per-token-paid account))
)

(define-read-only (get-rewards (account principal))
  (default-to u0 (map-get? rewards account))
)

(define-read-only (get-earned (account principal))
  (earned account)
)

(define-read-only (get-reward-per-token)
  (reward-per-token)
)

(define-read-only (get-last-time-reward-applicable)
  (last-time-reward-applicable)
)

(define-read-only (get-staker-count)
  (var-get staker-count)
)

(define-read-only (get-staker-at (index uint))
  (map-get? staker-at index)
)

(define-read-only (is-staker (account principal))
  (default-to false (map-get? staker-status account))
)

(define-read-only (get-time-left)
  (if (>= block-height (var-get period-finish))
    u0
    (- (var-get period-finish) block-height)
  )
)
