;; claim-manager.clar
;; Jagantara - Claim Payout Management Contract
;;
;; Manages claim payouts to users once they are approved by DAO governance.
;; Claims must be approved by DAO and can only be withdrawn within 7 days of approval.

;; ============================================================================
;; Constants
;; ============================================================================

;; Claim expiry: 7 days = 1008 blocks
(define-constant CLAIM-EXPIRY u1008)
(define-constant ERR-NOT-OWNER (err u100))
(define-constant ERR-ALREADY-PAID (err u102))
(define-constant ERR-NOT-CLAIMANT (err u103))
(define-constant ERR-CLAIM-EXPIRED (err u105))
(define-constant ERR-CLAIM-NOT-FOUND (err u107))
(define-constant ERR-INSUFFICIENT-BALANCE (err u108))

;; ============================================================================
;; Data Variables
;; ============================================================================

(define-data-var owner principal tx-sender)

;; ============================================================================
;; Maps
;; ============================================================================

;; Track if a claim has been executed/paid
(define-map claim-executed uint bool)

;; Claim data stored locally
(define-map claims
  { id: uint }
  {
    claimant: principal,
    amount: uint,
    approved-at: uint,
    executed: bool
  }
)

;; Claim counter
(define-data-var claim-count uint u0)

;; Contract balance (simplified - in production would use actual token balance)
(define-data-var contract-balance uint u0)

;; ============================================================================
;; Private Helpers
;; ============================================================================

(define-private (is-owner)
  (is-eq tx-sender (var-get owner))
)

;; ============================================================================
;; Public Functions - Admin
;; ============================================================================

;; Fund the contract for payouts
(define-public (fund-contract (amount uint))
  (begin
    (asserts! (is-owner) ERR-NOT-OWNER)
    (var-set contract-balance (+ (var-get contract-balance) amount))
    (print {
      event: "contract-funded",
      amount: amount,
      new-balance: (var-get contract-balance)
    })
    (ok true)
  )
)

;; ============================================================================
;; Public Functions - Claim Management
;; ============================================================================

;; Submit a claim (called by owner or authorized contract)
(define-public (submit-claim (claimant principal) (amount uint))
  (begin
    ;; For now, only owner can submit claims
    ;; In production, this would be called by DAO governance
    (asserts! (is-owner) ERR-NOT-OWNER)
    (let ((claim-id (var-get claim-count))
          (approved-block block-height))
      (map-set claims
        { id: claim-id }
        {
          claimant: claimant,
          amount: amount,
          approved-at: approved-block,
          executed: false
        }
      )
      (var-set claim-count (+ claim-id u1))
      (print {
        event: "claim-submitted",
        claim-id: claim-id,
        claimant: claimant,
        amount: amount
      })
      (ok claim-id)
    )
  )
)

;; Claim payout - allows claimant to withdraw approved claim
(define-public (claim-payout (claim-id uint))
  (let ((claim (unwrap! (map-get? claims { id: claim-id }) ERR-CLAIM-NOT-FOUND)))
    (let (
      (claimant (get claimant claim))
      (amount (get amount claim))
      (approved-at (get approved-at claim))
      (current-block block-height)
    )
      (begin
        ;; Check not already paid
        (asserts! (not (default-to false (map-get? claim-executed claim-id))) ERR-ALREADY-PAID)
        
        ;; Verify caller is claimant
        (asserts! (is-eq tx-sender claimant) ERR-NOT-CLAIMANT)
        
        ;; Verify claim hasn't expired
        (asserts! (<= current-block (+ approved-at CLAIM-EXPIRY)) ERR-CLAIM-EXPIRED)
        
        ;; Check contract balance
        (asserts! (>= (var-get contract-balance) amount) ERR-INSUFFICIENT-BALANCE)
        
        ;; Update balance
        (var-set contract-balance (- (var-get contract-balance) amount))
        
        ;; Mark as executed
        (map-set claim-executed claim-id true)
        (map-set claims { id: claim-id } (merge claim { executed: true }))
        
        (print {
          event: "claim-paid",
          claim-id: claim-id,
          claimant: claimant,
          amount: amount
        })
        (ok true)
      )
    )
  )
)

;; ============================================================================
;; Read-Only Functions
;; ============================================================================

(define-read-only (get-owner)
  (var-get owner)
)

(define-read-only (get-claim-executed (claim-id uint))
  (default-to false (map-get? claim-executed claim-id))
)

(define-read-only (get-claim-data (claim-id uint))
  (map-get? claims { id: claim-id })
)

(define-read-only (is-claim-approved (claim-id uint))
  (let ((claim (map-get? claims { id: claim-id })))
    (match claim
      c (> (get approved-at c) u0)
      false
    )
  )
)

(define-read-only (get-claim-count)
  (var-get claim-count)
)

(define-read-only (get-contract-balance)
  (var-get contract-balance)
)

(define-read-only (get-claim-expiry)
  CLAIM-EXPIRY
)
