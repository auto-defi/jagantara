// Stacks-only build replacement.

import { useDAOGovernance as useStacksDAOGovernance } from './useStacksContracts';

const claimTypeToId = (claimType?: string): number => {
  if (!claimType) return 0;
  const map: Record<string, number> = {
    'Failed Token Swaps': 1,
    'Phishing Scam Reimbursement': 2,
    'NFT Theft Coverage': 3,
    'Wallet Recovery Assistance': 4,
    'Rug Pull Protection': 5,
    'Exchange / Custodial Insolvency': 6,
    'Major Smart Contract Failures': 7,
    'All Lite coverage': 8,
    'All Shield coverage': 9,
    'All Max coverage': 10,
  };
  return map[claimType] ?? 0;
};

export const useDAOGovernance = () => {
  const stacks = useStacksDAOGovernance();
  return {
    ...stacks,
    // compatibility
    submitClaim: async (
      reason?: string,
      title?: string,
      claimType?: string,
      amount?: bigint
    ) => {
      try {
        const result = await (stacks as any).submitClaim?.(
          reason ?? '',
          title ?? '',
          claimTypeToId(claimType),
          amount ?? BigInt(0)
        );
        return !!result?.txId;
      } catch (e) {
        console.error('submitClaim error:', e);
        return false;
      }
    },
    isSubmitting: (stacks as any).isSubmitting ?? false,
  };
};
