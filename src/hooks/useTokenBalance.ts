// Stacks-only build replacement.
//
// Token balances are retrieved via the indexer / Stacks read-only calls.
// For now this returns a placeholder.

import type { Token } from "@/types/stake";

export const useTokenBalance = (_token: Token | string) => {
  return {
    balance: "0",
    isLoading: false,
    error: null as unknown,
    refetch: () => void 0,
  };
};
