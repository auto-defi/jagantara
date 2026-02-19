import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { readContract, waitForTransactionReceipt } from "@wagmi/core";
import { useState } from "react";
import { config } from "@/app/lib/connector/xellar";
import { DAO_GOVERNANCE_ABI, CONTRACTS } from "@/constants/abi";
import toast from "react-hot-toast";

// Types
export enum ClaimStatus {
  Pending,
  Approved,
  Rejected,
}

export const useDAOGovernance = () => {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);

  // 🔹 Submit a claim
  const submitClaim = async (
    reason: string,
    title: string,
    claimType: string,
    amount: bigint
  ): Promise<number | null> => {
    if (!address) return null;
    setIsSubmitting(true);
    try {
      const hash = await writeContractAsync({
        address: CONTRACTS.DAO_GOVERNANCE,
        abi: DAO_GOVERNANCE_ABI,
        functionName: "submitClaim",
        args: [reason, title, claimType, amount],
        account: address,
      });
      await waitForTransactionReceipt(config, { hash });
      toast.success("Claim submitted successfully");
      return null;
    } catch (err) {
      console.error("submitClaim error", err);
      toast.error("Claim submission failed");
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🔹 Vote on a claim
  const voteOnClaim = async (claimId: number, approve: boolean) => {
    if (!address) return;
    setIsVoting(true);
    try {
      const hash = await writeContractAsync({
        address: CONTRACTS.DAO_GOVERNANCE,
        abi: DAO_GOVERNANCE_ABI,
        functionName: "vote",
        args: [claimId, approve],
        account: address,
      });
      await waitForTransactionReceipt(config, { hash });
      toast.success("Vote cast successfully");
    } catch (err) {
      console.error("voteOnClaim error", err);
      toast.error("Failed to cast vote");
    } finally {
      setIsVoting(false);
    }
  };

  // 🔹 Execute vote
  const executeVote = async (claimId: number): Promise<number | null> => {
    if (!address) return null;
    setIsExecuting(true);
    try {
      const hash = await writeContractAsync({
        address: CONTRACTS.DAO_GOVERNANCE,
        abi: DAO_GOVERNANCE_ABI,
        functionName: "executeVote",
        args: [claimId],
        account: address,
      });
      const receipt = await waitForTransactionReceipt(config, { hash });
      toast.success("Vote executed");
      return null;
    } catch (err) {
      console.error("executeVote error", err);
      toast.error("Vote execution failed");
      return null;
    } finally {
      setIsExecuting(false);
    }
  };

  // 🔹 Get claim status
  const getClaimStatus = async (
    claimId: number
  ): Promise<ClaimStatus | null> => {
    try {
      const status = await readContract(config, {
        address: CONTRACTS.DAO_GOVERNANCE,
        abi: DAO_GOVERNANCE_ABI,
        functionName: "getClaimStatus",
        args: [claimId],
      });
      return status as ClaimStatus;
    } catch (err) {
      console.error("getClaimStatus error", err);
      return null;
    }
  };

  // 🔹 Get full claim proposal
  const getClaimData = async (
    claimId: number
  ): Promise<{
    claimant: string;
    coveredAddress: string;
    tier: bigint;
    title: string;
    reason: string;
    claimType: string;
    amount: bigint;
    createdAt: bigint;
    yesVotes: bigint;
    noVotes: bigint;
    status: ClaimStatus;
    approvedAt: bigint;
  } | null> => {
    try {
      const result = await readContract(config, {
        address: CONTRACTS.DAO_GOVERNANCE,
        abi: DAO_GOVERNANCE_ABI,
        functionName: "claims",
        args: [claimId],
      });

      const [
        claimant,
        coveredAddress,
        tier,
        title,
        reason,
        claimType,
        amount,
        createdAt,
        yesVotes,
        noVotes,
        status,
        approvedAt,
      ] = result as [
        string,
        string,
        bigint,
        string,
        string,
        string,
        bigint,
        bigint,
        bigint,
        bigint,
        ClaimStatus,
        bigint,
      ];

      return {
        claimant,
        coveredAddress,
        tier,
        title,
        reason,
        claimType,
        amount,
        createdAt,
        yesVotes,
        noVotes,
        status,
        approvedAt,
      };
    } catch (err) {
      console.error("getClaimData error", err);
      return null;
    }
  };

  // 🔹 Get total number of proposals
  const getClaimCounter = async (): Promise<number> => {
    try {
      const result = await readContract(config, {
        address: CONTRACTS.DAO_GOVERNANCE,
        abi: DAO_GOVERNANCE_ABI,
        functionName: "claimCounter",
      });

      return Number(result);
    } catch (err) {
      console.error("getClaimCounter error", err);
      return 0;
    }
  };

  // 🔹 Get minimum voting period
  const getMinimumVotingPeriod = async (): Promise<number> => {
    try {
      const result = await readContract(config, {
        address: CONTRACTS.DAO_GOVERNANCE,
        abi: DAO_GOVERNANCE_ABI,
        functionName: "minimumVotingPeriod",
      });

      return Number(result);
    } catch (err) {
      console.error("getMinimumVotingPeriod error", err);
      return 0;
    }
  };

  // 🔹 Check if a claim is approved
  const isClaimApproved = async (claimId: number): Promise<boolean> => {
    try {
      const result = await readContract(config, {
        address: CONTRACTS.DAO_GOVERNANCE,
        abi: DAO_GOVERNANCE_ABI,
        functionName: "isClaimApproved",
        args: [claimId],
      });

      return Boolean(result);
    } catch (err) {
      console.error("isClaimApproved error", err);
      return false;
    }
  };

  return {
    submitClaim,
    voteOnClaim,
    executeVote,
    getClaimStatus,
    getClaimData,
    getClaimCounter,
    getMinimumVotingPeriod,
    isClaimApproved,
    isSubmitting,
    isVoting,
    isExecuting,
  };
};
