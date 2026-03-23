// Stacks-only build replacement.
//
// The previous implementation depended on EVM tooling (wagmi/xellar).
// This hook now delegates to the Stacks contract hooks.

import { useCallback } from 'react';
import { useJagaStake as useStacksJagaStake } from './useStacksContracts';

export const useStake = () => {
  const stacks = useStacksJagaStake();

  // Provide a compatible surface area for the UI components.
  // Note: write methods are placeholders unless implemented in useStacksContracts.
  const stake = useCallback(async (_amount: string) => false, []);
  const unstake = useCallback(async (_amount: string) => false, []);
  const claim = useCallback(async () => false, []);
  const refetchCurrentStake = useCallback(() => {
    // No-op placeholder for UI components expecting a refetch method.
    // When Stacks staking read methods are implemented, wire this to invalidate
    // and refetch the relevant queries.
  }, []);

  // Spread first, then override to avoid duplicate keys.
  return {
    ...stacks,
    stake,
    unstake,
    claim,
    refetchCurrentStake,
    isStaking: false,
    isUnstaking: false,
    isClaiming: false,
    currentStake: BigInt(0),
    pendingReward: BigInt(0),
    timeLeft: undefined as number | undefined,
    totalSupply: BigInt(0),
  };
};
