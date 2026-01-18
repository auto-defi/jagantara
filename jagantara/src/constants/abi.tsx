import USDC_JSON from "./USDC_ABI.json";
import JAGATOKEN_JSON from "./JAGA_TOKEN_ABI.json";
import JAGASTAKE_JSON from "./JAGA_STAKE_ABI.json";
import INSURANCE_MANAGER_JSON from "./INSURANCE_MANAGER_ABI.json";
import CLAIM_MANAGER_JSON from "./CLAIM_MANAGER_ABI.json";
import DAO_GOVERNANCE_JSON from "./DAO_GOVERNANCE_ABI.json";
import ERC20_ABI_JSON from "./ERC20_ABI.json";
import MORPHO_ABI_JSON from "./MORPHO_ABI.json";
import MORPHO_REINVEST_ABI_JSON from "./MORPHO_REINVEST_ABI.json";

export const ERC20_ABI = ERC20_ABI_JSON;
export const USDC_ABI = USDC_JSON;
export const JAGA_TOKEN_ABI = JAGATOKEN_JSON;
export const JAGA_STAKE_ABI = JAGASTAKE_JSON;
export const INSURANCE_MANAGER_ABI = INSURANCE_MANAGER_JSON;
export const CLAIM_MANAGER_ABI = CLAIM_MANAGER_JSON;
export const DAO_GOVERNANCE_ABI = DAO_GOVERNANCE_JSON;
export const MORPHO_ABI = MORPHO_ABI_JSON;
export const MORPHO_REINVEST_ABI = MORPHO_REINVEST_ABI_JSON;

/**
 * Jagantara Contract Addresses on Mantle Sepolia
 *
 * IMPORTANT: Update these addresses after deploying contracts to Mantle Sepolia
 * Deployment guide: smart-contract/DEPLOYMENT_GUIDE.md
 *
 * Network: Mantle Sepolia
 * Chain ID: 5003
 * Explorer: https://sepolia.mantlescan.xyz
 */
export const CONTRACTS = {
  // Mantle Testnet (Sepolia) - Deployed 2026-01-11
  USDC: "0x5d4c4b84458edB1118A87ccE3D3EA8a6C2F82467",
  JAGA_TOKEN: "0xB6C7496676D6FcE9C4B6F3F5b67e3Ad9c7665a88",
  INSURANCE_MANAGER: "0xB73Ad4396797889D405D8F6Ff14a90F45Ee3549D",
  JAGA_STAKE: "0x278298c9573c6C3cD2b84543FcE485e9a3ACc73D",
  MORPHO: "0x55c550e645dAD52867EC3c517448EeA37dc1720B",
  CLAIM_MANAGER: "0x5348e52294c56C39F0F1c880DbE3e74dA50c19b9",
  DAO_GOVERNANCE: "0x58F68667B751fAFd5E25F54E3ACc5dEA6d7A4e7F",
  MORPHO_REINVEST: "0x628431C0A8172fc728a668e809498a675b6f556F",
} as const;

// Token configurations
export const TOKENS = {
  JAGA: {
    address: CONTRACTS.JAGA_TOKEN,
    symbol: "JAGA",
    name: "JagaDAO Token",
    decimals: 6,
    logo: "🛡️",
  },
  USDC: {
    address: CONTRACTS.USDC,
    symbol: "USDC",
    name: "USDC",
    decimals: 6,
    logo: "💵",
  },
} as const;
