/**
 * Jagantara - Stacks API Services
 * 
 * Service layer for interacting with Clarity smart contracts on Stacks
 */

import {
  callReadOnlyFunction,
  ClarityValue,
  ResponseCV,
  cvToValue,
} from '@stacks/transactions';
import { getNetwork, getApiUrl, CONTRACT_ADDRESSES } from './network';

// Helper to convert Clarity value to JavaScript
// Prefer cvToValue() to avoid depending on Clarity CV TS types that vary by version.
export const parseClarityValue = (value: ClarityValue): any => {
  if (!value) return null;
  return cvToValue(value, true);
};

// Generic read-only function caller
export const callReadOnly = async (options: {
  contractAddress: string;
  functionName: string;
  functionArgs?: ClarityValue[];
  senderAddress?: string;
}): Promise<any> => {
  try {
    const result = await callReadOnlyFunction({
      contractAddress: options.contractAddress,
      contractName: options.contractAddress.split('.')[1],
      functionName: options.functionName,
      functionArgs: options.functionArgs || [],
      senderAddress: options.senderAddress || '',
      network: getNetwork(),
    });
    
    return parseClarityValue(result);
  } catch (error) {
    console.error(`Error calling ${options.functionName}:`, error);
    throw error;
  }
};

// Insurance Manager Service
export const InsuranceService = {
  // Get policy for a user
  getPolicy: async (userAddress: string) => {
    return callReadOnly({
      contractAddress: CONTRACT_ADDRESSES.insuranceManager,
      functionName: 'get-policy',
      functionArgs: [],
      senderAddress: userAddress,
    });
  },

  // Check if policy is active
  isActive: async (userAddress: string) => {
    return callReadOnly({
      contractAddress: CONTRACT_ADDRESSES.insuranceManager,
      functionName: 'is-active',
      functionArgs: [],
      senderAddress: userAddress,
    });
  },

  // Get premium price
  getPremiumPrice: async (amountToCover: bigint, tier: bigint) => {
    return callReadOnly({
      contractAddress: CONTRACT_ADDRESSES.insuranceManager,
      functionName: 'get-premium-price',
      functionArgs: [],
    });
  },

  // Get total users
  getTotalUsers: async () => {
    return callReadOnly({
      contractAddress: CONTRACT_ADDRESSES.insuranceManager,
      functionName: 'get-total-users',
      functionArgs: [],
    });
  },

  // Get total collected
  getTotalCollected: async () => {
    return callReadOnly({
      contractAddress: CONTRACT_ADDRESSES.insuranceManager,
      functionName: 'get-total-collected',
      functionArgs: [],
    });
  },
};

// DAO Governance Service
export const DAOGovernanceService = {
  // Get claim by ID
  getClaim: async (claimId: bigint) => {
    return callReadOnly({
      contractAddress: CONTRACT_ADDRESSES.daoGovernance,
      functionName: 'get-claim',
      functionArgs: [],
    });
  },

  // Get claim status
  getClaimStatus: async (claimId: bigint) => {
    return callReadOnly({
      contractAddress: CONTRACT_ADDRESSES.daoGovernance,
      functionName: 'get-claim-status',
      functionArgs: [],
    });
  },

  // Check if claim is approved
  isClaimApproved: async (claimId: bigint) => {
    return callReadOnly({
      contractAddress: CONTRACT_ADDRESSES.daoGovernance,
      functionName: 'is-claim-approved',
      functionArgs: [],
    });
  },

  // Get claim data
  getClaimData: async (claimId: bigint) => {
    return callReadOnly({
      contractAddress: CONTRACT_ADDRESSES.daoGovernance,
      functionName: 'get-claim-data',
      functionArgs: [],
    });
  },

  // Get total claims
  getClaimCounter: async () => {
    return callReadOnly({
      contractAddress: CONTRACT_ADDRESSES.daoGovernance,
      functionName: 'get-claim-counter',
      functionArgs: [],
    });
  },
};

// JagaStake Service
export const JagaStakeService = {
  // Get user balance
  getBalance: async (userAddress: string) => {
    return callReadOnly({
      contractAddress: CONTRACT_ADDRESSES.jagaStake,
      functionName: 'get-balance',
      functionArgs: [],
      senderAddress: userAddress,
    });
  },

  // Get user rewards
  getRewards: async (userAddress: string) => {
    return callReadOnly({
      contractAddress: CONTRACT_ADDRESSES.jagaStake,
      functionName: 'get-rewards',
      functionArgs: [],
      senderAddress: userAddress,
    });
  },

  // Get earned rewards
  getEarned: async (userAddress: string) => {
    return callReadOnly({
      contractAddress: CONTRACT_ADDRESSES.jagaStake,
      functionName: 'get-earned',
      functionArgs: [],
      senderAddress: userAddress,
    });
  },

  // Get total supply
  getTotalSupply: async () => {
    return callReadOnly({
      contractAddress: CONTRACT_ADDRESSES.jagaStake,
      functionName: 'get-total-supply',
      functionArgs: [],
    });
  },

  // Get staker count
  getStakerCount: async () => {
    return callReadOnly({
      contractAddress: CONTRACT_ADDRESSES.jagaStake,
      functionName: 'get-staker-count',
      functionArgs: [],
    });
  },

  // Check if user is staker
  isStaker: async (userAddress: string) => {
    return callReadOnly({
      contractAddress: CONTRACT_ADDRESSES.jagaStake,
      functionName: 'is-staker',
      functionArgs: [],
      senderAddress: userAddress,
    });
  },
};

// JagaToken Service
export const JagaTokenService = {
  // Get balance
  getBalance: async (userAddress: string) => {
    return callReadOnly({
      contractAddress: CONTRACT_ADDRESSES.jagaToken,
      functionName: 'get-balance',
      functionArgs: [],
      senderAddress: userAddress,
    });
  },

  // Get total supply
  getTotalSupply: async () => {
    return callReadOnly({
      contractAddress: CONTRACT_ADDRESSES.jagaToken,
      functionName: 'get-total-supply',
      functionArgs: [],
    });
  },

  // Get token name
  getName: async () => {
    return callReadOnly({
      contractAddress: CONTRACT_ADDRESSES.jagaToken,
      functionName: 'get-name',
      functionArgs: [],
    });
  },

  // Get token symbol
  getSymbol: async () => {
    return callReadOnly({
      contractAddress: CONTRACT_ADDRESSES.jagaToken,
      functionName: 'get-symbol',
      functionArgs: [],
    });
  },
};

// Claim Manager Service
export const ClaimManagerService = {
  // Check if claim is executed
  getClaimExecuted: async (claimId: bigint) => {
    return callReadOnly({
      contractAddress: CONTRACT_ADDRESSES.claimManager,
      functionName: 'get-claim-executed',
      functionArgs: [],
    });
  },

  // Get vault balance
  getVaultBalance: async () => {
    return callReadOnly({
      contractAddress: CONTRACT_ADDRESSES.claimManager,
      functionName: 'vault-balance',
      functionArgs: [],
    });
  },
};

// Fetch events from Stacks API
export const fetchEvents = async (contractAddress: string, limit: number = 50) => {
  const apiUrl = getApiUrl();
  const response = await fetch(
    `${apiUrl}/extended/v1/tx/events?contract=${contractAddress}&event_type=print&limit=${limit}`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch events');
  }
  
  const data = await response.json();
  return data.results;
};
