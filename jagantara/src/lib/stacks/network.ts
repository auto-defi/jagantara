/**
 * Jagantara - Stacks Network Configuration
 * 
 * Network settings for connecting to Stacks blockchain
 */

import { StacksTestnet, StacksMainnet, StacksMocknet } from '@stacks/network';

// Network configuration
export const NETWORK_CONFIG = {
  testnet: {
    url: 'https://api.testnet.hiro.so',
    name: 'testnet',
    chainId: 0x80000000,
  },
  mainnet: {
    url: 'https://api.hiro.so',
    name: 'mainnet',
    chainId: 0x00000001,
  },
  devnet: {
    url: 'http://localhost:3999',
    name: 'devnet',
    chainId: 0x80000000,
  },
};

// Get current network from environment
const getNetworkName = (): string => {
  return process.env.NEXT_PUBLIC_NETWORK || 'testnet';
};

// Create network instance
export const getNetwork = () => {
  const networkName = getNetworkName();
  
  switch (networkName) {
    case 'mainnet':
      return new StacksMainnet();
    case 'devnet':
      return new StacksMocknet();
    case 'testnet':
    default:
      return new StacksTestnet();
  }
};

// Get API URL
export const getApiUrl = (): string => {
  const networkName = getNetworkName();
  return NETWORK_CONFIG[networkName as keyof typeof NETWORK_CONFIG].url;
};

// Get deployer address from environment
export const getDeployerAddress = (): string => {
  return process.env.NEXT_PUBLIC_DEPLOYER_ADDRESS || '';
};

// Contract addresses (update after deployment)
export const CONTRACT_ADDRESSES = {
  // Prefer explicit env vars when present (works for both v1 + v2 contract names)
  jagaToken:
    process.env.NEXT_PUBLIC_JAGA_TOKEN || `${getDeployerAddress()}.jaga-token`,
  jagaStake:
    process.env.NEXT_PUBLIC_JAGA_STAKE || `${getDeployerAddress()}.jaga-stake`,
  insuranceManager:
    process.env.NEXT_PUBLIC_INSURANCE_MANAGER ||
    `${getDeployerAddress()}.insurance-manager`,
  daoGovernance:
    process.env.NEXT_PUBLIC_DAO_GOVERNANCE || `${getDeployerAddress()}.dao-governance`,
  claimManager:
    process.env.NEXT_PUBLIC_CLAIM_MANAGER || `${getDeployerAddress()}.claim-manager`,
  morphoReinvest:
    process.env.NEXT_PUBLIC_MORPHO_REINVEST || `${getDeployerAddress()}.morpho-reinvest`,
};

// Stacks Connect configuration
export const AUTH_ORIGIN = typeof window !== 'undefined' ? window.location.origin : '';

export const APP_DETAILS = {
  name: 'Jagantara',
  icon: typeof window !== 'undefined' ? `${window.location.origin}/jagantara_icon.png` : '',
};
