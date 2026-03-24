// Stacks token balance hook.
//
// - For SIP-010 fungible tokens: calls `get-balance (principal)` on the token contract.
// - For native STX: uses Hiro API `extended/v1/address/:address/balances`.

import type { Token } from "@/types/stake";
import { useQuery } from "@tanstack/react-query";
import { callReadOnlyFunction, cvToValue, principalCV } from "@stacks/transactions";
import { getApiUrl } from "@/lib/stacks/network";
import { getStacksNetwork, useStacksWallet } from "@/hooks/useStacksWallet";

type TokenBalanceResult = {
  balance: bigint;
  isLoading: boolean;
  error: unknown;
  refetch: () => void;
};

const toBigIntSafe = (value: unknown): bigint => {
  try {
    if (typeof value === "bigint") return value;
    if (typeof value === "number") {
      if (!Number.isFinite(value) || value < 0) return BigInt(0);
      return BigInt(Math.floor(value));
    }
    if (typeof value === "string") {
      if (!value) return BigInt(0);
      // Some APIs return numeric strings.
      return BigInt(value);
    }
    return BigInt(0);
  } catch {
    return BigInt(0);
  }
};

export const useTokenBalance = (token: Token | string): TokenBalanceResult => {
  const { address } = useStacksWallet();

  const tokenAddress = typeof token === "string" ? token : token.address;

  const query = useQuery({
    queryKey: ["tokenBalance", address, tokenAddress],
    enabled: !!address && !!tokenAddress,
    queryFn: async (): Promise<bigint> => {
      if (!address || !tokenAddress) return BigInt(0);

      // Native STX balance via API.
      if (tokenAddress === "STX") {
        const apiUrl = getApiUrl();
        const res = await fetch(`${apiUrl}/extended/v1/address/${address}/balances`);
        if (!res.ok) return BigInt(0);
        const json = (await res.json()) as any;
        // `balance` is microstacks string
        return toBigIntSafe(json?.stx?.balance);
      }

      // SIP-010 contract balance via read-only.
      if (!tokenAddress.includes(".")) return BigInt(0);
      const [contractAddress, contractName] = tokenAddress.split(".");
      if (!contractAddress || !contractName) return BigInt(0);

      const result = await callReadOnlyFunction({
        contractAddress,
        contractName,
        functionName: "get-balance",
        functionArgs: [principalCV(address)],
        senderAddress: address,
        network: getStacksNetwork(),
      });

      const value = cvToValue(result, true);
      return toBigIntSafe(value);
    },
    staleTime: 5_000,
    refetchInterval: 15_000,
  });

  return {
    balance: query.data ?? BigInt(0),
    isLoading: query.isLoading,
    error: query.error,
    refetch: () => {
      void query.refetch();
    },
  };
};
