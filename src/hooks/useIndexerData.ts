/**
 * Jagantara - Stacks Indexer Data Hooks
 * 
 * Hooks for fetching indexed data from Stacks blockchain
 * Uses Stacks API instead of GraphQL
 */

import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { getApiUrl, CONTRACT_ADDRESSES } from "@/lib/stacks/network";

// Types for indexed data
export interface StakeData {
  id: string;
  user: string;
  amount: string;
  txId: string;
  timestamp: number;
  blockHeight: number;
}

export interface UnstakeData {
  id: string;
  user: string;
  amount: string;
  txId: string;
  timestamp: number;
  blockHeight: number;
}

export interface RewardClaimData {
  id: string;
  user: string;
  amount: string;
  txId: string;
  timestamp: number;
  blockHeight: number;
}

export interface PolicyData {
  id: string;
  user: string;
  tier: number;
  amountToCover: string;
  premium: string;
  startTime: number;
  endTime: number;
  isActive: boolean;
}

export interface ClaimData {
  id: string;
  submitter: string;
  reason: string;
  title: string;
  claimType: number;
  amount: string;
  status: 'pending' | 'approved' | 'rejected' | 'executed';
  votesFor: number;
  votesAgainst: number;
  createdAt: number;
}

// API fetcher functions
const fetchFromStacksApi = async (endpoint: string, params?: Record<string, string>) => {
  const apiUrl = getApiUrl();
  const url = new URL(`${apiUrl}/extended/v1/${endpoint}`);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }
  
  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }
  return response.json();
};

// Fetch events for a contract
const fetchContractEvents = async (
  contractAddress: string,
  topic: string,
  limit: number = 50
): Promise<any[]> => {
  try {
    const data = await fetchFromStacksApi('tx/events', {
      contract_id: contractAddress,
      event_type: 'print',
      limit: limit.toString(),
    });
    return data.results?.filter((event: any) => 
      event.contract_id === contractAddress && 
      (!topic || event.topic === topic)
    ) || [];
  } catch (error) {
    console.error('Error fetching contract events:', error);
    return [];
  }
};

// Fetch transactions for an address
const fetchAddressTransactions = async (
  address: string,
  limit: number = 50
): Promise<any[]> => {
  try {
    const data = await fetchFromStacksApi('address/transactions', {
      address,
      limit: limit.toString(),
    });
    return data.results || [];
  } catch (error) {
    console.error('Error fetching address transactions:', error);
    return [];
  }
};

// 🟢 Stakes
export const useRecentStakes = (limit = 10) => {
  return useQuery({
    queryKey: ['recentStakes', limit],
    queryFn: async () => {
      const events = await fetchContractEvents(
        CONTRACT_ADDRESSES.jagaStake,
        'staked',
        limit
      );
      return events.map((event: any) => ({
        id: event.tx_id,
        user: event.value.user,
        amount: event.value.amount,
        txId: event.tx_id,
        timestamp: event.timestamp,
        blockHeight: event.block_height,
      })) as StakeData[];
    },
    refetchInterval: 8000,
    staleTime: 5000,
  });
};

export const useStakesByUser = (userAddress?: string, limit = 10) => {
  return useQuery({
    queryKey: ['stakesByUser', userAddress, limit],
    queryFn: async () => {
      if (!userAddress) return [];
      const events = await fetchContractEvents(
        CONTRACT_ADDRESSES.jagaStake,
        'staked',
        limit * 2
      );
      return events
        .filter((event: any) => event.value.user === userAddress)
        .slice(0, limit)
        .map((event: any) => ({
          id: event.tx_id,
          user: event.value.user,
          amount: event.value.amount,
          txId: event.tx_id,
          timestamp: event.timestamp,
          blockHeight: event.block_height,
        })) as StakeData[];
    },
    enabled: !!userAddress,
    refetchInterval: 15000,
    staleTime: 10000,
  });
};

// 🔴 Unstakes
export const useRecentUnstakes = (limit = 10) => {
  return useQuery({
    queryKey: ['recentUnstakes', limit],
    queryFn: async () => {
      const events = await fetchContractEvents(
        CONTRACT_ADDRESSES.jagaStake,
        'unstaked',
        limit
      );
      return events.map((event: any) => ({
        id: event.tx_id,
        user: event.value.user,
        amount: event.value.amount,
        txId: event.tx_id,
        timestamp: event.timestamp,
        blockHeight: event.block_height,
      })) as UnstakeData[];
    },
    refetchInterval: 8000,
    staleTime: 5000,
  });
};

export const useUnstakesByUser = (userAddress?: string, limit = 10) => {
  return useQuery({
    queryKey: ['unstakesByUser', userAddress, limit],
    queryFn: async () => {
      if (!userAddress) return [];
      const events = await fetchContractEvents(
        CONTRACT_ADDRESSES.jagaStake,
        'unstaked',
        limit * 2
      );
      return events
        .filter((event: any) => event.value.user === userAddress)
        .slice(0, limit)
        .map((event: any) => ({
          id: event.tx_id,
          user: event.value.user,
          amount: event.value.amount,
          txId: event.tx_id,
          timestamp: event.timestamp,
          blockHeight: event.block_height,
        })) as UnstakeData[];
    },
    enabled: !!userAddress,
    refetchInterval: 15000,
    staleTime: 10000,
  });
};

// 🏆 Reward Claims
export const useRecentRewardClaims = (limit = 10) => {
  return useQuery({
    queryKey: ['recentRewardClaims', limit],
    queryFn: async () => {
      const events = await fetchContractEvents(
        CONTRACT_ADDRESSES.jagaStake,
        'reward-claimed',
        limit
      );
      return events.map((event: any) => ({
        id: event.tx_id,
        user: event.value.user,
        amount: event.value.amount,
        txId: event.tx_id,
        timestamp: event.timestamp,
        blockHeight: event.block_height,
      })) as RewardClaimData[];
    },
    refetchInterval: 10000,
    staleTime: 5000,
  });
};

export const useRewardClaimsByUser = (userAddress?: string, limit = 10) => {
  return useQuery({
    queryKey: ['rewardClaimsByUser', userAddress, limit],
    queryFn: async () => {
      if (!userAddress) return [];
      const events = await fetchContractEvents(
        CONTRACT_ADDRESSES.jagaStake,
        'reward-claimed',
        limit * 2
      );
      return events
        .filter((event: any) => event.value.user === userAddress)
        .slice(0, limit)
        .map((event: any) => ({
          id: event.tx_id,
          user: event.value.user,
          amount: event.value.amount,
          txId: event.tx_id,
          timestamp: event.timestamp,
          blockHeight: event.block_height,
        })) as RewardClaimData[];
    },
    enabled: !!userAddress,
    refetchInterval: 15000,
    staleTime: 10000,
  });
};

// 📋 Policies
export const useRecentPolicies = (limit = 10) => {
  return useQuery({
    queryKey: ['recentPolicies', limit],
    queryFn: async () => {
      const events = await fetchContractEvents(
        CONTRACT_ADDRESSES.insuranceManager,
        'premium-paid',
        limit
      );
      return events.map((event: any) => ({
        id: event.tx_id,
        user: event.value.user,
        tier: event.value.tier,
        amountToCover: event.value.amount_to_cover,
        premium: event.value.amount,
        startTime: event.timestamp,
        endTime: event.timestamp + (event.value.duration * 600000),
        isActive: true,
      })) as PolicyData[];
    },
    refetchInterval: 10000,
    staleTime: 5000,
  });
};

export const usePolicyByUser = (userAddress?: string) => {
  return useQuery({
    queryKey: ['policyByUser', userAddress],
    queryFn: async () => {
      if (!userAddress) return null;
      const events = await fetchContractEvents(
        CONTRACT_ADDRESSES.insuranceManager,
        'premium-paid',
        100
      );
      const userPolicies = events.filter(
        (event: any) => event.value.user === userAddress
      );
      
      if (userPolicies.length === 0) return null;
      
      const latest = userPolicies[0];
      return {
        id: latest.tx_id,
        user: latest.value.user,
        tier: latest.value.tier,
        amountToCover: latest.value.amount_to_cover,
        premium: latest.value.amount,
        startTime: latest.timestamp,
        endTime: latest.timestamp + (latest.value.duration * 600000),
        isActive: true,
      } as PolicyData;
    },
    enabled: !!userAddress,
    refetchInterval: 15000,
    staleTime: 10000,
  });
};

// 🗳️ Claims (DAO Governance)
export const useRecentClaims = (limit = 10) => {
  return useQuery({
    queryKey: ['recentClaims', limit],
    queryFn: async () => {
      const events = await fetchContractEvents(
        CONTRACT_ADDRESSES.daoGovernance,
        'claim-submitted',
        limit
      );
      return events.map((event: any) => ({
        id: event.value.claim_id,
        submitter: event.value.submitter,
        reason: event.value.reason,
        title: event.value.title,
        claimType: event.value.claim_type,
        amount: event.value.amount,
        status: 'pending' as const,
        votesFor: 0,
        votesAgainst: 0,
        createdAt: event.timestamp,
      })) as ClaimData[];
    },
    refetchInterval: 10000,
    staleTime: 5000,
  });
};

export const useClaimById = (claimId?: string) => {
  return useQuery({
    queryKey: ['claimById', claimId],
    queryFn: async () => {
      if (!claimId) return null;
      // This would need to be implemented with a proper indexer
      // For now, return null
      return null;
    },
    enabled: !!claimId,
  });
};

// 📊 Stats
export const usePlatformStats = () => {
  return useQuery({
    queryKey: ['platformStats'],
    queryFn: async () => {
      // These would come from an indexer or aggregated data
      // For now, return placeholder data
      return {
        totalStaked: '0',
        totalUsers: 0,
        totalPolicies: 0,
        totalClaims: 0,
        totalPremiums: '0',
      };
    },
    refetchInterval: 30000,
    staleTime: 20000,
  });
};

// Export legacy hooks for backward compatibility
export const useRewardClaimsBySession = (sessionId: bigint, limit = 10) => {
  return useQuery({
    queryKey: ['rewardClaimsBySession', sessionId.toString(), limit],
    queryFn: async () => [],
    enabled: false,
  });
};

export const useRecentRewardSessions = (limit = 10) => {
  return useQuery({
    queryKey: ['recentRewardSessions', limit],
    queryFn: async () => [],
    enabled: false,
  });
};

export const useActiveRewardSessions = (currentTime: bigint, limit = 10) => {
  return useQuery({
    queryKey: ['activeRewardSessions', currentTime.toString(), limit],
    queryFn: async () => [],
    enabled: false,
  });
};
