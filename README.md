# Jagantara (on Stacks)

Jagantara is a decentralized insurance for Digital Assets + staking platform on **Stacks** (Clarity) that supports **real on-chain settlement** across **USDCx / sBTC / STX** and includes an **x402-style payment gate** for AI-agent actions.



## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Jagantara Frontend                        │
│              (Next.js + @stacks/connect)                     │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   Stacks Testnet                             │
│              (Bitcoin-Secured via PoX)                       │
│                                                              │
│  ┌──────────────────┐  ┌──────────────────┐  ┌────────────┐ │
│  │insurance-manager │  │  dao-governance  │  │claim-mgr   │ │
│  │                  │  │                  │  │            │ │
│  │ - pay-premium    │  │ - submit-claim   │  │ - claim    │ │
│  │ - transfer-rev   │  │ - vote           │  │            │ │
│  └────────┬─────────┘  └────────┬─────────┘  └─────▲──────┘ │
│           │                     │                  │        │
│           ▼                     ▼                  │        │
│  ┌──────────────────┐  ┌──────────────────┐       │        │
│  │    jaga-stake    │  │   jaga-token     │◄──────┘        │
│  │                  │  │   (SIP-010)      │                │
│  │ - stake          │  │ - mint/burn      │                │
│  │ - unstake        │  │ - transfer       │                │
│  └──────────────────┘  └──────────────────┘                │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Key Parameters

| Parameter | Value | Description |
|-----------|-------|-------------|
| **Voting Period** | 1008 blocks (~7 days) | Time for DAO voting |
| **Minimum Voting** | 720 blocks (~5 days) | Before execution allowed |
| **Approval Threshold** | 66% | Required for claim approval |
| **Claim Expiry** | 1008 blocks (~7 days) | Time to claim after approval |
| **Premium Duration** | 4320 blocks (~30 days) | Policy validity period |
| **Rewards Duration** | 4320 blocks (~30 days) | Staking reward period |

---

## Revenue Distribution

Premiums are distributed as follows:
- **30%** → JagaStake (staking rewards)
- **25%** → ClaimManager (claim payouts)
- **20%** → Owner
- **25%** → Treasury (morpho-reinvest)

---

## Tier System

| Tier | Premium Rate | Example (1000 USDCx coverage) |
|------|--------------|------------------------------|
| Tier 1 | 0.1% (10/100,000) | 1 USDCx premium |
| Tier 2 | 0.3% (30/100,000) | 3 USDCx premium |
| Tier 3 | 0.5% (50/100,000) | 5 USDCx premium |

---
 

## Getting Started

### Prerequisites

- [Clarinet](https://docs.hiro.so/clarinet/getting-started) v3.11+
- Node.js 18+ / npm
- Leather or Xverse wallet (for Stacks)

### Installation

```bash
cd stacks-contracts

# Install dependencies
npm install

# Check contracts compile
clarinet check

# Run tests
npm test

# Deploy to devnet
clarinet deployments apply --devnet
```
 

## Testing

```bash
cd stacks-contracts

# Run all tests
npm run test:all

# Run unit tests
npm test

# Run with coverage
npm run test:report
```

---

## Deployment

### Devnet
```bash
clarinet deployments apply --devnet
```

### Testnet
```bash
clarinet deployments apply --testnet
```

After deployment, update contract addresses in:
- Frontend: `jagantara/src/constants/abi.tsx`


## Testnet deployment

Deployer: `ST3DB3G0GA39FA8NZ5GG4FQ89D5AN6EJRJJ20R0SY`

Successfully deployed:
- `usdcx-token`
  - Tx: https://explorer.hiro.so/txid/83b59992020e355239ad1430a11bc5c2a31f18156060b0f8b1a3414c1f0e9b25?chain=testnet
  - Contract: https://explorer.hiro.so/txid/ST3DB3G0GA39FA8NZ5GG4FQ89D5AN6EJRJJ20R0SY.usdcx-token?chain=testnet
- `sbtc-token`
  - Tx: https://explorer.hiro.so/txid/ffedae8ffae2c77bfc0f53fb02622a68ceb700c84b031c9fff9479ccb2f88673?chain=testnet
  - Contract: https://explorer.hiro.so/txid/ST3DB3G0GA39FA8NZ5GG4FQ89D5AN6EJRJJ20R0SY.sbtc-token?chain=testnet
- `vault`
  - Tx: https://explorer.hiro.so/txid/eeb4764b4e9af32f98acfb4638252fcbc9493da6e56dea31024091a80d92ccb2?chain=testnet
  - Contract: https://explorer.hiro.so/txid/ST3DB3G0GA39FA8NZ5GG4FQ89D5AN6EJRJJ20R0SY.vault?chain=testnet
- `insurance-manager-v2`
  - Tx: https://explorer.hiro.so/txid/9d71c1195b55c17037dd2686afd8b79029b379b4542f7f964c3ddd3e4a3ba8c0?chain=testnet
  - Contract: https://explorer.hiro.so/txid/ST3DB3G0GA39FA8NZ5GG4FQ89D5AN6EJRJJ20R0SY.insurance-manager-v2?chain=testnet
- `claim-manager-v2`
  - Tx: https://explorer.hiro.so/txid/4de669c52a95363aded8e51cc221a720340b22230d9e542b6ff664f79fd8837e?chain=testnet
  - Contract: https://explorer.hiro.so/txid/ST3DB3G0GA39FA8NZ5GG4FQ89D5AN6EJRJJ20R0SY.claim-manager-v2?chain=testnet
- `dao-governance-v2`
  - Tx: https://explorer.hiro.so/txid/c7977d0124ff8d7ffc21fcfc3f709715a3148bc93251dbe39aa55242c6540ec4?chain=testnet
  - Contract: https://explorer.hiro.so/txid/ST3DB3G0GA39FA8NZ5GG4FQ89D5AN6EJRJJ20R0SY.dao-governance-v2?chain=testnet



## x402 payment for AI agents 

Jagantara exposes an MCP-compatible API route and server-side tool execution that can require a proof-of-payment (x402-like) on Stacks testnet.

### Where it lives
- API paywall enforcement: [`route.ts`](jagantara/src/app/api/mcp/route.ts:1)
- Payment requirement config + verification: [`stacks-x402.ts`](jagantara/src/lib/x402/stacks-x402.ts:47)
- AI-agent tools: [`mcp-server.ts`](jagantara/src/lib/mcp/mcp-server.ts:120)

### How it works
1) Client calls `POST /api/mcp` with tool name `buy_insurance_onchain` or `create_claim_onchain`.
2) Server checks payment requirement via [`getX402Requirement()`](jagantara/src/lib/x402/stacks-x402.ts:47).
3) Client must send a token transfer tx and include its txid in the header (default: `x-payment-txid`).
4) Server verifies the tx via [`verifyUsdcxTransferTxid()`](jagantara/src/lib/x402/stacks-x402.ts:106):
   - tx must be `contract_call`
   - contract must match `X402_USDCX_CONTRACT_ID`
   - function must be `transfer`
   - recipient must match `X402_MERCHANT_ADDRESS` (defaults to `NEXT_PUBLIC_DEPLOYER_ADDRESS`)
   - amount must be `>= X402_PRICE_*`
5) Server rejects replayed txids for a TTL window.

### Environment variables (x402)
Server-side:
- `X402_USDCX_CONTRACT_ID` (required) — token contract ID used for payment verification (SIP-010 USDCx)
- `X402_MERCHANT_ADDRESS` (optional) — recipient principal; defaults to `NEXT_PUBLIC_DEPLOYER_ADDRESS`
- `X402_HEADER_NAME` (optional) — defaults to `x-payment-txid`
- `X402_PRICE_BUY_INSURANCE` (optional) — default `100000` (uint)
- `X402_PRICE_SUBMIT_CLAIM` (optional) — default `50000` (uint)


---

## Resources

- [Stacks Documentation](https://docs.stacks.co/)
- [Clarity Language Reference](https://docs.stacks.co/clarity-language)
- [Clarinet Documentation](https://docs.hiro.so/clarinet)
- [Stacks SDK](https://github.com/hirosystems/stacks.js)
- [Leather Wallet](https://leather.io/)
- [Xverse Wallet](https://xverse.app/)
- [Stacks Explorer](https://explorer.hiro.so/)

---

## License

MIT

---

*Jagantara on Stacks - Secured by Bitcoin*



