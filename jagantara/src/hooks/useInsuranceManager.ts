// Stacks-only build replacement.
//
// This hook provides UI-friendly booleans while delegating reads/writes to the
// Stacks contract hook.

import { useCallback, useEffect, useState } from 'react';
import { useInsuranceManager as useStacksInsuranceManager } from './useStacksContracts';
import { parseTokenAmount } from '@/lib/formatters';
import { useStacksWallet } from './useStacksWallet';

export const useInsuranceManager = () => {
  const stacks = useStacksInsuranceManager();
  const { address } = useStacksWallet();

  const [policy, setPolicy] = useState<any>(null);
  const [isActive, setIsActive] = useState(false);
  const [isActiveLoading, setIsActiveLoading] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  const refetchIsActive = useCallback(async () => {
    if (!address) return false;
    setIsActiveLoading(true);
    try {
      const active = await (stacks as any).isActive?.(address);
      const boolActive = !!active;
      setIsActive(boolActive);
      return boolActive;
    } catch (e) {
      console.error('isActive error:', e);
      setIsActive(false);
      return false;
    } finally {
      setIsActiveLoading(false);
    }
  }, [address, stacks]);

  const refetchPolicy = useCallback(async () => {
    if (!address) return null;
    try {
      const p = await (stacks as any).getPolicy?.(address);
      setPolicy(p ?? null);
      return p ?? null;
    } catch (e) {
      console.error('getPolicy error:', e);
      setPolicy(null);
      return null;
    }
  }, [address, stacks]);

  useEffect(() => {
    void refetchIsActive();
    void refetchPolicy();
  }, [refetchIsActive, refetchPolicy]);

  const payPremium = useCallback(
    async (
      tier: number,
      duration: number,
      coveredAddress: string,
      // UI sometimes passes string; interpret as human-readable USDCx amount.
      amountToCover: bigint | string
    ) => {
      if (isPaying) return false;
      setIsPaying(true);
      try {
        const raw =
          typeof amountToCover === 'string'
            ? parseTokenAmount(amountToCover, 6)
            : amountToCover;
        const result = await (stacks as any).payPremium?.(
          tier,
          duration,
          coveredAddress,
          raw
        );
        const ok = !!result?.txId;
        if (ok) {
          void refetchIsActive();
          void refetchPolicy();
        }
        return ok;
      } catch (e) {
        console.error('payPremium error:', e);
        return false;
      } finally {
        setIsPaying(false);
      }
    },
    [isPaying, refetchIsActive, refetchPolicy, stacks]
  );

  return {
    isActive,
    policy,
    isActiveLoading,
    payPremium,
    isPaying,
    refetchIsActive,
    // compatibility flags for UI
    isSubmitting: false,
  };
};
