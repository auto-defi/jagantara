<p align="center">
  <img src="https://github.com/auto-defi/jagantara/blob/main/jagantara/public/jagantara_icon.png" alt="Jagantara logo" width="120" />
</p>
<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-0ea5e9.svg" alt="License: MIT" /></a>
  <img src="https://img.shields.io/badge/chain-BNB%20Smart%20Chain%20Testnet%20(EVM)-F3BA2F?logo=binance" alt="Chain: BNB Smart Chain Testnet" />
  <img src="https://img.shields.io/badge/chain%20id-97-2563eb" alt="Chain ID 97" />
  <img src="https://img.shields.io/badge/Jagantara-Next.js%2014-000000?logo=nextdotjs" alt="Next.js 14" />
  <img src="https://img.shields.io/badge/indexer-Ponder-0ea5e9" alt="Ponder" />
  <img src="https://img.shields.io/badge/contracts-Foundry-f97316" alt="Foundry" />
</p>

<hr/>

# Jagantara — Decentralized Insurance for Digital Assets (BNB Smart Chain Testnet)

On‑chain, DAO‑governed insurance that protects crypto users and protocols with transparent claims, sustainable reserves, and a great UX. Built on BNB Smart Chain Testnet for fast, low‑cost finality.



## Table of Contents
- Overview
 - Deployed Contracts (BNB Smart Chain Testnet)
- External Dependencies (Reused)
- Monorepo Structure
- Quickstart
  - Environment
  - Run the Indexer (GraphQL)
  - Run the Frontend Jagantara (Next.js)
  - Build Smart Contracts (Foundry)
- Addresses & Links
- License

---

## Overview
Jagantara delivers end‑to‑end, on‑chain insurance:
- Buy coverage, stake/earn, file claims, and govern payouts — all on‑chain
- Transparent claims adjudication via DAO governance
- Ponder indexer for fast querying and dashboards
- Conservative vault strategy module to help sustain reserves


## Data Flow

```text
[1] Staking & Indexing
────────────────────────────────────────────────────────────────────
User Wallet ──signs tx──> Next.js (useStake hook)
     |                       |
     |                       | 1) USDC.approve(JagaStake, amount)
     |                       | 2) JagaStake.stake(amount)
     v                       v
 BNB Smart Chain Testnet (JagaStake) ── emits events ──> Indexer (Ponder)
                                         └─► onchain tables:
                                            - stakes
                                            - unstakes
                                            - reward_claims
                                            - reward_sessions
                                         └─► GraphQL API (/graphql)
                                                     │
                                                     ▼
                                         Next.js (Apollo Client)
```

```text
[2] Premium Payment & Revenue Split
────────────────────────────────────────────────────────────────────
Next.js (useInsuranceManager)
   └── getPriceFromAmountTier() ─►
   └── USDC.approve(InsuranceManager, totalPremium) ─►
   └── payPremium(tier, duration, covered, amount) ─►
                           │
                           ▼
                    BNB Smart Chain Testnet (InsuranceManager)
                           │ monthly split
          ┌───────────────┼─────────────────────┬───────────────┐
          ▼               ▼                     ▼               ▼
   ClaimManager      JagaStake             Owner (20%)    MorphoReinvest
   (25% premiums)    (30% -> rewards)                       (25%)
          │               │                                  │
          ▼               ▼                                  ▼
   Payout vault     notifyRewardAmount()             Morpho Vault deposit
```

```text
[3] Claims Governance & Payout
────────────────────────────────────────────────────────────────────
User ── submitClaim(...) ─► DAOGovernance (BNB Smart Chain Testnet)
                               │ votes (JagaToken holders)
                               ▼
                      ┌─────────────────────────────────┐
                      │  Decision window:               │
                      │  - Approve if yes ≥ 66% after   │
                      │    ≥ 5 days                     │
                      │  - Reject if not reached after  │
                      │    7 days total                 │
                      └─────────────────────────────────┘
                               │
                ┌──────────────┴───────────────┐
                ▼                              ▼
         Approved                         Rejected
                │
                ▼
   ClaimManager (BNB Smart Chain Testnet).claimPayout(claimId) ─► USDC → claimant
```

## System Architecture

```text
                   +-----------------------+
                   |   Browser / Wallet    |
                   | (Reown, Xellar, wagmi)|
                   +-----------+-----------+
                               |
                               | UI + Tx signatures
                               v
+----------------------+       +------------------------------+
| Next.js Frontend     |<----->| Indexer (Ponder + Hono)      |
| (Jagantara)          |  HTTP | - Event listeners            |
| - React pages/hooks  | GraphQL| - onchain tables (stakes...) |
| - viem/wagmi/ethers  |       | - DB (Ponder-managed)        |
| - Apollo Client      |       | - /graphql, /sql endpoints   |
| - Jagabot (MCP)      |       +--------------+---------------+
+----------+-----------+                      ^
           |                                  |
           | JSON-RPC                     | GraphQL queries
           v                                  |
+----------+-----------+    emits events      |
| BNB Smart Chain Testnet |----------------------+
| - InsuranceManager   |
| - JagaStake/JagaToken|
| - DAOGovernance      |
| - ClaimManager       |
| - MorphoReinvest     |
| - USDC, Morpho Vault |
+----------------------+
```


---

## Deployed Contracts (BNB Smart Chain Testnet · Chain ID 97)
- InsuranceManager — `0xD6E6391a87B47885E1133068d27956d1c52C52A5`
  - https://testnet.bscscan.com/address/0xD6E6391a87B47885E1133068d27956d1c52C52A5
- JagaStake — `0x0ba73ebe6da9Ce35340d696e00FCE64Ed4A2FAc3`
  - https://testnet.bscscan.com/address/0x0ba73ebe6da9Ce35340d696e00FCE64Ed4A2FAc3
- JagaToken — `0xae7fc51CC770B23Bea3bA160fEb088467E37F000`
  - https://testnet.bscscan.com/address/0xae7fc51CC770B23Bea3bA160fEb088467E37F000
- DAOGovernance — `0x644b0B7d1078ccBD7dF98fB71dC50704A3de9E65`
  - https://testnet.bscscan.com/address/0x644b0B7d1078ccBD7dF98fB71dC50704A3de9E65
- ClaimManager — `0x7FEf88ACD8d7F41FCc86566E2C853636463478c5`
  - https://testnet.bscscan.com/address/0x7FEf88ACD8d7F41FCc86566E2C853636463478c5
- MorphoReinvest — `0x5125e8020cA0066a9072A4B9ad54d80D4e6C7980`
  - https://testnet.bscscan.com/address/0x5125e8020cA0066a9072A4B9ad54d80D4e6C7980

- MockUSDC — `0x32BC3202d410d4aE76C1f973517B13986Ac967cF`
  - https://testnet.bscscan.com/address/0x32BC3202d410d4aE76C1f973517B13986Ac967cF
- MockMorphoVault — `0x2D32a4b5C11F9bEAb55057b80567BDFe54889FBA`
  - https://testnet.bscscan.com/address/0x2D32a4b5C11F9bEAb55057b80567BDFe54889FBA


---

## Monorepo Structure
- Jagantara — Next.js 14 app (frontend)
- indexer — Ponder indexer (GraphQL API)
- smart-contract — Solidity contracts (Foundry)


---

## Quickstart
Prerequisites: Node.js 18+, npm, Foundry (for contracts), Git.

```bash
git clone https://github.com/auto-defi/jagantara
```

### 1) Environment
- Jagantara: Jagantara/.env.local 
- Indexer: indexer/.env 

### 2) Run the Indexer (GraphQL)
```bash
cd indexer
npm install
# Load env, set schema, and start
set -a && . ./.env && set +a && DATABASE_SCHEMA=app npm run start
# Health:   http://localhost:42069/health
# Ready:    http://localhost:42069/ready
# GraphQL:  http://localhost:42069/graphql
```

### 3) Run the Frontend (Next.js)
```bash
cd Jagantara
npm install
npm run dev
# App: http://localhost:3000
```

### 4) Build Smart Contracts (Foundry)
```bash
cd smart-contract
forge build
forge test
# Deploy example:
# forge script script/DeployJagantara.s.sol:DeployJagantara --rpc-url $BSC_RPC --private-key $PK --broadcast --slow --legacy
```

---

## Addresses & Links
- Chain: BNB Smart Chain Testnet — chain id 97
- RPC: https://data-seed-prebsc-1-s1.binance.org:8545/
- BSCScan: https://testnet.bscscan.com

---

## License
MIT 

