// Stacks-only build replacement.

import { useMorphoReinvest as useStacksMorphoReinvest } from './useStacksContracts';

export const useMorphoReinvest = () => {
  const stacks = useStacksMorphoReinvest();

  // UI compatibility shim: older components expect these fields.
  // Once the Stacks Morpho-reinvest contract exposes equivalent read methods,
  // wire this up properly.
  const totalReinvested = BigInt(0);
  const isReinvestedLoading = stacks.isLoading;

  return {
    ...stacks,
    totalReinvested,
    isReinvestedLoading,
  };
};
