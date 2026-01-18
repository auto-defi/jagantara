import { useAccount, useWriteContract, useReadContract } from "wagmi";
import { useState } from "react";
import { waitForTransactionReceipt } from "@wagmi/core";
import toast from "react-hot-toast";
import { config } from "@/app/lib/connector/xellar";
import { CONTRACTS, ERC20_ABI, MORPHO_REINVEST_ABI } from "@/constants/abi";
import { parseTokenAmount } from "@/lib/calculations";

export const useMorphoReinvest = () => {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const [isDepositing, setIsDepositing] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  // ✅ READ: Total Reinvested USDC
  const {
    data: totalReinvested,
    isLoading: isReinvestedLoading,
    refetch: refetchReinvested,
  } = useReadContract({
    address: CONTRACTS.MORPHO_REINVEST,
    abi: MORPHO_REINVEST_ABI,
    functionName: "totalReinvested",
    query: {
      enabled: true,
      refetchInterval: 30000,
    },
  });

  // ✅ WRITE: Deposit into Morpho Vault
  const deposit = async (amount: string): Promise<boolean> => {
    if (!address || !amount) return false;
    setIsDepositing(true);

    try {
      const parsedAmount = parseTokenAmount(amount, 6); // USDC = 6 decimals

      // 1. Approve USDC to reinvest contract
      toast.loading("Approving USDC...", { id: "morpho" });
      const approveHash = await writeContractAsync({
        address: CONTRACTS.USDC,
        abi: ERC20_ABI,
        functionName: "approve",
        args: [CONTRACTS.MORPHO_REINVEST, parsedAmount],
        account: address,
      });
      await waitForTransactionReceipt(config, { hash: approveHash });

      // 2. Deposit in Vault
      toast.loading("Depositing to Morpho Vault...", { id: "morpho" });
      const depositHash = await writeContractAsync({
        address: CONTRACTS.MORPHO_REINVEST,
        abi: MORPHO_REINVEST_ABI,
        functionName: "depositInVault",
        args: [parsedAmount],
        account: address,
      });
      await waitForTransactionReceipt(config, { hash: depositHash });

      toast.success(`Deposited ${amount} USDC`, { id: "morpho" });

      refetchReinvested();
      return true;
    } catch (err) {
      console.error(err);
      toast.error("Deposit failed", { id: "morpho" });
      return false;
    } finally {
      setIsDepositing(false);
    }
  };

  // ✅ WRITE: Redeem all from Vault
  const redeem = async (): Promise<boolean> => {
    if (!address) return false;
    setIsRedeeming(true);

    try {
      toast.loading("Redeeming all from Morpho Vault...", { id: "redeem" });
      const hash = await writeContractAsync({
        address: CONTRACTS.MORPHO_REINVEST,
        abi: MORPHO_REINVEST_ABI,
        functionName: "redeemAllFromVault",
        args: [],
        account: address,
      });

      await waitForTransactionReceipt(config, { hash });
      toast.success("Redeemed from Vault", { id: "redeem" });

      refetchReinvested();
      return true;
    } catch (err) {
      console.error(err);
      toast.error("Redeem failed", { id: "redeem" });
      return false;
    } finally {
      setIsRedeeming(false);
    }
  };

  // ✅ WRITE: Claim rewards
  const claim = async (
    distributor: string,
    asset: string,
    claimable: bigint,
    proof: `0x${string}`[]
  ): Promise<boolean> => {
    if (!address) return false;
    setIsClaiming(true);

    try {
      toast.loading("Claiming rewards...", { id: "claim" });

      const hash = await writeContractAsync({
        address: CONTRACTS.MORPHO_REINVEST,
        abi: MORPHO_REINVEST_ABI,
        functionName: "claim",
        args: [distributor, address, asset, claimable, proof],
        account: address,
      });

      await waitForTransactionReceipt(config, { hash });
      toast.success("Claim successful!", { id: "claim" });

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
    deposit,
    redeem,
    claim,
    totalReinvested: (totalReinvested as bigint) || BigInt(0),
    isReinvestedLoading,
    isDepositing,
    isRedeeming,
    isClaiming,
    refetchReinvested,
  };
};
