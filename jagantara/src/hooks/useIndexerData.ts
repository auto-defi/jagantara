import { useQuery } from "@apollo/client";
import { useMemo, useCallback } from "react";
import {
  GET_RECENT_STAKES,
  GET_STAKES_BY_USER,
  GET_RECENT_UNSTAKES,
  GET_UNSTAKES_BY_USER,
  GET_RECENT_REWARD_CLAIMS,
  GET_REWARD_CLAIMS_BY_USER,
  GET_REWARD_CLAIMS_BY_SESSION,
  GET_RECENT_REWARD_SESSIONS,
  GET_ACTIVE_REWARD_SESSIONS,
} from "../lib/graphql";
import type {
  StakeData,
  UnstakeData,
  RewardClaimData,
  RewardSessionData,
  PaginatedResponse,
} from "../lib/graphql";

// 🟢 Stakes
export const useRecentStakes = (limit = 10) => {
  const { data, loading, error, refetch } = useQuery(GET_RECENT_STAKES, {
    variables: { limit },
    pollInterval: 8000,
    errorPolicy: "all",
    fetchPolicy: "cache-first",
    notifyOnNetworkStatusChange: false,
  });

  const items = useMemo(
    () => data?.stakess?.items || [],
    [data?.stakess?.items]
  );

  const stableRefetch = useCallback(() => refetch(), [refetch]);

  return useMemo(
    () => ({
      data: items as StakeData[],
      isLoading: loading,
      error,
      refetch: stableRefetch,
    }),
    [items, loading, error, stableRefetch]
  );
};

export const useStakesByUser = (userAddress?: string, limit = 10) => {
  const { data, loading, error, refetch } = useQuery(GET_STAKES_BY_USER, {
    variables: { userAddress, limit },
    skip: !userAddress,
    pollInterval: 15000,
    errorPolicy: "all",
    fetchPolicy: "cache-first",
    notifyOnNetworkStatusChange: false,
  });

  const items = useMemo(
    () => data?.stakess?.items || [],
    [data?.stakess?.items]
  );

  const stableRefetch = useCallback(() => {
    if (!userAddress) return Promise.resolve();
    return refetch();
  }, [refetch, userAddress]);

  return useMemo(
    () => ({
      data: items as StakeData[],
      isLoading: loading,
      error,
      refetch: stableRefetch,
    }),
    [items, loading, error, stableRefetch]
  );
};

// 🔴 Unstakes
export const useRecentUnstakes = (limit = 10) => {
  const { data, loading, error, refetch } = useQuery(GET_RECENT_UNSTAKES, {
    variables: { limit },
    pollInterval: 8000,
    errorPolicy: "all",
    fetchPolicy: "cache-first",
    notifyOnNetworkStatusChange: false,
  });

  const items = useMemo(
    () => data?.unstakess?.items || [],
    [data?.unstakess?.items]
  );

  const stableRefetch = useCallback(() => refetch(), [refetch]);

  return useMemo(
    () => ({
      data: items as UnstakeData[],
      isLoading: loading,
      error,
      refetch: stableRefetch,
    }),
    [items, loading, error, stableRefetch]
  );
};

export const useUnstakesByUser = (userAddress?: string, limit = 10) => {
  const { data, loading, error, refetch } = useQuery(GET_UNSTAKES_BY_USER, {
    variables: { userAddress, limit },
    skip: !userAddress,
    pollInterval: 15000,
    errorPolicy: "all",
    fetchPolicy: "cache-first",
    notifyOnNetworkStatusChange: false,
  });

  const items = useMemo(
    () => data?.unstakess?.items || [],
    [data?.unstakess?.items]
  );

  const stableRefetch = useCallback(() => {
    if (!userAddress) return Promise.resolve();
    return refetch();
  }, [refetch, userAddress]);

  return useMemo(
    () => ({
      data: items as UnstakeData[],
      isLoading: loading,
      error,
      refetch: stableRefetch,
    }),
    [items, loading, error, stableRefetch]
  );
};

// 🏆 Reward Claims
export const useRecentRewardClaims = (limit = 10) => {
  const { data, loading, error, refetch } = useQuery(GET_RECENT_REWARD_CLAIMS, {
    variables: { limit },
    pollInterval: 10000,
    errorPolicy: "all",
    fetchPolicy: "cache-first",
    notifyOnNetworkStatusChange: false,
  });

  const items = useMemo(
    () => data?.rewardClaimss?.items || [],
    [data?.rewardClaimss?.items]
  );

  const stableRefetch = useCallback(() => refetch(), [refetch]);

  return useMemo(
    () => ({
      data: items as RewardClaimData[],
      isLoading: loading,
      error,
      refetch: stableRefetch,
    }),
    [items, loading, error, stableRefetch]
  );
};

export const useRewardClaimsByUser = (userAddress?: string, limit = 10) => {
  const { data, loading, error, refetch } = useQuery(
    GET_REWARD_CLAIMS_BY_USER,
    {
      variables: { userAddress, limit },
      skip: !userAddress,
      pollInterval: 15000,
      errorPolicy: "all",
      fetchPolicy: "cache-first",
      notifyOnNetworkStatusChange: false,
    }
  );

  const items = useMemo(
    () => data?.rewardClaimss?.items || [],
    [data?.rewardClaimss?.items]
  );

  const stableRefetch = useCallback(() => {
    if (!userAddress) return Promise.resolve();
    return refetch();
  }, [refetch, userAddress]);

  return useMemo(
    () => ({
      data: items as RewardClaimData[],
      isLoading: loading,
      error,
      refetch: stableRefetch,
    }),
    [items, loading, error, stableRefetch]
  );
};

export const useRewardClaimsBySession = (sessionId: bigint, limit = 10) => {
  const { data, loading, error, refetch } = useQuery(
    GET_REWARD_CLAIMS_BY_SESSION,
    {
      variables: { sessionId: sessionId.toString(), limit },
      skip: !sessionId,
      pollInterval: 10000,
      errorPolicy: "all",
      fetchPolicy: "cache-first",
      notifyOnNetworkStatusChange: false,
    }
  );

  const items = useMemo(
    () => data?.rewardClaimss?.items || [],
    [data?.rewardClaimss?.items]
  );

  const stableRefetch = useCallback(() => refetch(), [refetch]);

  return useMemo(
    () => ({
      data: items as RewardClaimData[],
      isLoading: loading,
      error,
      refetch: stableRefetch,
    }),
    [items, loading, error, stableRefetch]
  );
};

// ⏳ Reward Sessions
export const useRecentRewardSessions = (limit = 10) => {
  const { data, loading, error, refetch } = useQuery(
    GET_RECENT_REWARD_SESSIONS,
    {
      variables: { limit },
      pollInterval: 20000,
      errorPolicy: "all",
      fetchPolicy: "cache-first",
      notifyOnNetworkStatusChange: false,
    }
  );

  const items = useMemo(
    () => data?.rewardSessionss?.items || [],
    [data?.rewardSessionss?.items]
  );

  const stableRefetch = useCallback(() => refetch(), [refetch]);

  return useMemo(
    () => ({
      data: items as RewardSessionData[],
      isLoading: loading,
      error,
      refetch: stableRefetch,
    }),
    [items, loading, error, stableRefetch]
  );
};

export const useActiveRewardSessions = (currentTime: bigint, limit = 10) => {
  const { data, loading, error, refetch } = useQuery(
    GET_ACTIVE_REWARD_SESSIONS,
    {
      variables: {
        currentTime: currentTime.toString(),
        limit,
      },
      skip: !currentTime,
      pollInterval: 15000,
      errorPolicy: "all",
      fetchPolicy: "cache-first",
      notifyOnNetworkStatusChange: false,
    }
  );

  const items = useMemo(
    () => data?.rewardSessionss?.items || [],
    [data?.rewardSessionss?.items]
  );

  const stableRefetch = useCallback(() => refetch(), [refetch]);

  return useMemo(
    () => ({
      data: items as RewardSessionData[],
      isLoading: loading,
      error,
      refetch: stableRefetch,
    }),
    [items, loading, error, stableRefetch]
  );
};
