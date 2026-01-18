<p align="center">
  <img src="jagantara/public/jagantara_icon.png" alt="Jaga logo" width="120" />
</p>


<hr/>

# Jagantara — Decentralized Insurance for Digital Assets

On‑chain, DAO‑governed insurance that protects crypto users and protocols with transparent claims, sustainable reserves, and a great UX. Built on Mantle EVM for fast, low‑cost finality.

---

## Table of Contents
- Overview
- Deployed Contracts (Mantle Testnet)
- External Dependencies (Reused)
- Monorepo Structure
- Quickstart
  - Environment
  - Run the Indexer (GraphQL)
  - Run the Jagantara (Next.js)
  - Build Smart Contracts (Foundry)
- License

---

## Overview
Jagantara delivers end‑to‑end, on‑chain insurance:
- Buy coverage, stake/earn, file claims, and govern payouts — all on‑chain
- Transparent claims adjudication via DAO governance
- Ponder indexer for fast querying and dashboards
- Conservative vault strategy module to help sustain reserves

---

## Deployed Contracts (Mantle Testnet)
- InsuranceManager,JagaStake, JagaToken, DAOGovernance and ClaimManager Deployed by wallet address 0xfae70639b30ab9b59a579fca17f3d4bd1e57a379 https://sepolia.mantlescan.xyz/address/0xfae70639b30ab9b59a579fca17f3d4bd1e57a379


---

## Monorepo Structure
- Jagantara — Next.js 14 app (jagantara)
- indexer — Ponder indexer (GraphQL API)
- smart-contract — Solidity contracts (Foundry)


---

## Quickstart
Prerequisites: Node.js 18+, npm, Foundry (for contracts), Git.

### 1) Environment
- Jagantara: jaga/.env.local (already wired)
- Indexer: indexer/.env (already wired)
  - Ensure DATABASE_SCHEMA is set (e.g., `DATABASE_SCHEMA=app`)

### 2) Run the Indexer (GraphQL)
```bash
cd indexer
npm install
# Load env, set schema, and start
set -a && . ./.env && set +a && DATABASE_SCHEMA=app npm run start
```

### 3) Run the Jagantara (Next.js)
```bash
cd jagantara
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
# forge script script/DeployJaga.s.sol:DeployJaga --rpc-url $MANTLE_RPC --private-key $PK --broadcast --slow --legacy
```

---


## License
MIT 

