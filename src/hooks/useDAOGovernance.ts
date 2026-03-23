// Stacks-only build replacement.

import { useDAOGovernance as useStacksDAOGovernance } from './useStacksContracts';

export const useDAOGovernance = () => {
  const stacks = useStacksDAOGovernance();
  return {
    ...stacks,
    // compatibility
    submitClaim: async (
      _reason?: string,
      _title?: string,
      _claimType?: string,
      _amount?: bigint
    ) => false,
    isSubmitting: false,
  };
};
