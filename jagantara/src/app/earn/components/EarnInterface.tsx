import { TOKENS } from "@/constants/abi";
import { useStake } from "@/hooks/useJagaStake";
import { formatTokenAmount } from "@/lib/formatters";
import {
  formatNextSessionDate,
  formatTimeLeft,
  getActiveFrom,
} from "@/lib/utils";
import { Token } from "@/types/stake";
import { ArrowDown, Droplet, Info, TrendingUp, Zap } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function EarnInterface() {
  const {
    currentStake,
    unstake,
    isUnstaking,
    refetchCurrentStake,
    timeLeft,
    pendingReward,
    claim,
  } = useStake();
  const [amountIn, setAmountIn] = useState<string>("");
  const [isClaiming, setIsClaiming] = useState<boolean>(false);
  const amountOut = amountIn || "0.0";
  const [activeTab, setActiveTab] = useState<"add" | "remove">("add");
  const isInsufficientBalance = () => {
    const balance = 1000; // user USDC balance
    return parseFloat(amountIn || "0") > balance;
  };
  const isInsufficientBalanceRemove = () => {
    const balance = Number(currentStake) / Math.pow(10, 6);
    console.log("Current Stake Balance:", balance);
    return parseFloat(amountIn || "0") > balance;
  };
  const rewardAmount = Number(pendingReward) / 1e6;
  const hasReward = rewardAmount > 0;
  const handleClaim = async () => {
    if (isClaiming || !hasReward) return;

    setIsClaiming(true);
    try {
      const success = await claim();
      if (success) {
        refetchCurrentStake();
      }
    } catch (error) {
      console.error("Claim error:", error);
    } finally {
      setIsClaiming(false);
    }
  };

  const handleRemove = async () => {
    console.log("Removing stake:", amountIn);
    if (isUnstaking || !amountIn) return;

    const success = await unstake(amountIn);
    if (success) {
      setAmountIn("");
      refetchCurrentStake();
    }
  };

  const handleMaxClickRemove = () => {
    const balance = Number(currentStake) / Math.pow(10, 6);
    setAmountIn(balance.toString());
  };
  return (
    <div className="w-full  mx-auto px-0">
      <div className="glass rounded-2xl p-5 sm:p-6 lg:p-8 card-hover border border-white/10 shadow-2xl">
        {/* Header with Tabs */}
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center justify-center mb-4">
            <div
              className="flex p-1 rounded-xl border w-full sm:w-auto bg-white/30 dark:bg-white/5 backdrop-blur-sm  shadow-xl"
              style={{
                borderColor: "rgba(251, 250, 249, 0.2)",
              }}
            >
              <button
                onClick={() => setActiveTab("add")}
                className={`flex-1 sm:flex-none px-4 sm:px-6 py-2 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base cursor-pointer ${
                  activeTab === "add"
                    ? "bg-[image:var(--gradient-accent-soft)]"
                    : " hover:bg-white/40 dark:hover:bg-white/10 shadow-xl"
                }`}
              >
                Claim Reward
              </button>
              <button
                onClick={() => setActiveTab("remove")}
                className={`flex-1 sm:flex-none px-4 sm:px-6 py-2 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base cursor-pointer ${
                  activeTab === "remove"
                    ? "bg-[image:var(--gradient-accent-soft)]"
                    : "  hover:bg-white/40 dark:hover:bg-white/10 shadow-xl"
                }`}
              >
                Remove Position
              </button>
            </div>
          </div>
        </div>

        {/* Token Output */}
        {activeTab === "add" ? (
          <div>
            <div className="relative mt-5">
              <div className="p-3 sm:p-4 rounded-xl border border-slate-400 bg-[var(--secondary)]">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs sm:text-sm opacity-70">USDC</span>
                  <span className="text-xs sm:text-sm truncate ml-2 opacity-70">
                    Available:{" "}
                    {(() => {
                      const raw = formatTokenAmount(pendingReward, "USDC");

                      // Remove commas and strip token symbol
                      const numericPart = raw.replace(/,/g, "").split(" ")[0];

                      const num = Number(numericPart);
                      return isNaN(num)
                        ? "0"
                        : Math.floor(num).toLocaleString();
                    })()}
                  </span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex-1 text-lg sm:text-2xl font-bold min-w-0 truncate">
                    {formatTokenAmount(pendingReward, "USDC")}
                  </div>
                  <div
                    className="flex items-center gap-1 p-2 rounded-xl border"
                    style={{
                      backgroundColor: "rgba(131, 110, 249, 0.1)",
                      borderColor: "rgba(131, 110, 249, 0.3)",
                    }}
                  >
                    <Image
                      src={"/usdc_logo.png"}
                      width={50}
                      height={50}
                      alt="usdc"
                      className="object-cover w-7 h-6"
                    />
                    <span className="font-normal text-sm ">USDC</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Info */}
            <div className="relative mt-5">
              <div className="p-3 sm:p-4 rounded-xl border border-slate-400 bg-[var(--secondary)]">
                <div className="flex justify-between md:text-md text-sm">
                  <p className="opacity-70 font-light">📌 Active from</p>
                  <p className="font-medium">{getActiveFrom(timeLeft!)}</p>
                </div>
                <div className="flex justify-between md:text-md text-sm">
                  <p className="opacity-70 font-light">🔑 Next Batch</p>
                  <p className="font-medium">
                    {formatNextSessionDate(timeLeft!)}
                  </p>
                </div>
                <div className="flex justify-between md:text-md text-sm">
                  <p className="opacity-70 font-light">⌛ Valid Until</p>
                  <p className="font-medium">{formatTimeLeft(timeLeft!)}</p>
                </div>
                <div className="flex justify-between md:text-md text-sm">
                  <p className="opacity-70 font-light">🕒 Batch Duration</p>
                  <p className="font-medium">30 Days</p>
                </div>
              </div>
            </div>

            {/* Info line */}
            <div className="flex items-center  gap-2 mt-4 text-xs md:text-sm text-[var(--text)]/70">
              <Info className="md:w-4 md:h-4 h-4 w-4 text-blue-400" />
              <span>
                Rewards are distibuted per second based on company revenue.
              </span>
            </div>
            {/* Claim Button */}
            <button
              onClick={handleClaim}
              disabled={!hasReward}
              className={`w-full mt-6 py-4 rounded-xl font-bold text-lg md:text-lg transition-all duration-300 flex items-center justify-center gap-2 bg-[image:var(--gradient-accent-soft)]  hover:opacity-90 cursor-pointer `}
            >
              {isClaiming ? (
                <>
                  <div className="spinner w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin" />
                  <span>Claiming...</span>
                </>
              ) : isInsufficientBalance() ? (
                "Insufficient Balance"
              ) : !hasReward ? (
                "No Reward Available"
              ) : (
                <>
                  <Droplet className="w-5 h-5" />
                  <span>Claim Rewards</span>
                </>
              )}
            </button>
          </div>
        ) : (
          <div>
            {/* Info */}
            <div className="relative mt-5">
              <div className="p-3 sm:p-4 rounded-xl border border-slate-400 bg-[var(--secondary)]">
                <p className="text-md pb-3 font-semibold">Your Position</p>
                <div className="flex justify-between md:text-md text-sm">
                  <p className="opacity-70 font-light">⌛ Active from</p>
                  <p className="font-medium">{getActiveFrom(timeLeft!)}</p>
                </div>
                <div className="flex justify-between md:text-md text-sm">
                  <p className="opacity-70 font-light">🕒 Batch Duration</p>
                  <p className="font-medium">30 Days</p>
                </div>
                <div className="flex justify-between md:text-md text-sm">
                  <p className="opacity-70 font-light">💸 Total Deposit</p>
                  <p className="font-medium text-green-600">
                    {formatTokenAmount(currentStake, "USDC")}
                  </p>
                </div>
              </div>
            </div>
            {/* Token Input */}
            <div className="space-y-3 sm:space-y-4 my-6">
              <div className="relative">
                <div className="p-3 sm:p-4 rounded-xl border bg-[var(--secondary)] border-slate-400">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs sm:text-sm opacity-70">USDC</span>
                    <span className="text-xs sm:text-sm truncate ml-2 opacity-70">
                      Available:{" "}
                      {(() => {
                        const raw = formatTokenAmount(currentStake, "USDC");

                        // Remove commas and strip token symbol
                        const numericPart = raw.replace(/,/g, "").split(" ")[0];

                        const num = Number(numericPart);
                        return isNaN(num)
                          ? "0"
                          : Math.floor(num).toLocaleString();
                      })()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 md:gap-3 ">
                    <input
                      type="number"
                      value={amountIn}
                      onChange={(e) => setAmountIn(e.target.value)}
                      placeholder="0.0"
                      className="flex-1 bg-transparent text-md md:text-2xl font-bold outline-none input-primary min-w-0 border px-2 py-1 rounded-md border-slate-400 appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <div className="flex items-center flex-shrink-0">
                      <button
                        onClick={handleMaxClickRemove}
                        className="px-2 py-1 text-xs rounded font-medium hover:bg-white/20 transition-colors whitespace-nowrap text-[var(--primary)] cursor-pointer"
                      >
                        MAX
                      </button>
                      <div
                        className="flex items-center gap-1 sm:gap-2 p-2 rounded-xl border"
                        style={{
                          backgroundColor: "rgba(131, 110, 249, 0.1)",
                          borderColor: "rgba(131, 110, 249, 0.3)",
                        }}
                      >
                        <Image
                          src={"/usdc_logo.png"}
                          width={50}
                          height={50}
                          alt="usdc"
                          className="object-cover w-7 h-6"
                        />
                        <span className="font-normal text-xs md:text-sm ">
                          USDC
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Info line */}
            <div className="flex items-center  gap-2 mt-4 text-xs md:text-sm text-[var(--text)]/70">
              <Info className="md:w-4 md:h-4 h-3 w-3 text-blue-400" />
              <span>Withdraw anytime. No lock-in.</span>
            </div>
            {/* Remove Button */}
            <button
              onClick={handleRemove}
              disabled={
                isUnstaking || isInsufficientBalanceRemove() || !amountIn
              }
              className={`w-full mt-6 py-4 rounded-xl font-bold text-md md:text-lg transition-all duration-300 flex items-center justify-center gap-2  ${
                !amountIn || isUnstaking || isInsufficientBalanceRemove()
                  ? "bg-blue-300/30  cursor-not-allowed opacity-70"
                  : "bg-[image:var(--gradient-accent-soft)]  hover:opacity-90 cursor-pointer"
              }`}
            >
              {isUnstaking ? (
                <>
                  <div className="spinner w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin" />
                  <span>Removing...</span>
                </>
              ) : isInsufficientBalanceRemove() ? (
                "Insufficient Balance"
              ) : (
                <>
                  <Droplet className="w-5 h-5" />
                  <span>Remove Liquidity</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
