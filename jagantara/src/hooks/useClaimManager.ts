// Stacks-only build replacement.

import { useClaimManager as useStacksClaimManager } from './useStacksContracts';
import { useEffect, useMemo, useState } from 'react';
import { formatBigInt } from '@/lib/formatters';

export const useClaimManager = () => {
  const stacks = useStacksClaimManager();

  const [vaultBalance, setVaultBalance] = useState<bigint>(BigInt(0));

  useEffect(() => {
    let cancelled = false;
    const fetch = async () => {
      try {
        const v = await (stacks as any).getVaultBalance?.();
        // some read-only functions return (ok uint); parseCV already unwraps in hook, but be defensive
        const raw = (v as any)?.value ?? v;
        const bi = BigInt(raw ?? 0);
        if (!cancelled) setVaultBalance(bi);
      } catch {
        if (!cancelled) setVaultBalance(BigInt(0));
      }
    };
    void fetch();
    const id = setInterval(fetch, 15_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [stacks]);

  const formattedVaultBalance = useMemo(() => {
    // USDCx decimals=6
    return formatBigInt(vaultBalance, 6, 2);
  }, [vaultBalance]);

  // Provide minimal shape expected by UI.
  return {
    ...stacks,
    formattedVaultBalance,
  };
};
