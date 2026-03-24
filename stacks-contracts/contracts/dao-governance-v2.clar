;; dao-governance-v2.clar
;; Jagantara DAO Governance (Claims) Contract for Stacks (Multi-asset Settlement)
;;
;; This version stores `asset` per claim and integrates with:
;; - insurance-manager-v2
;; - claim-manager-v2

(define-constant VOTING-PERIOD u1008)
(define-constant MIN-VOTING u720)

(define-constant THRESH-NUM u2)
(define-constant THRESH-DEN u3)

;; Errors
(define-constant ERR-NOT-FOUND (err u101))
(define-constant ERR-EXPIRED (err u102))
(define-constant ERR-STILL-ACTIVE (err u103))
(define-constant ERR-ALREADY-VOTED (err u104))
(define-constant ERR-NOT-EXECUTABLE (err u106))
(define-constant ERR-NOT-INSURED (err u107))
(define-constant ERR-ZERO-AMOUNT (err u108))
(define-constant ERR-INVALID-ASSET (err u109))

;; Asset identifiers (kept consistent with vault)
(define-constant ASSET-USDCX u1)
(define-constant ASSET-SBTC u2)
(define-constant ASSET-STX u3)

(define-private (is-valid-asset (asset uint))
  (or (is-eq asset ASSET-USDCX)
      (is-eq asset ASSET-SBTC)
      (is-eq asset ASSET-STX))
)

(define-map claims
  { id: uint }
  {
    claimant: principal,
    title: (string-ascii 64),
    reason: (string-ascii 500),
    claim-type: uint,
    asset: uint,
    amount: uint,
    start-block: uint,
    end-block: uint,
    for-votes: uint,
    against-votes: uint,
    executed: bool,
    approved: bool
  }
)

(define-map claim-votes { claim-id: uint, voter: principal } bool)
(define-data-var claim-counter uint u0)

;; ----------------------------
;; Read-only
;; ----------------------------

(define-read-only (get-claim-counter) (var-get claim-counter))
(define-read-only (get-claim (claim-id uint)) (map-get? claims { id: claim-id }))
(define-read-only (get-claim-data (claim-id uint)) (map-get? claims { id: claim-id }))

(define-read-only (get-claim-status (claim-id uint))
  (match (map-get? claims { id: claim-id })
    c (if (get executed c)
        u3
        (if (get approved c) u1 u0)
      )
    u0
  )
)

(define-read-only (is-claim-approved (claim-id uint))
  (match (map-get? claims { id: claim-id })
    c (get approved c)
    false
  )
)

(define-read-only (get-voting-duration) VOTING-PERIOD)

;; Compatibility stubs
(define-public (propose (description (string-ascii 500)))
  (begin (print { event: "proposal-stub", description: description }) (ok u0))
)

(define-public (execute-proposal (proposal-id uint))
  (begin (print { event: "execute-proposal-stub", proposal-id: proposal-id }) (ok true))
)

;; ----------------------------
;; Public
;; ----------------------------

(define-public (submit-claim
  (reason (string-ascii 500))
  (title (string-ascii 64))
  (claim-type uint)
  (amount uint)
)
  (begin
    (asserts! (> amount u0) ERR-ZERO-AMOUNT)
    (asserts! (contract-call? .insurance-manager-v2 is-active tx-sender) ERR-NOT-INSURED)

    (let (
      (id (var-get claim-counter))
      (asset (match (contract-call? .insurance-manager-v2 get-policy tx-sender)
              p (get asset p)
              ASSET-USDCX))
      (start block-height)
      (end (+ block-height VOTING-PERIOD))
    )
      (asserts! (is-valid-asset asset) ERR-INVALID-ASSET)
      (map-set claims { id: id } {
        claimant: tx-sender,
        title: title,
        reason: reason,
        claim-type: claim-type,
        asset: asset,
        amount: amount,
        start-block: start,
        end-block: end,
        for-votes: u0,
        against-votes: u0,
        executed: false,
        approved: false
      })
      (var-set claim-counter (+ id u1))
      (print { event: "claim-submitted", claim-id: id, claimant: tx-sender, asset: asset, amount: amount })
      (ok id)
    )
  )
)

(define-public (submit-claim-asset
  (asset uint)
  (reason (string-ascii 500))
  (title (string-ascii 64))
  (claim-type uint)
  (amount uint)
)
  (begin
    (asserts! (is-valid-asset asset) ERR-INVALID-ASSET)
    (asserts! (> amount u0) ERR-ZERO-AMOUNT)
    (asserts! (contract-call? .insurance-manager-v2 is-active tx-sender) ERR-NOT-INSURED)

    (let (
      (id (var-get claim-counter))
      (start block-height)
      (end (+ block-height VOTING-PERIOD))
    )
      (map-set claims { id: id } {
        claimant: tx-sender,
        title: title,
        reason: reason,
        claim-type: claim-type,
        asset: asset,
        amount: amount,
        start-block: start,
        end-block: end,
        for-votes: u0,
        against-votes: u0,
        executed: false,
        approved: false
      })
      (var-set claim-counter (+ id u1))
      (print { event: "claim-submitted", claim-id: id, claimant: tx-sender, asset: asset, amount: amount })
      (ok id)
    )
  )
)

(define-public (vote (claim-id uint) (approve bool))
  (let ((c (unwrap! (map-get? claims { id: claim-id }) ERR-NOT-FOUND)))
    (begin
      (asserts! (< block-height (get end-block c)) ERR-EXPIRED)
      (asserts! (is-none (map-get? claim-votes { claim-id: claim-id, voter: tx-sender })) ERR-ALREADY-VOTED)
      (map-set claim-votes { claim-id: claim-id, voter: tx-sender } approve)
      (if approve
        (map-set claims { id: claim-id } (merge c { for-votes: (+ (get for-votes c) u1) }))
        (map-set claims { id: claim-id } (merge c { against-votes: (+ (get against-votes c) u1) }))
      )
      (ok true)
    )
  )
)

(define-private (passes-threshold (for uint) (against uint))
  (let ((total (+ for against)))
    (if (is-eq total u0)
      false
      (>= (* for THRESH-DEN) (* total THRESH-NUM))
    )
  )
)

(define-public (execute-vote (claim-id uint))
  (let ((c (unwrap! (map-get? claims { id: claim-id }) ERR-NOT-FOUND)))
    (begin
      (asserts! (not (get executed c)) ERR-NOT-EXECUTABLE)
      (asserts! (>= block-height (+ (get start-block c) MIN-VOTING)) ERR-STILL-ACTIVE)
      (asserts! (>= block-height (get end-block c)) ERR-STILL-ACTIVE)

      (let ((approved (passes-threshold (get for-votes c) (get against-votes c))))
        (map-set claims { id: claim-id } (merge c { executed: true, approved: approved }))

        (if approved
          (begin
            (try! (contract-call? .claim-manager-v2 submit-claim (get claimant c) (get asset c) (get amount c)))
            (print { event: "claim-approved", claim-id: claim-id })
            (ok true)
          )
          (begin
            (print { event: "claim-rejected", claim-id: claim-id })
            (ok false)
          )
        )
      )
    )
  )
)

