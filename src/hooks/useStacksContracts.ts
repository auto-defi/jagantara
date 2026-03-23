/**
 * Jagantara - Stacks Contract Hooks
 * 
 * Hooks for interacting with Clarity smart contracts on Stacks
 */

import { useState, useCallback } from 'react';
import {
  callReadOnlyFunction,
  makeContractCall,
  broadcastTransaction,
  AnchorMode,
  PostConditionMode,
  uintCV,
  principalCV,
  boolCV,
  someCV,
  noneCV,
  bufferCV,
  stringAsciiCV,
  stringUtf8CV,
  ClarityValue,
  cvToValue,
} from '@stacks/transactions';
import { useStacksWallet, getStacksNetwork } from './useStacksWallet';
import { CONTRACT_ADDRESSES } from '@/lib/stacks/network';

// Helper to convert Clarity value
const parseCV = (cv: ClarityValue): any => {
  return cvToValue(cv, true);
};

// ============================================================
// JagaToken Hook
// ============================================================
export const useJagaToken = () => {
  const { address, userSession } = useStacksWallet();
  const [isLoading, setIsLoading] = useState(false);

  const getBalance = useCallback(async (account?: string) => {
    const targetAddress = account || address;
    if (!targetAddress) return null;

    try {
      const result = await callReadOnlyFunction({
        contractAddress: CONTRACT_ADDRESSES.jagaToken.split('.')[0],
        contractName: 'jaga-token',
        functionName: 'get-balance',
        functionArgs: [principalCV(targetAddress)],
        senderAddress: targetAddress,
        network: getStacksNetwork(),
      });
      return parseCV(result);
    } catch (error) {
      console.error('Error getting JagaToken balance:', error);
      return null;
    }
  }, [address]);

  const getTotalSupply = useCallback(async () => {
    try {
      const result = await callReadOnlyFunction({
        contractAddress: CONTRACT_ADDRESSES.jagaToken.split('.')[0],
        contractName: 'jaga-token',
        functionName: 'get-total-supply',
        functionArgs: [],
        senderAddress: address || '',
        network: getStacksNetwork(),
      });
      return parseCV(result);
    } catch (error) {
      console.error('Error getting total supply:', error);
      return null;
    }
  }, [address]);

  const transfer = useCallback(async (amount: bigint, to: string, memo?: string) => {
    if (!address || !userSession) throw new Error('Wallet not connected');

    setIsLoading(true);
    try {
      const txOptions = {
        contractAddress: CONTRACT_ADDRESSES.jagaToken.split('.')[0],
        contractName: 'jaga-token',
        functionName: 'transfer',
        functionArgs: [
          uintCV(amount),
          principalCV(address),
          principalCV(to),
          memo ? someCV(bufferCV(Buffer.from(memo))) : noneCV(),
        ],
        senderKey: '', // Will be signed by wallet
        network: getStacksNetwork(),
        anchorMode: AnchorMode.Any,
        postConditionMode: PostConditionMode.Allow,
      };

      // For Leather/Xverse, we need to use the wallet's signing
      // This is a placeholder - actual implementation uses @stacks/connect
      return txOptions;
    } finally {
      setIsLoading(false);
    }
  }, [address, userSession]);

  return {
    getBalance,
    getTotalSupply,
    transfer,
    isLoading,
  };
};

// ============================================================
// JagaStake Hook
// ============================================================
export const useJagaStake = () => {
  const { address, userSession } = useStacksWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [isStaking, setIsStaking] = useState(false);
  const [isUnstaking, setIsUnstaking] = useState(false);

  const getBalance = useCallback(async (account?: string) => {
    const targetAddress = account || address;
    if (!targetAddress) return null;

    try {
      const result = await callReadOnlyFunction({
        contractAddress: CONTRACT_ADDRESSES.jagaStake.split('.')[0],
        contractName: 'jaga-stake',
        functionName: 'get-balance',
        functionArgs: [principalCV(targetAddress)],
        senderAddress: targetAddress,
        network: getStacksNetwork(),
      });
      return parseCV(result);
    } catch (error) {
      console.error('Error getting stake balance:', error);
      return null;
    }
  }, [address]);

  const getRewards = useCallback(async (account?: string) => {
    const targetAddress = account || address;
    if (!targetAddress) return null;

    try {
      const result = await callReadOnlyFunction({
        contractAddress: CONTRACT_ADDRESSES.jagaStake.split('.')[0],
        contractName: 'jaga-stake',
        functionName: 'get-rewards',
        functionArgs: [principalCV(targetAddress)],
        senderAddress: targetAddress,
        network: getStacksNetwork(),
      });
      return parseCV(result);
    } catch (error) {
      console.error('Error getting rewards:', error);
      return null;
    }
  }, [address]);

  const getEarned = useCallback(async (account?: string) => {
    const targetAddress = account || address;
    if (!targetAddress) return null;

    try {
      const result = await callReadOnlyFunction({
        contractAddress: CONTRACT_ADDRESSES.jagaStake.split('.')[0],
        contractName: 'jaga-stake',
        functionName: 'get-earned',
        functionArgs: [principalCV(targetAddress)],
        senderAddress: targetAddress,
        network: getStacksNetwork(),
      });
      return parseCV(result);
    } catch (error) {
      console.error('Error getting earned:', error);
      return null;
    }
  }, [address]);

  const getTotalSupply = useCallback(async () => {
    try {
      const result = await callReadOnlyFunction({
        contractAddress: CONTRACT_ADDRESSES.jagaStake.split('.')[0],
        contractName: 'jaga-stake',
        functionName: 'get-total-supply',
        functionArgs: [],
        senderAddress: address || '',
        network: getStacksNetwork(),
      });
      return parseCV(result);
    } catch (error) {
      console.error('Error getting total supply:', error);
      return null;
    }
  }, [address]);

  const getStakerCount = useCallback(async () => {
    try {
      const result = await callReadOnlyFunction({
        contractAddress: CONTRACT_ADDRESSES.jagaStake.split('.')[0],
        contractName: 'jaga-stake',
        functionName: 'get-staker-count',
        functionArgs: [],
        senderAddress: address || '',
        network: getStacksNetwork(),
      });
      return parseCV(result);
    } catch (error) {
      console.error('Error getting staker count:', error);
      return null;
    }
  }, [address]);

  const isStaker = useCallback(async (account?: string) => {
    const targetAddress = account || address;
    if (!targetAddress) return false;

    try {
      const result = await callReadOnlyFunction({
        contractAddress: CONTRACT_ADDRESSES.jagaStake.split('.')[0],
        contractName: 'jaga-stake',
        functionName: 'is-staker',
        functionArgs: [principalCV(targetAddress)],
        senderAddress: targetAddress,
        network: getStacksNetwork(),
      });
      return parseCV(result);
    } catch (error) {
      console.error('Error checking staker status:', error);
      return false;
    }
  }, [address]);

  const stake = useCallback(async (amount: bigint) => {
    if (!address || !userSession) throw new Error('Wallet not connected');
    // This would use @stacks/connect to sign and broadcast
    // Placeholder for actual implementation
    return { amount, address };
  }, [address, userSession]);

  const unstake = useCallback(async (amount: bigint) => {
    if (!address || !userSession) throw new Error('Wallet not connected');
    // This would use @stacks/connect to sign and broadcast
    return { amount, address };
  }, [address, userSession]);

  const claimReward = useCallback(async () => {
    if (!address || !userSession) throw new Error('Wallet not connected');
    // This would use @stacks/connect to sign and broadcast
    return { address };
  }, [address, userSession]);

  return {
    getBalance,
    getRewards,
    getEarned,
    getTotalSupply,
    getStakerCount,
    isStaker,
    stake,
    unstake,
    claimReward,
    isLoading,
    isStaking,
    isUnstaking,
  };
};

// ============================================================
// Insurance Manager Hook
// ============================================================
export const useInsuranceManager = () => {
  const { address, userSession } = useStacksWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [isActiveLoading, setIsActiveLoading] = useState(false);

  const getPolicy = useCallback(async (account?: string) => {
    const targetAddress = account || address;
    if (!targetAddress) return null;

    try {
      const result = await callReadOnlyFunction({
        contractAddress: CONTRACT_ADDRESSES.insuranceManager.split('.')[0],
        contractName: 'insurance-manager',
        functionName: 'get-policy',
        functionArgs: [principalCV(targetAddress)],
        senderAddress: targetAddress,
        network: getStacksNetwork(),
      });
      return parseCV(result);
    } catch (error) {
      console.error('Error getting policy:', error);
      return null;
    }
  }, [address]);

  const isActive = useCallback(async (account?: string) => {
    const targetAddress = account || address;
    if (!targetAddress) return false;

    setIsActiveLoading(true);
    try {
      const result = await callReadOnlyFunction({
        contractAddress: CONTRACT_ADDRESSES.insuranceManager.split('.')[0],
        contractName: 'insurance-manager',
        functionName: 'is-active',
        functionArgs: [principalCV(targetAddress)],
        senderAddress: targetAddress,
        network: getStacksNetwork(),
      });
      return parseCV(result);
    } catch (error) {
      console.error('Error checking active status:', error);
      return false;
    } finally {
      setIsActiveLoading(false);
    }
  }, [address]);

  const getPremiumPrice = useCallback(async (amountToCover: bigint, tier: number) => {
    try {
      const result = await callReadOnlyFunction({
        contractAddress: CONTRACT_ADDRESSES.insuranceManager.split('.')[0],
        contractName: 'insurance-manager',
        functionName: 'get-premium-price',
        functionArgs: [uintCV(amountToCover), uintCV(tier)],
        senderAddress: address || '',
        network: getStacksNetwork(),
      });
      return parseCV(result);
    } catch (error) {
      console.error('Error getting premium price:', error);
      return null;
    }
  }, [address]);

  const getTotalUsers = useCallback(async () => {
    try {
      const result = await callReadOnlyFunction({
        contractAddress: CONTRACT_ADDRESSES.insuranceManager.split('.')[0],
        contractName: 'insurance-manager',
        functionName: 'get-total-users',
        functionArgs: [],
        senderAddress: address || '',
        network: getStacksNetwork(),
      });
      return parseCV(result);
    } catch (error) {
      console.error('Error getting total users:', error);
      return null;
    }
  }, [address]);

  const getTotalCollected = useCallback(async () => {
    try {
      const result = await callReadOnlyFunction({
        contractAddress: CONTRACT_ADDRESSES.insuranceManager.split('.')[0],
        contractName: 'insurance-manager',
        functionName: 'get-total-collected',
        functionArgs: [],
        senderAddress: address || '',
        network: getStacksNetwork(),
      });
      return parseCV(result);
    } catch (error) {
      console.error('Error getting total collected:', error);
      return null;
    }
  }, [address]);

  const payPremium = useCallback(async (tier: number, duration: number, coveredAddress: string, amountToCover: bigint) => {
    if (!address || !userSession) throw new Error('Wallet not connected');
    // This would use @stacks/connect to sign and broadcast
    return { tier, duration, coveredAddress, amountToCover, address };
  }, [address, userSession]);

  return {
    getPolicy,
    isActive,
    getPremiumPrice,
    getTotalUsers,
    getTotalCollected,
    payPremium,
    isLoading,
    isActiveLoading,
  };
};

// ============================================================
// DAO Governance Hook
// ============================================================
export const useDAOGovernance = () => {
  const { address, userSession } = useStacksWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getClaim = useCallback(async (claimId: bigint) => {
    try {
      const result = await callReadOnlyFunction({
        contractAddress: CONTRACT_ADDRESSES.daoGovernance.split('.')[0],
        contractName: 'dao-governance',
        functionName: 'get-claim',
        functionArgs: [uintCV(claimId)],
        senderAddress: address || '',
        network: getStacksNetwork(),
      });
      return parseCV(result);
    } catch (error) {
      console.error('Error getting claim:', error);
      return null;
    }
  }, [address]);

  const getClaimStatus = useCallback(async (claimId: bigint) => {
    try {
      const result = await callReadOnlyFunction({
        contractAddress: CONTRACT_ADDRESSES.daoGovernance.split('.')[0],
        contractName: 'dao-governance',
        functionName: 'get-claim-status',
        functionArgs: [uintCV(claimId)],
        senderAddress: address || '',
        network: getStacksNetwork(),
      });
      return parseCV(result);
    } catch (error) {
      console.error('Error getting claim status:', error);
      return null;
    }
  }, [address]);

  const isClaimApproved = useCallback(async (claimId: bigint) => {
    try {
      const result = await callReadOnlyFunction({
        contractAddress: CONTRACT_ADDRESSES.daoGovernance.split('.')[0],
        contractName: 'dao-governance',
        functionName: 'is-claim-approved',
        functionArgs: [uintCV(claimId)],
        senderAddress: address || '',
        network: getStacksNetwork(),
      });
      return parseCV(result);
    } catch (error) {
      console.error('Error checking claim approval:', error);
      return false;
    }
  }, [address]);

  const getClaimData = useCallback(async (claimId: bigint) => {
    try {
      const result = await callReadOnlyFunction({
        contractAddress: CONTRACT_ADDRESSES.daoGovernance.split('.')[0],
        contractName: 'dao-governance',
        functionName: 'get-claim-data',
        functionArgs: [uintCV(claimId)],
        senderAddress: address || '',
        network: getStacksNetwork(),
      });
      return parseCV(result);
    } catch (error) {
      console.error('Error getting claim data:', error);
      return null;
    }
  }, [address]);

  const getClaimCounter = useCallback(async () => {
    try {
      const result = await callReadOnlyFunction({
        contractAddress: CONTRACT_ADDRESSES.daoGovernance.split('.')[0],
        contractName: 'dao-governance',
        functionName: 'get-claim-counter',
        functionArgs: [],
        senderAddress: address || '',
        network: getStacksNetwork(),
      });
      return parseCV(result);
    } catch (error) {
      console.error('Error getting claim counter:', error);
      return null;
    }
  }, [address]);

  const submitClaim = useCallback(async (reason: string, title: string, claimType: number, amount: bigint) => {
    if (!address || !userSession) throw new Error('Wallet not connected');
    setIsSubmitting(true);
    try {
      // This would use @stacks/connect to sign and broadcast
      return { reason, title, claimType, amount, address };
    } finally {
      setIsSubmitting(false);
    }
  }, [address, userSession]);

  const vote = useCallback(async (claimId: bigint, approve: boolean) => {
    if (!address || !userSession) throw new Error('Wallet not connected');
    // This would use @stacks/connect to sign and broadcast
    return { claimId, approve, address };
  }, [address, userSession]);

  const executeVote = useCallback(async (claimId: bigint) => {
    if (!address || !userSession) throw new Error('Wallet not connected');
    // This would use @stacks/connect to sign and broadcast
    return { claimId, address };
  }, [address, userSession]);

  const getVotingPeriod = useCallback(async () => {
    try {
      const result = await callReadOnlyFunction({
        contractAddress: CONTRACT_ADDRESSES.daoGovernance.split('.')[0],
        contractName: 'dao-governance',
        functionName: 'get-voting-duration',
        functionArgs: [],
        senderAddress: address || '',
        network: getStacksNetwork(),
      });
      return parseCV(result);
    } catch (error) {
      console.error('Error getting voting period:', error);
      return null;
    }
  }, [address]);

  const getProposalThreshold = useCallback(async () => {
    try {
      const result = await callReadOnlyFunction({
        contractAddress: CONTRACT_ADDRESSES.daoGovernance.split('.')[0],
        contractName: 'dao-governance',
        functionName: 'get-proposal-threshold',
        functionArgs: [],
        senderAddress: address || '',
        network: getStacksNetwork(),
      });
      return parseCV(result);
    } catch (error) {
      console.error('Error getting proposal threshold:', error);
      return null;
    }
  }, [address]);

  const getProposalCount = useCallback(async () => {
    try {
      const result = await callReadOnlyFunction({
        contractAddress: CONTRACT_ADDRESSES.daoGovernance.split('.')[0],
        contractName: 'dao-governance',
        functionName: 'get-proposal-count',
        functionArgs: [],
        senderAddress: address || '',
        network: getStacksNetwork(),
      });
      return parseCV(result);
    } catch (error) {
      console.error('Error getting proposal count:', error);
      return null;
    }
  }, [address]);

  const voteOnClaim = useCallback(async (claimId: bigint, support: boolean) => {
    if (!address || !userSession) throw new Error('Wallet not connected');
    // This would use @stacks/connect to sign and broadcast
    return { claimId, support, address };
  }, [address, userSession]);

  return {
    getClaim,
    getClaimStatus,
    isClaimApproved,
    getClaimData,
    getClaimCounter,
    getVotingPeriod,
    getProposalThreshold,
    getProposalCount,
    submitClaim,
    vote,
    voteOnClaim,
    executeVote,
    isLoading,
    isSubmitting,
  };
};

// ============================================================
// Claim Manager Hook
// ============================================================
export const useClaimManager = () => {
  const { address, userSession } = useStacksWallet();
  const [isLoading, setIsLoading] = useState(false);

  const getClaimExecuted = useCallback(async (claimId: bigint) => {
    try {
      const result = await callReadOnlyFunction({
        contractAddress: CONTRACT_ADDRESSES.claimManager.split('.')[0],
        contractName: 'claim-manager',
        functionName: 'get-claim-executed',
        functionArgs: [uintCV(claimId)],
        senderAddress: address || '',
        network: getStacksNetwork(),
      });
      return parseCV(result);
    } catch (error) {
      console.error('Error checking claim executed:', error);
      return false;
    }
  }, [address]);

  const getVaultBalance = useCallback(async () => {
    try {
      const result = await callReadOnlyFunction({
        contractAddress: CONTRACT_ADDRESSES.claimManager.split('.')[0],
        contractName: 'claim-manager',
        functionName: 'vault-balance',
        functionArgs: [],
        senderAddress: address || '',
        network: getStacksNetwork(),
      });
      return parseCV(result);
    } catch (error) {
      console.error('Error getting vault balance:', error);
      return null;
    }
  }, [address]);

  const claimPayout = useCallback(async (claimId: bigint) => {
    if (!address || !userSession) throw new Error('Wallet not connected');
    // This would use @stacks/connect to sign and broadcast
    return { claimId, address };
  }, [address, userSession]);

  return {
    getClaimExecuted,
    getVaultBalance,
    claimPayout,
    isLoading,
  };
};

// ============================================================
// Morpho Reinvest Hook (Treasury Management)
// ============================================================
export const useMorphoReinvest = () => {
  const { address, userSession } = useStacksWallet();
  const [isLoading, setIsLoading] = useState(false);

  const getTreasuryBalance = useCallback(async () => {
    try {
      const result = await callReadOnlyFunction({
        contractAddress: CONTRACT_ADDRESSES.morphoReinvest.split('.')[0],
        contractName: 'morpho-reinvest',
        functionName: 'treasury-balance',
        functionArgs: [],
        senderAddress: address || '',
        network: getStacksNetwork(),
      });
      return parseCV(result);
    } catch (error) {
      console.error('Error getting treasury balance:', error);
      return null;
    }
  }, [address]);

  const deposit = useCallback(async (amount: bigint) => {
    if (!address || !userSession) throw new Error('Wallet not connected');
    // This would use @stacks/connect to sign and broadcast
    return { amount, address };
  }, [address, userSession]);

  const withdraw = useCallback(async (to: string, amount: bigint) => {
    if (!address || !userSession) throw new Error('Wallet not connected');
    // This would use @stacks/connect to sign and broadcast
    return { to, amount, address };
  }, [address, userSession]);

  return {
    getTreasuryBalance,
    deposit,
    withdraw,
    isLoading,
  };
};

// Claim status enum
export enum ClaimStatus {
  Pending = 0,
  Approved = 1,
  Rejected = 2,
  Executed = 3,
}

// Re-export StacksWalletState from useStacksWallet
export type { StacksWalletState } from './useStacksWallet';
