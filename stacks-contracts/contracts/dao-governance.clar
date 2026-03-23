;; dao-governance.clar
;; Jagantara DAO Governance Contract for Stacks
;; Migrated from Solidity to Clarity

;; Constants
(define-constant CONTRACT-OWNER tx-sender)
(define-constant VOTING-DURATION u144) ;; ~1 day in blocks (10 min blocks)
(define-constant PROPOSAL-THRESHOLD u1000000) ;; 1M JAGA tokens needed to propose
(define-constant QUORUM-PERCENT u10) ;; 10% quorum required

;; Error codes
(define-constant ERR-NOT-AUTHORIZED (err u100))
(define-constant ERR-PROPOSAL-NOT-FOUND (err u101))
(define-constant ERR-PROPOSAL-EXPIRED (err u102))
(define-constant ERR-PROPOSAL-STILL-ACTIVE (err u103))
(define-constant ERR-ALREADY-VOTED (err u104))
(define-constant ERR-INSUFFICIENT-STAKE (err u105))
(define-constant ERR-PROPOSAL-NOT-EXECUTABLE (err u106))

;; Data structures
;; Proposal structure
(define-map proposals
  { id: uint }
  {
    proposer: principal,
    description: (string-ascii 500),
    start-block: uint,
    end-block: uint,
    for-votes: uint,
    against-votes: uint,
    executed: bool,
    canceled: bool
  }
)

;; Vote record
(define-map votes
  { proposal-id: uint, voter: principal }
  {
    support: bool,
    voting-power: uint
  }
)

;; Proposal counter
(define-data-var proposal-count uint u0)

;; Voting power tracking (simplified - in production would integrate with staking contract)
(define-map voting-power principal uint)

;; Events
(define-map proposal-events
  { proposal-id: uint }
  { event-type: (string-ascii 50), data: (string-ascii 500) }
)

;; Internal functions

;; Get the voting power of a user
(define-read-only (get-voting-power (user principal))
  (default-to u0 (map-get? voting-power user))
)

;; Set voting power (for testing - in production would be set by staking contract)
(define-public (set-voting-power (user principal) (power uint))
  (begin
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-NOT-AUTHORIZED)
    (map-set voting-power user power)
    (ok true)
  )
)

;; Get proposal by ID
(define-read-only (get-proposal (id uint))
  (map-get? proposals { id: id })
)

;; Get vote record
(define-read-only (get-vote (proposal-id uint) (voter principal))
  (map-get? votes { proposal-id: proposal-id, voter: voter })
)

;; Check if proposal is active
(define-read-only (is-proposal-active (id uint))
  (let ((proposal (unwrap! (get-proposal id) false)))
    (and
      (>= block-height (get start-block proposal))
      (< block-height (get end-block proposal))
      (not (get executed proposal))
      (not (get canceled proposal))
    )
  )
)

;; Check if proposal is executable
(define-read-only (is-proposal-executable (id uint))
  (let ((proposal (unwrap! (get-proposal id) false)))
    (and
      (>= block-height (get end-block proposal))
      (not (get executed proposal))
      (not (get canceled proposal))
      (> (get for-votes proposal) (get against-votes proposal))
      (>= (get for-votes proposal) 
          (/ (* (get for-votes proposal) QUORUM-PERCENT) u100))
    )
  )
)

;; Public functions

;; Create a new proposal
(define-public (propose (description (string-ascii 500)))
  (let (
    (proposer tx-sender)
    (current-block block-height)
    (proposal-id (var-get proposal-count))
    (voting-power-user (get-voting-power proposer))
  )
    ;; Check if proposer has enough stake
    (asserts! (>= voting-power-user PROPOSAL-THRESHOLD) ERR-INSUFFICIENT-STAKE)
    
    ;; Create proposal
    (map-set proposals 
      { id: proposal-id }
      {
        proposer: proposer,
        description: description,
        start-block: current-block,
        end-block: (+ current-block VOTING-DURATION),
        for-votes: u0,
        against-votes: u0,
        executed: false,
        canceled: false
      }
    )
    
    ;; Increment proposal count
    (var-set proposal-count (+ proposal-id u1))
    
    (ok proposal-id)
  )
)

;; Vote on a proposal
(define-public (vote (proposal-id uint) (support bool))
  (let (
    (voter tx-sender)
    (proposal (unwrap! (get-proposal proposal-id) ERR-PROPOSAL-NOT-FOUND))
    (voting-power-user (get-voting-power voter))
  )
    ;; Check if proposal is active
    (asserts! (is-proposal-active proposal-id) ERR-PROPOSAL-EXPIRED)
    
    ;; Check if already voted
    (asserts! (is-none (get-vote proposal-id voter)) ERR-ALREADY-VOTED)
    
    ;; Record vote
    (map-set votes 
      { proposal-id: proposal-id, voter: voter }
      {
        support: support,
        voting-power: voting-power-user
      }
    )
    
    ;; Update proposal vote counts
    (if support
      (map-set proposals 
        { id: proposal-id }
        (merge proposal { for-votes: (+ (get for-votes proposal) voting-power-user) })
      )
      (map-set proposals 
        { id: proposal-id }
        (merge proposal { against-votes: (+ (get against-votes proposal) voting-power-user) })
      )
    )
    
    (ok true)
  )
)

;; Execute a proposal
(define-public (execute-proposal (proposal-id uint))
  (let ((proposal (unwrap! (get-proposal proposal-id) ERR-PROPOSAL-NOT-FOUND)))
    ;; Check if proposal is executable
    (asserts! (is-proposal-executable proposal-id) ERR-PROPOSAL-NOT-EXECUTABLE)
    
    ;; Mark as executed
    (map-set proposals 
      { id: proposal-id }
      (merge proposal { executed: true })
    )
    
    (ok true)
  )
)

;; Cancel a proposal (only proposer)
(define-public (cancel-proposal (proposal-id uint))
  (let ((proposal (unwrap! (get-proposal proposal-id) ERR-PROPOSAL-NOT-FOUND)))
    ;; Only proposer can cancel
    (asserts! (is-eq tx-sender (get proposer proposal)) ERR-NOT-AUTHORIZED)
    
    ;; Check if proposal is still active
    (asserts! (is-proposal-active proposal-id) ERR-PROPOSAL-EXPIRED)
    
    ;; Mark as canceled
    (map-set proposals 
      { id: proposal-id }
      (merge proposal { canceled: true })
    )
    
    (ok true)
  )
)

;; Read-only functions

;; Get proposal count
(define-read-only (get-proposal-count)
  (var-get proposal-count)
)

;; Get quorum percent
(define-read-only (get-quorum-percent)
  QUORUM-PERCENT
)

;; Get proposal threshold
(define-read-only (get-proposal-threshold)
  PROPOSAL-THRESHOLD
)

;; Get voting duration
(define-read-only (get-voting-duration)
  VOTING-DURATION
)
