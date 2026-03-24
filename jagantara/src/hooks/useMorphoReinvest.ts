// Stacks-only build replacement.

import { useMorphoReinvest as useStacksMorphoReinvest } from './useStacksContracts';
import { useEffect, useState } from 'react';

export const useMorphoReinvest = () => {
  const stacks = useStacksMorphoReinvest();

  const [totalReinvested, setTotalReinvested] = useState<bigint>(BigInt(0));
  const isReinvestedLoading = (stacks as any).isLoading;

  useEffect(() => {
    let cancelled = false;
    const fetch = async () => {
      try {
        const v = await (stacks as any).getTotalReinvested?.();
        if (cancelled) return;
        setTotalReinvested(BigInt(v ?? 0));
      } catch {
        if (!cancelled) setTotalReinvested(BigInt(0));
      }
    };
    void fetch();
    const id = setInterval(fetch, 15_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [stacks]);

  return {
    ...stacks,
    totalReinvested,
    isReinvestedLoading,
  };
};
