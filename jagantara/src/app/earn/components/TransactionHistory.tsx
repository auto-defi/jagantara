import { RefreshCw, Search } from "lucide-react";
import { useState, useMemo } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  useStakesByUser,
  useUnstakesByUser,
  useRewardClaimsByUser,
} from "@/hooks/useIndexerData";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { FaClock } from "react-icons/fa6";
import GradientText from "@/components/gradient-text";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useAccount } from "wagmi";

const formatDateFromTimestamp = (timestamp: string) => {
  const seconds = parseInt(timestamp);
  const date = new Date(seconds * 1000);
  return formatDistanceToNow(date, { addSuffix: true });
};

export default function TransactionHistory() {
  const { address } = useAccount();

  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const {
    data: stakes,
    isLoading: loadingStakes,
    refetch: refetchStakes,
  } = useStakesByUser(address);

  const {
    data: unstakes,
    isLoading: loadingUnstakes,
    refetch: refetchUnstakes,
  } = useUnstakesByUser(address);

  const {
    data: rewards,
    isLoading: loadingRewards,
    refetch: refetchRewards,
  } = useRewardClaimsByUser(address);

  const isLoading = loadingStakes || loadingUnstakes || loadingRewards;

  const combinedTransactions = useMemo(() => {
    const stakeTxs = (stakes || []).map((tx) => ({
      type: "Stake",
      amount: `+${(BigInt(tx.amount) / BigInt(1e6)).toString()} USDC`,
      date: formatDateFromTimestamp(tx.timestamp),
      status: "completed",
      hash: tx.transactionHash,
      address: tx.user,
    }));

    const unstakeTxs = (unstakes || []).map((tx) => ({
      type: "Unstake",
      amount: `-${(BigInt(tx.amount) / BigInt(1e6)).toString()} USDC`,
      date: formatDateFromTimestamp(tx.timestamp),
      status: "completed",
      hash: tx.transactionHash,
      address: tx.user,
    }));

    const rewardTxs = (rewards || []).map((tx) => ({
      type: "Reward",
      amount: `+${(BigInt(tx.reward) / BigInt(1e6)).toString()} USDC`,
      date: formatDateFromTimestamp(tx.timestamp),
      status: "completed",
      hash: tx.transactionHash,
      address: tx.user,
    }));

    const all = [...stakeTxs, ...unstakeTxs, ...rewardTxs];
    return all.sort((a, b) => {
      const aTime = new Date(a.date).getTime();
      const bTime = new Date(b.date).getTime();
      return bTime - aTime;
    });
  }, [stakes, unstakes, rewards]);

  const filteredTransactions = useMemo(() => {
    if (!searchTerm) return combinedTransactions;
    return combinedTransactions.filter((tx) =>
      `${tx.hash} ${tx.address} ${tx.type}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, combinedTransactions]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTransactions.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredTransactions, currentPage]);

  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([refetchStakes(), refetchUnstakes(), refetchRewards()]);
    } catch (e) {
      console.error("Failed to refresh", e);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-0">
      <div className="glass rounded-2xl p-4 sm:p-6 lg:p-8 border border-white/10 shadow-2xl">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 sm:mb-6 space-y-4 lg:space-y-0">
          <div className="flex items-center gap-3">
            <GradientText
              colors={[
                "var(--primary)",
                "var(--accent)",
                "var(--primary)",
                "var(--accent)",
              ]}
              animationSpeed={6}
              showBorder={false}
              className="font-normal"
            >
              Transaction History
            </GradientText>
          </div>

          <div className="flex flex-row items-center gap-2 sm:gap-3">
            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-lg border transition-colors disabled:opacity-50 cursor-pointer bg-[var(--accent)] text-sm"
              style={{ borderColor: "rgba(251, 250, 249, 0.2)" }}
            >
              <RefreshCw
                className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
              <span className="hidden sm:inline">
                {isRefreshing ? "Refreshing..." : "Refresh"}
              </span>
            </button>

            {/* Search Input */}
            <div className="relative flex-1 sm:flex-none">
              <input
                type="text"
                placeholder="Search address or hash..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg border input-primary text-sm w-full sm:w-64 opacity-70 bg-[var(--secondary)]"
                style={{ borderColor: "rgba(251, 250, 249, 0.2)" }}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Transaction List */}
        <div className="space-y-3 sm:space-y-4">
          {isLoading ? (
            <div className="text-center py-12 text-[var(--text)]/80">
              Loading indexed data...
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 ">
                No transactions found
              </h3>
              <p className="text-sm sm:text-base text-[var(--text)]/70">
                Try adjusting your filters or search terms.
              </p>
            </div>
          ) : (
            <Card className="border-0 shadow-lg bg-[var(--third)] md:px-10 md:py-8">
              <CardHeader>
                <CardTitle className="flex gap-2">
                  <FaClock /> Recent Activity
                </CardTitle>
                <CardDescription>
                  Your latest staking transactions and rewards
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {paginatedData.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-3 px-2 md:px-5 rounded-lg bg-[var(--secondary)] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            activity.type === "Reward"
                              ? "bg-green-500"
                              : activity.type === "Stake"
                                ? "bg-blue-500"
                                : "bg-red-500"
                          }`}
                        />
                        <div>
                          <p className="font-medium text-sm md:text-md">
                            {activity.type}
                          </p>
                          <p className="text-xs md:text-sm">{activity.date}</p>
                        </div>
                      </div>
                      <div className="text-right text-sm md:text-md">
                        <p
                          className={`font-semibold ${
                            activity.type === "Reward"
                              ? "text-green-600"
                              : activity.type === "Stake"
                                ? "text-blue-600"
                                : "text-red-600"
                          }`}
                        >
                          {activity.amount}
                        </p>
                        <p className="text-xs">{activity.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Pagination */}
        {filteredTransactions.length > ITEMS_PER_PAGE && (
          <div className="mt-6 flex justify-center">
            <Pagination>
              <PaginationContent className="gap-2">
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    className={
                      currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
                <PaginationItem>
                  <span className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
}
