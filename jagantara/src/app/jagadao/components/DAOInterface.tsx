"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Shield,
  Vote,
  Clock,
  Users,
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertCircle,
  Wallet,
  BarChart3,
  ExternalLink,
} from "lucide-react";
import { useAccount } from "wagmi";
import ConnectWallet from "@/app/components/ConnectWallet";
import { useDAOGovernance, ClaimStatus } from "@/hooks/useDAOGovernance";
import toast from "react-hot-toast";
import { Token } from "@/types/stake";
import { TOKENS } from "@/constants/abi";
import { useTokenBalance } from "@/hooks/useTokenBalance";
import { formatBigInt, formatTokenAmount } from "@/lib/formatters";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from "@/components/ui/pagination";

interface Proposal {
  id: string;
  title: string;
  description: string;
  proposer: string;
  coveredAddress: string;
  amount: bigint;
  status: "active" | "passed" | "rejected" | "pending";
  votesFor: number;
  votesAgainst: number;
  totalVotes: number;
  quorum: number;
  timeLeft: string;
  category: string;
  canExecute: boolean;
}

export default function DAOInterface() {
  const [selectedProposal, setSelectedProposal] = useState<string | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loadingProposals, setLoadingProposals] = useState(true);
  const [tokenOut, setTokenOut] = useState<Token>(TOKENS.JAGA);
  const tokenOutBalance = useTokenBalance(tokenOut);
  const { isConnected } = useAccount();
  const [currentPage, setCurrentPage] = useState(1);
  const proposalsPerPage = 5; // Adjust per your design

  const {
    getClaimData,
    getClaimStatus,
    voteOnClaim,
    getClaimCounter,
    executeVote,
    getMinimumVotingPeriod,
  } = useDAOGovernance();

  useEffect(() => {
    const fetchProposals = async () => {
      setLoadingProposals(true);
      try {
        const count = await getClaimCounter();
        const result: Proposal[] = [];
        const claimIds = Array.from({ length: count }, (_, i) => i); // Replace with real dynamic claim count

        for (const id of claimIds) {
          try {
            const claim = await getClaimData(id);
            const statusEnum = await getClaimStatus(id);
            if (!claim || statusEnum === null) continue;
            const now = Date.now();

            const minimumVotingPeriod = await getMinimumVotingPeriod(); // ✅ await here
            const minVotingMs = Number(minimumVotingPeriod) * 1000;
            const proposalCreationTime = Number(claim.createdAt) * 1000;

            const canExecute = now > proposalCreationTime + minVotingMs;
            const end =
              Number(claim.createdAt) * 1000 + 7 * 24 * 60 * 60 * 1000;
            const timeLeft =
              statusEnum === ClaimStatus.Approved ||
              statusEnum === ClaimStatus.Rejected
                ? "Ended"
                : now > end
                  ? "Ended"
                  : `${Math.floor((end - now) / (1000 * 60 * 60 * 24))} days`;

            result.push({
              id: id.toString(),
              title: claim.title,
              description: claim.reason,
              proposer: claim.claimant,
              coveredAddress: claim.coveredAddress,
              amount: BigInt(claim.amount),
              status:
                statusEnum === ClaimStatus.Pending
                  ? "active"
                  : statusEnum === ClaimStatus.Approved
                    ? "passed"
                    : "rejected",
              votesFor: Number(claim.yesVotes),
              votesAgainst: Number(claim.noVotes),
              totalVotes: Number(claim.yesVotes + claim.noVotes),
              quorum: 20000, // static or replace with config/quorum fetching
              timeLeft,
              category: claim.claimType,
              canExecute,
            });
          } catch (err) {
            console.warn("Failed to fetch claim", id, err);
          }
        }

        setProposals(result);
      } catch (err) {
        console.error("Failed to fetch proposals", err);
      } finally {
        setLoadingProposals(false);
      }
    };

    fetchProposals();
  }, []);

  const handleVote = async (proposalId: string, vote: "for" | "against") => {
    const approve = vote === "for";
    try {
      await voteOnClaim(Number(proposalId), approve);
      toast.success(`Voted ${vote} on proposal ${proposalId}`);
    } catch (err) {
      toast.error("Vote failed");
      console.error("Vote error:", err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "passed":
        return "bg-emerald-100 text-emerald-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Vote className="h-4 w-4" />;
      case "passed":
        return <CheckCircle className="h-4 w-4" />;
      case "rejected":
        return <XCircle className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };
  const activeProposals = proposals.filter((p) => p.status === "active");
  const totalPages = Math.ceil(activeProposals.length / proposalsPerPage);
  const paginatedProposals = activeProposals.slice(
    (currentPage - 1) * proposalsPerPage,
    currentPage * proposalsPerPage
  );

  return (
    <div>
      {isConnected ? (
        <div className="rounded-2xl">
          <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Tabs defaultValue="active" className="space-y-6">
              <div className="flex justify-between items-center md:flex-row flex-col">
                <TabsList className="grid w-full max-w-md grid-cols-2 border-slate-500">
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                  {/* <TabsTrigger value="analytics">Analytics</TabsTrigger> */}
                </TabsList>

                <div className="flex items-center space-x-4 text-sm md:mt-0 mt-4">
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>12,847 Members</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    🛡️
                    <span>
                      {" "}
                      {formatTokenAmount(
                        tokenOutBalance.balance,
                        tokenOut.symbol as keyof typeof TOKENS // ✅ use tokenIn here
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <TabsContent value="active" className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-3">
                  {/* Proposals List */}
                  <div className="lg:col-span-2 space-y-4">
                    {loadingProposals ? (
                      <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                          <div
                            key={i}
                            className="p-4 rounded-lg bg-[var(--secondary)]"
                          >
                            <Skeleton className="h-6 w-32 mb-2" />
                            <Skeleton className="h-4 w-full mb-2" />
                            <Skeleton className="h-4 w-3/4 mb-4" />
                            <Skeleton className="h-3 w-full" />
                          </div>
                        ))}
                      </div>
                    ) : proposals.filter((p) => p.status === "active")
                        .length === 0 ? (
                      <div className="flex flex-col items-center justify-center mt-24  opacity-75">
                        <div className="bg-blue-900/30 p-6 rounded-full mb-4">
                          <div className="text-5xl">🗳️</div>
                        </div>
                        <h3 className="text-xl font-semibold mb-1">
                          No Active Proposals
                        </h3>
                        <p className="text-sm text-[var(--text)]/60 max-w-sm text-center">
                          It looks like there are currently no proposals open
                          for voting. Please check back later or create a new
                          one.
                        </p>
                      </div>
                    ) : (
                      paginatedProposals.map((proposal) => (
                        <Card
                          key={proposal.id}
                          className="hover:shadow-md transition-shadow cursor-pointer bg-[var(--secondary)]"
                          onClick={() => setSelectedProposal(proposal.id)}
                        >
                          <CardHeader>
                            <div className="flex justify-between items-start">
                              <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                  <Badge
                                    className={getStatusColor(proposal.status)}
                                  >
                                    {getStatusIcon(proposal.status)}
                                    <span className="ml-1 capitalize">
                                      {proposal.status}
                                    </span>
                                  </Badge>
                                  <Badge variant="outline">
                                    {proposal.category}
                                  </Badge>
                                </div>
                                {proposal.coveredAddress && (
                                  <p className="text-xs text-muted-foreground break-all">
                                    Covered Address: {proposal.coveredAddress}
                                  </p>
                                )}
                                <CardTitle className="text-lg">
                                  {proposal.title}
                                </CardTitle>
                              </div>
                              <div className="text-right text-sm">
                                <div className="flex items-center space-x-1">
                                  <Clock className="h-3 w-3" />
                                  <span>{proposal.timeLeft}</span>
                                </div>
                              </div>
                            </div>
                            <CardDescription className="line-clamp-2">
                              {proposal.description}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div className="flex justify-between text-sm">
                                <span>
                                  ✅ For:{" "}
                                  {formatBigInt(
                                    BigInt(proposal.votesFor),
                                    6
                                  ).toLocaleString()}
                                </span>
                                <span>
                                  ❌ Against:{" "}
                                  {formatBigInt(
                                    BigInt(proposal.votesAgainst),
                                    6
                                  ).toLocaleString()}
                                </span>
                              </div>
                              <Progress
                                value={
                                  (Number(
                                    formatBigInt(BigInt(proposal.votesFor), 6)
                                  ) /
                                    (Number(
                                      formatBigInt(BigInt(proposal.votesFor), 6)
                                    ) +
                                      Number(
                                        formatBigInt(
                                          BigInt(proposal.votesAgainst),
                                          6
                                        )
                                      ) || 1)) *
                                  100
                                }
                                className="h-2 bg-white/40"
                              />
                              <div className="flex justify-between text-xs">
                                <div className="flex flex-col md:flex-row items-center gap-3">
                                  {proposal.canExecute && (
                                    <Button
                                      className="bg-[var(--third)] hover:bg-[var(--third)]/50 cursor-pointer"
                                      onClick={async () => {
                                        try {
                                          await executeVote(
                                            Number(proposal.id)
                                          );
                                          toast.success(
                                            `Proposal ${proposal.id} executed`
                                          );
                                        } catch (err) {
                                          toast.error("Execution failed");
                                          console.error(
                                            "Execute vote error:",
                                            err
                                          );
                                        }
                                      }}
                                    >
                                      <CheckCircle className="h-4 w-4" />
                                      Execute Vote
                                    </Button>
                                  )}
                                  <Button
                                    className="bg-[var(--third)] hover:bg-[var(--third)]/50 cursor-pointer hidden md:flex"
                                    onClick={() =>
                                      window.open(
                                        `https://bscscan.com/address/${proposal.coveredAddress}`,
                                        "_blank"
                                      )
                                    }
                                  >
                                    <ExternalLink className="h-4 w-4" />
                                    View on Explorer
                                  </Button>
                                </div>

                                <span className="">
                                  Amount to cover: {""}
                                  {formatBigInt(
                                    BigInt(proposal.amount),
                                    6
                                  ).toString()}{" "}
                                  USDC
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                    {totalPages >= 1 && (
                      <Pagination className="mt-6">
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious
                              className={
                                currentPage === 1
                                  ? "pointer-events-none opacity-50"
                                  : ""
                              }
                              onClick={() =>
                                setCurrentPage((prev) => Math.max(prev - 1, 1))
                              }
                            />
                          </PaginationItem>

                          {[...Array(totalPages)].map((_, i) => {
                            const page = i + 1;
                            return (
                              <PaginationItem key={page}>
                                <PaginationLink
                                  isActive={currentPage === page}
                                  onClick={() => setCurrentPage(page)}
                                >
                                  {page}
                                </PaginationLink>
                              </PaginationItem>
                            );
                          })}

                          <PaginationItem>
                            <PaginationNext
                              className={
                                currentPage === totalPages
                                  ? "pointer-events-none opacity-50"
                                  : ""
                              }
                              onClick={() =>
                                setCurrentPage((prev) =>
                                  Math.min(prev + 1, totalPages)
                                )
                              }
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    )}
                  </div>

                  {/* Voting Panel */}
                  <div className="space-y-6 sticky top-10 self-start">
                    {selectedProposal ? (
                      <Card className="bg-[var(--secondary)]">
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <Vote className="h-5 w-5" />
                            <span>Cast Your Vote</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {(() => {
                            const proposal = proposals.find(
                              (p) => p.id === selectedProposal
                            );
                            if (!proposal) return null;

                            return (
                              <>
                                <div className="p-3 bg-[var(--third)] rounded-lg">
                                  <h4 className="font-medium text-sm mb-1">
                                    {proposal.title}
                                  </h4>
                                  <p className="text-xs">
                                    {proposal.description}
                                  </p>
                                </div>

                                <div className="space-y-2">
                                  <div className="flex justify-between text-sm">
                                    <span>Your Voting Power:</span>
                                    <span className="font-medium">
                                      {formatTokenAmount(
                                        tokenOutBalance.balance,
                                        tokenOut.symbol as keyof typeof TOKENS // ✅ use tokenIn here
                                      )}
                                    </span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span>Time Remaining:</span>
                                    <span className="font-medium">
                                      {proposal.timeLeft}
                                    </span>
                                  </div>
                                </div>

                                <Separator />
                                <div className="flex flex-col">
                                  <div className="space-y-2 flex w-full gap-1">
                                    <Button
                                      className="w-1/2 bg-[var(--third)] hover:bg-[var(--third)]/50 cursor-pointer"
                                      onClick={() =>
                                        handleVote(proposal.id, "for")
                                      }
                                    >
                                      <CheckCircle className="h-4 w-4" />
                                      Vote For
                                    </Button>
                                    <Button
                                      className="w-1/2 cursor-pointer bg-[var(--third)] hover:bg-[var(--third)]/50"
                                      onClick={() =>
                                        handleVote(proposal.id, "against")
                                      }
                                    >
                                      <XCircle className="h-4 w-4" />
                                      Vote Against
                                    </Button>
                                  </div>
                                  <Button
                                    className="bg-[var(--third)] hover:bg-[var(--third)]/50 cursor-pointer"
                                    onClick={() =>
                                      window.open(
                                        `https://bscscan.com/address/${proposal.coveredAddress}`,
                                        "_blank"
                                      )
                                    }
                                  >
                                    <ExternalLink className="h-4 w-4" />
                                    View on Explorer
                                  </Button>
                                </div>
                              </>
                            );
                          })()}
                        </CardContent>
                      </Card>
                    ) : (
                      <Card className="bg-[var(--secondary)]">
                        <CardContent className="py-6">
                          <div className="text-center">
                            <Vote className="h-12 w-12 mx-auto mb-3 opacity-50" />
                            <p>Select a proposal to vote</p>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                    {/* Governance Stats */}
                    <Card className="bg-[var(--secondary)]">
                      <CardHeader>
                        <CardTitle className="text-lg">
                          🏛️Governance Stats
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-sm">🗝️ Total Proposals</span>
                          <span className="font-medium">
                            {proposals.length}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-sm">✅ Passed</span>
                          <span className="font-medium text-green-600">
                            {
                              proposals.filter((p) => p.status === "passed")
                                .length
                            }
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-sm">❌ Rejected</span>
                          <span className="font-medium text-red-600">
                            {
                              proposals.filter((p) => p.status === "rejected")
                                .length
                            }
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-sm">⌛ Active</span>
                          <span className="font-medium text-blue-600">
                            {
                              proposals.filter((p) => p.status === "active")
                                .length
                            }
                          </span>
                        </div>

                        <Separator />

                        <div className="flex justify-between">
                          <span className="text-sm ">Avg. Participation</span>
                          <span className="font-medium">68.2%</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="completed" className="space-y-4">
                {proposals.filter((p) => p.status !== "active").length === 0 ? (
                  <div className="text-center mt-32 ">
                    <div className="text-6xl mb-4">📊</div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-2 text-[var(--text)]">
                      No Completed Proposal found
                    </h3>
                  </div>
                ) : (
                  proposals
                    .filter((p) => p.status !== "active")
                    .map((proposal) => (
                      <Card key={proposal.id} className="bg-[var(--secondary)]">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <Badge
                                  className={getStatusColor(proposal.status)}
                                >
                                  {getStatusIcon(proposal.status)}
                                  <span className="ml-1 capitalize">
                                    {proposal.status}
                                  </span>
                                </Badge>
                                <Badge variant="outline">
                                  {proposal.category}
                                </Badge>
                              </div>
                              <CardTitle className="text-lg">
                                {proposal.title}
                              </CardTitle>
                            </div>
                          </div>
                          <CardDescription>
                            {proposal.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                              <span>
                                For: {proposal.votesFor.toLocaleString()}
                              </span>
                              <span>
                                Against:{" "}
                                {proposal.votesAgainst.toLocaleString()}
                              </span>
                            </div>
                            <Progress
                              value={
                                (proposal.votesFor /
                                  (proposal.votesFor + proposal.votesAgainst ||
                                    1)) *
                                100
                              }
                              className="h-2 bg-white/40"
                            />
                            <div className="flex justify-between text-xs gap-5">
                              <Button
                                className="bg-[var(--third)] hover:bg-[var(--third)]/50 cursor-pointer"
                                onClick={() =>
                                  window.open(
                                    `https://bscscan.com/address/${proposal.coveredAddress}`,
                                    "_blank"
                                  )
                                }
                              >
                                <ExternalLink className="h-4 w-4" />
                                View on Explorer
                              </Button>
                              <span className="text-xs">
                                Amount to cover: {""}
                                {formatBigInt(
                                  BigInt(proposal.amount),
                                  6
                                ).toString()}{" "}
                                USDC
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                )}
              </TabsContent>

              <TabsContent value="analytics">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <Card className="bg-[var(--secondary)]">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <TrendingUp className="h-5 w-5" />
                        <span>Participation Trend</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">68.2%</div>
                      <p className="text-sm text-gray-600">
                        Average participation rate
                      </p>
                      <div className="mt-2 text-sm text-green-600">
                        +5.3% from last month
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center text-center h-[60vh] space-y-6 pt-10">
          <Image
            src="/jagantara_icon.png"
            alt="Jagantara Icon"
            width={150}
            height={150}
            className="animate-pulse"
          />
          <h1 className="text-2xl font-bold text-[var(--text)]">
            Connect Your Wallet
          </h1>
          <p className="text-sm text-muted-foreground max-w-md">
            To access your JagaDAO and Vote, please connect your wallet
            securely.
          </p>
          <ConnectWallet />
        </div>
      )}
    </div>
  );
}
