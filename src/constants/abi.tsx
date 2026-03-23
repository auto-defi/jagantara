/**
 * Jagantara Contract Configuration for Stacks
 * 
 * Contract addresses on Stacks Testnet
 * These will be updated after deployment
 */

// Stacks contract addresses (format: ADDRESS.CONTRACT_NAME)
// The deployer address is set via environment variable
const DEPLOYER = process.env.NEXT_PUBLIC_DEPLOYER_ADDRESS || 'ST1PQHQKV0RJX28FYV8Z7QW8PGVMKWCYVQN0V3RB5';

export const CONTRACTS = {
  // Stacks Testnet contracts
  JAGA_TOKEN: `${DEPLOYER}.jaga-token`,
  JAGA_STAKE: `${DEPLOYER}.jaga-stake`,
  INSURANCE_MANAGER: `${DEPLOYER}.insurance-manager`,
  CLAIM_MANAGER: `${DEPLOYER}.claim-manager`,
  DAO_GOVERNANCE: `${DEPLOYER}.dao-governance`,
  MORPHO_REINVEST: `${DEPLOYER}.morpho-reinvest`,
  
  // USDC on Stacks (wrapped USDC or stablecoin)
  // Note: Stacks uses SIP-010 tokens, not ERC-20
  USDC: `${DEPLOYER}.usdc-token`, // Placeholder - update with actual USDC contract
} as const;

// Token configurations for Stacks
export const TOKENS = {
  JAGA: {
    address: CONTRACTS.JAGA_TOKEN,
    symbol: "JAGA",
    name: "JagaDAO Token",
    decimals: 6, // Stacks standard
    logo: "🛡️",
  },
  USDC: {
    address: CONTRACTS.USDC,
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
    logo: "💵",
  },
  STX: {
    address: "STX", // Native token
    symbol: "STX",
    name: "Stacks",
    decimals: 6,
    logo: "₿",
  },
} as const;

// Clarity function names for contract calls
export const CLARITY_FUNCTIONS = {
  JAGA_TOKEN: {
    MINT: 'mint',
    BURN: 'burn',
    TRANSFER: 'transfer',
    GET_BALANCE: 'get-balance',
    GET_TOTAL_SUPPLY: 'get-total-supply',
    GET_NAME: 'get-name',
    GET_SYMBOL: 'get-symbol',
    GET_DECIMALS: 'get-decimals',
  },
  JAGA_STAKE: {
    STAKE: 'stake',
    UNSTAKE: 'unstake',
    CLAIM_REWARD: 'claim-reward',
    GET_BALANCE: 'get-balance',
    GET_REWARDS: 'get-rewards',
    GET_EARNED: 'get-earned',
    GET_TOTAL_SUPPLY: 'get-total-supply',
    GET_STAKER_COUNT: 'get-staker-count',
    IS_STAKER: 'is-staker',
  },
  INSURANCE_MANAGER: {
    INITIALIZE_TIERS: 'initialize-tiers',
    PAY_PREMIUM: 'pay-premium',
    TRANSFER_REVENUE: 'transfer-revenue',
    IS_ACTIVE: 'is-active',
    GET_POLICY: 'get-policy',
    GET_PREMIUM_PRICE: 'get-premium-price',
    GET_TOTAL_USERS: 'get-total-users',
    GET_TOTAL_COLLECTED: 'get-total-collected',
  },
  DAO_GOVERNANCE: {
    SUBMIT_CLAIM: 'submit-claim',
    VOTE: 'vote',
    EXECUTE_VOTE: 'execute-vote',
    IS_CLAIM_APPROVED: 'is-claim-approved',
    GET_CLAIM: 'get-claim',
    GET_CLAIM_STATUS: 'get-claim-status',
    GET_CLAIM_DATA: 'get-claim-data',
    GET_CLAIM_COUNTER: 'get-claim-counter',
  },
  CLAIM_MANAGER: {
    CLAIM_PAYOUT: 'claim-payout',
    VAULT_BALANCE: 'vault-balance',
    GET_CLAIM_EXECUTED: 'get-claim-executed',
  },
  MORPHO_REINVEST: {
    DEPOSIT: 'deposit',
    WITHDRAW: 'withdraw',
    DEPOSIT_IN_VAULT: 'deposit-in-vault',
    TREASURY_BALANCE: 'treasury-balance',
  },
} as const;

// Export legacy ABI references for backward compatibility
// These are no longer used on Stacks but kept for reference
export const ERC20_ABI = [];
export const USDC_ABI = [];
export const JAGA_TOKEN_ABI = [];
export const JAGA_STAKE_ABI = [];
export const INSURANCE_MANAGER_ABI = [];
export const CLAIM_MANAGER_ABI = [];
export const DAO_GOVERNANCE_ABI = [];
export const MORPHO_ABI = [];
export const MORPHO_REINVEST_ABI = [];

// Default export
export default {
  CONTRACTS,
  TOKENS,
  CLARITY_FUNCTIONS,
};
