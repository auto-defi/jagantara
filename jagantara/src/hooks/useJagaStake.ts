import { useAccount, useWriteContract, useReadContract } from "wagmi";
import { useState } from "react";
import { waitForTransactionReceipt } from "@wagmi/core";
import toast from "react-hot-toast";
import { CONTRACTS, ERC20_ABI, JAGA_STAKE_ABI } from "@/constants/abi";
import { config } from "@/app/lib/connector/xellar";
import { parseTokenAmount } from "@/lib/calculations";

export const useStake = () => {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const [isStaking, setIsStaking] = useState(false);
  const [isUnstaking, setIsUnstaking] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  // ✅ READ: User's staked balance
  const {
    data: currentStake,
    isLoading: isStakeLoading,
    refetch: refetchCurrentStake,
  } = useReadContract({
    address: CONTRACTS.JAGA_STAKE,
    abi: JAGA_STAKE_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      refetchInterval: 30000,
    },
  });

  // ✅ READ: Total USDC staked in the vault
  const {
    data: totalSupply,
    isLoading: isTotalSupplyLoading,
    refetch: refetchTotalSupply,
  } = useReadContract({
    address: CONTRACTS.JAGA_STAKE,
    abi: JAGA_STAKE_ABI,
    functionName: "totalSupply",
    query: {
      enabled: true,
      refetchInterval: 30000,
    },
  });

  // ✅ READ: Pending reward for user
  const {
    data: pendingReward,
    isLoading: isPendingLoading,
    refetch: refetchPendingReward,
  } = useReadContract({
    address: CONTRACTS.JAGA_STAKE,
    abi: JAGA_STAKE_ABI,
    functionName: "earned",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      refetchInterval: 30000,
    },
  });

  // ✅ READ: Time left in current reward period
  const {
    data: timeLeft,
    isLoading: isTimeLeftLoading,
    refetch: refetchTimeLeft,
  } = useReadContract({
    address: CONTRACTS.JAGA_STAKE,
    abi: JAGA_STAKE_ABI,
    functionName: "timeLeft",
    query: {
      enabled: true,
      refetchInterval: 30000,
    },
  });

  // ✅ WRITE: Stake
  const stake = async (amount: string): Promise<boolean> => {
    if (!address || !amount) return false;
    setIsStaking(true);

    try {
      const parsedAmount = parseTokenAmount(amount, 6);

      // 1. Approve USDC
      const approveHash = await writeContractAsync({
        address: CONTRACTS.USDC,
        abi: ERC20_ABI,
        functionName: "approve",
        args: [CONTRACTS.JAGA_STAKE, parsedAmount],
        account: address,
      });
      toast.loading("Approving USDC...", { id: "stake" });
      await waitForTransactionReceipt(config, { hash: approveHash });

      // 2. Stake
      toast.loading("Staking...", { id: "stake" });
      const stakeHash = await writeContractAsync({
        address: CONTRACTS.JAGA_STAKE,
        abi: JAGA_STAKE_ABI,
        functionName: "stake",
        args: [parsedAmount],
        account: address,
      });
      await waitForTransactionReceipt(config, { hash: stakeHash });

      toast.success(`Staked ${amount} USDC`, { id: "stake" });

      refetchCurrentStake();
      refetchPendingReward();
      refetchTimeLeft();
      return true;
    } catch (err) {
      console.error(err);
      toast.error("Stake failed", { id: "stake" });
      return false;
    } finally {
      setIsStaking(false);
    }
  };

  // ✅ WRITE: Unstake
  const unstake = async (amount: string): Promise<boolean> => {
    if (!address || !amount) return false;
    setIsUnstaking(true);

    try {
      const parsedAmount = parseTokenAmount(amount, 6);

      toast.loading("Unstaking...", { id: "unstake" });
      const hash = await writeContractAsync({
        address: CONTRACTS.JAGA_STAKE,
        abi: JAGA_STAKE_ABI,
        functionName: "unstake",
        args: [parsedAmount],
        account: address,
      });

      await waitForTransactionReceipt(config, { hash });
      toast.success(`Unstaked ${amount} USDC`, { id: "unstake" });

      refetchCurrentStake();
      refetchPendingReward();
      refetchTimeLeft();
      return true;
    } catch (err) {
      console.error(err);
      toast.error("Unstake failed", { id: "unstake" });
      return false;
    } finally {
      setIsUnstaking(false);
    }
  };

  // ✅ WRITE: Claim
  const claim = async (): Promise<boolean> => {
    if (!address) return false;
    setIsClaiming(true);

    try {
      toast.loading("Claiming rewards...", { id: "claim" });
      const hash = await writeContractAsync({
        address: CONTRACTS.JAGA_STAKE,
        abi: JAGA_STAKE_ABI,
        functionName: "claim",
        args: [],
        account: address,
      });

      await waitForTransactionReceipt(config, { hash });
      toast.success("Claim successful!", { id: "claim" });

      refetchPendingReward();
      refetchCurrentStake();
      refetchTimeLeft();
      return true;
    } catch (err) {
      console.error(err);
      toast.error("Claim failed", { id: "claim" });
      return false;
    } finally {
      setIsClaiming(false);
    }
  };

  return {
    stake,
    unstake,
    claim,
    isStaking,
    isUnstaking,
    isClaiming,
    currentStake: (currentStake as bigint) || BigInt(0),
    pendingReward: (pendingReward as bigint) || BigInt(0),
    timeLeft: timeLeft as number | undefined,
    isStakeLoading,
    isPendingLoading,
    isTimeLeftLoading,
    refetchCurrentStake,
    refetchPendingReward,
    refetchTimeLeft,
    totalSupply: (totalSupply as bigint) || BigInt(0),
    isTotalSupplyLoading,
    refetchTotalSupply,
  };
};
