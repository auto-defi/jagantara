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
  jagaToken: `${getDeployerAddress()}.jaga-token`,
  jagaStake: `${getDeployerAddress()}.jaga-stake`,
  insuranceManager: `${getDeployerAddress()}.insurance-manager`,
  daoGovernance: `${getDeployerAddress()}.dao-governance`,
  claimManager: `${getDeployerAddress()}.claim-manager`,
  morphoReinvest: `${getDeployerAddress()}.morpho-reinvest`,
};

// Stacks Connect configuration
export const AUTH_ORIGIN = typeof window !== 'undefined' ? window.location.origin : '';

export const APP_DETAILS = {
  name: 'Jagantara',
  icon: typeof window !== 'undefined' ? `${window.location.origin}/jagantara_icon.png` : '',
};
