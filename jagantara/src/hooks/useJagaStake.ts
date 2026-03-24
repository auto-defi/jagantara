// Stacks-only build replacement.
//
// The previous implementation depended on EVM tooling (wagmi/xellar).
// This hook now delegates to the Stacks contract hooks.

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useJagaStake as useStacksJagaStake } from './useStacksContracts';
import { parseTokenAmount } from '@/lib/formatters';

export const useStake = () => {
  const stacks = useStacksJagaStake();

  const [currentStake, setCurrentStake] = useState<bigint>(BigInt(0));
  const [pendingReward, setPendingReward] = useState<bigint>(BigInt(0));
  const [totalSupply, setTotalSupply] = useState<bigint>(BigInt(0));
  const [timeLeft, setTimeLeft] = useState<number | undefined>(undefined);

  const canFetch = useMemo(() => !!(stacks as any)?.getBalance, [stacks]);

  // Best-effort read-only hydration for UI.
  useEffect(() => {
    let cancelled = false;
    if (!canFetch) return;

    const fetchAll = async () => {
      try {
        // parseCV() returns JS values (often numbers) not BigInt.
        const balance = await (stacks as any).getBalance();
        const rewards = await (stacks as any).getRewards();
        const supply = await (stacks as any).getTotalSupply?.();
        const tl = await (stacks as any).getTimeLeft?.();

        if (cancelled) return;
        setCurrentStake(BigInt(balance ?? 0));
        setPendingReward(BigInt(rewards ?? 0));
        setTotalSupply(BigInt(supply ?? 0));
        // get-time-left returns blocks; keep as number for UI utils.
        setTimeLeft(typeof tl === 'number' ? tl : tl ? Number(tl) : undefined);
      } catch (_e) {
        if (cancelled) return;
        // keep defaults
      }
    };

    fetchAll();
    const id = setInterval(fetchAll, 10_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [canFetch, stacks]);

  // Provide a compatible surface area for the UI components.
  // UI passes human-readable amounts (e.g. "1.23"); contract expects uint in smallest unit.
  // Current stake contract is USDCx-based (decimals=6).
  const stake = useCallback(
    async (amount: string) => {
      try {
        const raw = parseTokenAmount(amount, 6);
        const result = await (stacks as any).stake?.(raw);
        return !!result?.txId;
      } catch (e) {
        console.error('Stake error:', e);
        return false;
      }
    },
    [stacks]
  );

  const unstake = useCallback(
    async (amount: string) => {
      try {
        const raw = parseTokenAmount(amount, 6);
        const result = await (stacks as any).unstake?.(raw);
        return !!result?.txId;
      } catch (e) {
        console.error('Unstake error:', e);
        return false;
      }
    },
    [stacks]
  );

  const claim = useCallback(async () => {
    try {
      const result = await (stacks as any).claimReward?.();
      return !!result?.txId;
    } catch (e) {
      console.error('Claim error:', e);
      return false;
    }
  }, [stacks]);
  const refetchCurrentStake = useCallback(() => {
    // No-op placeholder for UI components expecting a refetch method.
    // When Stacks staking read methods are implemented, wire this to invalidate
    // and refetch the relevant queries.
  }, []);

  // Spread first, then override to avoid duplicate keys.
  // IMPORTANT: Do not clobber read-only values returned from `useStacksContracts`.
  // Otherwise UI will see `undefined`/0 and formatters will render NaN/Invalid Date.
  return {
    ...stacks,
    stake,
    unstake,
    claim,
    refetchCurrentStake,
    currentStake,
    pendingReward,
    totalSupply,
    timeLeft,
  };
};
