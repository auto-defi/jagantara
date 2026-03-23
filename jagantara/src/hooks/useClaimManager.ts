// Stacks-only build replacement.

import { useClaimManager as useStacksClaimManager } from './useStacksContracts';

export const useClaimManager = () => {
  const stacks = useStacksClaimManager();

  // Provide minimal shape expected by UI.
  return {
    ...stacks,
    formattedVaultBalance: '0',
  };
};

