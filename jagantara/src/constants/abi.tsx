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
 * Jagantara Contract Addresses on BNB Smart Chain
 *
 * IMPORTANT: Update these addresses after deploying contracts to BNB Smart Chain
 * Deployment guide: smart-contract/DEPLOYMENT_GUIDE.md
 *
 * BNB Smart Chain Mainnet:
 * Chain ID: 56 (0x38 in hex)
 * Explorer: https://bscscan.com
 * RPC: https://bsc-dataseed.bnbchain.org
 *
 * BNB Smart Chain Testnet:
 * Chain ID: 97 (0x61 in hex)
 * Explorer: https://testnet.bscscan.com
 * RPC: https://bsc-testnet-dataseed.bnbchain.org
 */

// BNB Smart Chain Mainnet Contract Addresses
export const BSC_MAINNET_CONTRACTS = {
  // Update these addresses after deploying to BSC Mainnet
  USDC: "0x0000000000000000000000000000000000000000",
  JAGA_TOKEN: "0x0000000000000000000000000000000000000000",
  INSURANCE_MANAGER: "0x0000000000000000000000000000000000000000",
  JAGA_STAKE: "0x0000000000000000000000000000000000000000",
  MORPHO: "0x0000000000000000000000000000000000000000",
  CLAIM_MANAGER: "0x0000000000000000000000000000000000000000",
  DAO_GOVERNANCE: "0x0000000000000000000000000000000000000000",
  MORPHO_REINVEST: "0x0000000000000000000000000000000000000000",
} as const;

// BNB Smart Chain Testnet Contract Addresses
export const BSC_TESTNET_CONTRACTS = {
  // Deployed on BNB Smart Chain Testnet (Chain ID: 97)
  USDC: "0x32BC3202d410d4aE76C1f973517B13986Ac967cF",
  JAGA_TOKEN: "0xae7fc51CC770B23Bea3bA160fEb088467E37F000",
  INSURANCE_MANAGER: "0xD6E6391a87B47885E1133068d27956d1c52C52A5",
  JAGA_STAKE: "0x0ba73ebe6da9Ce35340d696e00FCE64Ed4A2FAc3",
  MORPHO: "0x2D32a4b5C11F9bEAb55057b80567BDFe54889FBA",
  CLAIM_MANAGER: "0x7FEf88ACD8d7F41FCc86566E2C853636463478c5",
  DAO_GOVERNANCE: "0x644b0B7d1078ccBD7dF98fB71dC50704A3de9E65",
  MORPHO_REINVEST: "0x5125e8020cA0066a9072A4B9ad54d80D4e6C7980",
} as const;

// Default contracts (will be selected based on current network)
export const CONTRACTS = BSC_TESTNET_CONTRACTS;

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
