// Stacks-only build replacement.
//
// The previous implementation depended on EVM tooling (wagmi/xellar).
// This hook now delegates to the Stacks contract hooks.

import { useInsuranceManager as useStacksInsuranceManager } from './useStacksContracts';

export const useInsuranceManager = () => {
  // For now, return simplified synchronous values to satisfy UI expectations.
  // `useStacksContracts.useInsuranceManager()` exposes async functions; the UI
  // currently treats `isActive` as a boolean.
  useStacksInsuranceManager();

  return {
    isActive: false,
    policy: null as any,
    isActiveLoading: false,
    payPremium: async (
      _tier: number,
      _duration: number,
      _coveredAddress: string,
      // UI currently passes a string sometimes; accept both.
      _amountToCover: bigint | string
    ) => false,
    isPaying: false,
    refetchIsActive: async () => false,
    // compatibility flags for UI
    isSubmitting: false,
  };
};
