import { useReadContract, useAccount } from "wagmi";
import { ERC20_ABI, CONTRACTS } from "@/constants/abi";
import type { Token } from "@/types/stake";

export const useTokenBalance = (token?: Token) => {
  const { address } = useAccount();

  const {
    data: balance,
    isLoading,
    refetch,
  } = useReadContract({
    address: token?.address as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: !!token && !!address,
      refetchInterval: 30000, // Refetch every 30 seconds
    },
  });

  //   const { data: allowance, refetch: refetchAllowance } = useReadContract({
  //     address: token?.address as `0x${string}`,
  //     abi: ERC20_ABI,
  //     functionName: "allowance",
  //     args: address
  //       ? [address, CONTRACTS.SIMPLE_DEX as `0x${string}`]
  //       : undefined,
  //     query: {
  //       enabled: !!token && !!address,
  //       refetchInterval: 30000,
  //     },
  //   });

  return {
    balance: (balance as bigint) || BigInt(0),
    // allowance: (allowance as bigint) || BigInt(0),
    isLoading,
    refetch,
    // refetchAllowance,
  };
};
