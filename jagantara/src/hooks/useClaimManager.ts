import { useAccount, useWriteContract, useReadContract } from "wagmi";
import { useState } from "react";
import { waitForTransactionReceipt } from "@wagmi/core";
import {
  CONTRACTS,
  CLAIM_MANAGER_ABI,
  DAO_GOVERNANCE_ABI,
} from "@/constants/abi";
import toast from "react-hot-toast";
import { config } from "@/app/lib/connector/xellar";
import { formatTokenAmount } from "@/lib/calculations";

export const useClaimManager = () => {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();

  // Loading states
  const [isClaimingPayout, setIsClaimingPayout] = useState(false);
  const [isSettingConfig, setIsSettingConfig] = useState(false);

  // 🧠 READ: vault balance (USDC balance of the contract)
  const {
    data: vaultBalance,
    isLoading: isVaultBalanceLoading,
    refetch: refetchVaultBalance,
  } = useReadContract({
    address: CONTRACTS.CLAIM_MANAGER as `0x${string}`,
    abi: CLAIM_MANAGER_ABI,
    functionName: "vaultBalance",
    query: {
      enabled: true,
      refetchInterval: 30000,
    },
  });

  // 🧠 READ: owner
  const {
    data: owner,
    isLoading: isOwnerLoading,
    refetch: refetchOwner,
  } = useReadContract({
    address: CONTRACTS.CLAIM_MANAGER as `0x${string}`,
    abi: CLAIM_MANAGER_ABI,
    functionName: "owner",
    query: {
      enabled: true,
    },
  });

  // 🧠 READ: daoGovernance address
  const {
    data: daoGovernance,
    isLoading: isDaoGovernanceLoading,
    refetch: refetchDaoGovernance,
  } = useReadContract({
    address: CONTRACTS.CLAIM_MANAGER as `0x${string}`,
    abi: CLAIM_MANAGER_ABI,
    functionName: "daoGovernance",
    query: {
      enabled: true,
    },
  });

  // 🧠 READ: jagaStake address
  const {
    data: jagaStake,
    isLoading: isJagaStakeLoading,
    refetch: refetchJagaStake,
  } = useReadContract({
    address: CONTRACTS.CLAIM_MANAGER as `0x${string}`,
    abi: CLAIM_MANAGER_ABI,
    functionName: "jagaStake",
    query: {
      enabled: true,
    },
  });

  // 🧠 READ: usdc address
  const {
    data: usdc,
    isLoading: isUsdcLoading,
    refetch: refetchUsdc,
  } = useReadContract({
    address: CONTRACTS.CLAIM_MANAGER as `0x${string}`,
    abi: CLAIM_MANAGER_ABI,
    functionName: "usdc",
    query: {
      enabled: true,
    },
  });

  // 🧠 READ: check if claim is executed
  const getClaimExecuted = (claimId: number) => {
    return useReadContract({
      address: CONTRACTS.CLAIM_MANAGER as `0x${string}`,
      abi: CLAIM_MANAGER_ABI,
      functionName: "claimExecuted",
      args: [BigInt(claimId)],
      query: {
        enabled: claimId !== undefined,
      },
    });
  };

  // 🧠 READ: get claim data from DAO (if DAO governance is set)
  const getClaimData = (claimId: number) => {
    return useReadContract({
      address: daoGovernance as `0x${string}`,
      abi: DAO_GOVERNANCE_ABI,
      functionName: "getClaimData",
      args: [BigInt(claimId)],
      query: {
        enabled: !!daoGovernance && claimId !== undefined,
      },
    });
  };

  // 🧠 READ: check if claim is approved by DAO
  const getClaimApproved = (claimId: number) => {
    return useReadContract({
      address: daoGovernance as `0x${string}`,
      abi: DAO_GOVERNANCE_ABI,
      functionName: "isClaimApproved",
      args: [BigInt(claimId)],
      query: {
        enabled: !!daoGovernance && claimId !== undefined,
      },
    });
  };

  // ✅ WRITE: claimPayout()
  const claimPayout = async (claimId: number): Promise<boolean> => {
    if (!address || claimId === undefined) return false;
    setIsClaimingPayout(true);

    try {
      toast.loading("Processing claim payout...", { id: "claimPayout" });

      const hash = await writeContractAsync({
        address: CONTRACTS.CLAIM_MANAGER as `0x${string}`,
        abi: CLAIM_MANAGER_ABI,
        functionName: "claimPayout",
        args: [BigInt(claimId)],
        account: address,
      });

      await waitForTransactionReceipt(config, { hash });
      toast.success(`Successfully claimed payout for claim #${claimId}`, {
        id: "claimPayout",
        duration: 5000,
      });

      // 🔄 Refetch data
      refetchVaultBalance();
      return true;
    } catch (error) {
      console.error("Claim payout failed:", error);
      toast.error("Claim payout failed. Please try again.", {
        id: "claimPayout",
      });
      return false;
    } finally {
      setIsClaimingPayout(false);
    }
  };

  // ✅ WRITE: setConfig()
  const setConfig = async (
    daoGovernanceAddr: string,
    jagaStakeAddr: string
  ): Promise<boolean> => {
    if (!address || !daoGovernanceAddr || !jagaStakeAddr) return false;
    setIsSettingConfig(true);

    try {
      toast.loading("Setting configuration...", { id: "setConfig" });
      const hash = await writeContractAsync({
        address: CONTRACTS.CLAIM_MANAGER as `0x${string}`,
        abi: CLAIM_MANAGER_ABI,
        functionName: "setConfig",
        args: [
          daoGovernanceAddr as `0x${string}`,
          jagaStakeAddr as `0x${string}`,
        ],
        account: address,
      });

      await waitForTransactionReceipt(config, { hash });
      toast.success("Successfully updated configuration", {
        id: "setConfig",
        duration: 5000,
      });

      // 🔄 Refetch data
      refetchDaoGovernance();
      refetchJagaStake();
      return true;
    } catch (error) {
      console.error("Set config failed:", error);
      toast.error("Set config failed. Please try again.", { id: "setConfig" });
      return false;
    } finally {
      setIsSettingConfig(false);
    }
  };

  // Helper function to check if current user is owner
  const isOwner =
    address &&
    owner &&
    address.toLowerCase() === (owner as string).toLowerCase();

  // Helper function to check if a claim is valid and can be executed
  const canClaimPayout = (claimId: number) => {
    const { data: claimData } = getClaimData(claimId);
    const { data: isApproved } = getClaimApproved(claimId);
    const { data: isExecuted } = getClaimExecuted(claimId);

    if (!claimData || !isApproved || isExecuted) return false;

    const [claimant, amount, approvedAt] = claimData as [
      string,
      bigint,
      bigint,
    ];
    const currentTime = Math.floor(Date.now() / 1000);
    const expiryTime = Number(approvedAt) + 7 * 24 * 60 * 60; // 7 days

    return (
      address?.toLowerCase() === claimant.toLowerCase() &&
      isApproved &&
      currentTime <= expiryTime &&
      !isExecuted
    );
  };

  // Helper function to get claim expiry time
  const getClaimExpiryTime = (claimId: number) => {
    const { data: claimData } = getClaimData(claimId);
    if (!claimData) return null;

    const [, , approvedAt] = claimData as [string, bigint, bigint];
    return Number(approvedAt) + 7 * 24 * 60 * 60; // 7 days in seconds
  };

  // Helper function to check if claim is expired
  const isClaimExpired = (claimId: number) => {
    const expiryTime = getClaimExpiryTime(claimId);
    if (!expiryTime) return false;

    const currentTime = Math.floor(Date.now() / 1000);
    return currentTime > expiryTime;
  };

  return {
    // Write functions
    claimPayout,
    setConfig,

    // Loading states
    isClaimingPayout,
    isSettingConfig,

    // Read data
    vaultBalance: (vaultBalance as bigint) || BigInt(0),
    owner: owner as string | undefined,
    daoGovernance: daoGovernance as string | undefined,
    jagaStake: jagaStake as string | undefined,
    usdc: usdc as string | undefined,
    isOwner,

    // Read loading states
    isVaultBalanceLoading,
    isOwnerLoading,
    isDaoGovernanceLoading,
    isJagaStakeLoading,
    isUsdcLoading,

    // Refetch functions
    refetchVaultBalance,
    refetchOwner,
    refetchDaoGovernance,
    refetchJagaStake,
    refetchUsdc,

    // Helper functions for claim management
    getClaimExecuted,
    getClaimData,
    getClaimApproved,
    canClaimPayout,
    getClaimExpiryTime,
    isClaimExpired,

    // Formatted helpers
    formattedVaultBalance: formatTokenAmount(
      (vaultBalance as bigint) || BigInt(0),
      6
    ),
  };
};
