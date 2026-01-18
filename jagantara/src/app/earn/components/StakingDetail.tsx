"use client";
import Image from "next/image";
import { useAccount } from "wagmi";
import ConnectWallet from "@/app/components/ConnectWallet";
import { useState } from "react";
import { TrendingUp, Droplets, BarChart3, History } from "lucide-react";
import AnalyticInterface from "./AnalyticInterface";
import DepositInterface from "./DepositInterface";
import VaultStats from "./VaultStats";
import TransactionHistory from "./TransactionHistory";
import EarnInterface from "./EarnInterface";
export default function StakingDetail() {
  const { isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState<
    "deposit" | "earn" | "analytics" | "history"
  >("deposit");
  const TabButton = ({
    id,
    icon,
    label,
    description,
  }: {
    id: typeof activeTab;
    icon: React.ReactNode;
    label: string;
    description: string;
  }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center space-x-3 p-4 rounded-xl transition-all duration-300 w-full text-left cursor-pointer ${
        activeTab === id
          ? "bg-[image:var(--gradient-accent-soft)] glow-blue"
          : "bg-white/30 dark:bg-white/5 backdrop-blur-sm hover:bg-white/40 dark:hover:bg-white/10 shadow-xl"
      }`}
      style={{
        color: activeTab === id ? "#FBFAF9" : "rgba(251, 250, 249, 0.8)",
        border:
          activeTab === id
            ? "1px solid rgba(131, 110, 249, 0.5)"
            : "1px solid rgba(251, 250, 249, 0.1)",
      }}
    >
      <div className="flex-shrink-0 text-[var(--text)] md:text-lg text-sm">
        {icon}
      </div>
      <div>
        <div className="font-semibold text-[var(--text)] md:text-lg text-sm">
          {label}
        </div>
        <div className=" opacity-80 text-[var(--text)] md:text-md text-xs">
          {description}
        </div>
      </div>
    </button>
  );
  return (
    <div className="">
      {isConnected ? (
        <div className="container mx-auto px-6 w-full md:max-w-7xl">
          {/* Navigation Tabs */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <TabButton
              id="deposit"
              icon={<TrendingUp className="w-6 h-6" />}
              label="Deposit"
              description="Deposit $USDC to Stake"
            />
            <TabButton
              id="earn"
              icon={<Droplets className="w-6 h-6" />}
              label="Earn"
              description="Claim stake rewards"
            />
            <TabButton
              id="analytics"
              icon={<BarChart3 className="w-6 h-6" />}
              label="Analytics"
              description="Staking stats and charts"
            />
            <TabButton
              id="history"
              icon={<History className="w-6 h-6" />}
              label="History"
              description="Transaction history"
            />
          </div>

          {/* Tab Content */}
          <div className="space-y-8">
            {activeTab === "deposit" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <DepositInterface />
                <div className="space-y-8">
                  <VaultStats />
                </div>
              </div>
            )}

            {activeTab === "earn" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <EarnInterface />
                <div className="space-y-8">
                  <VaultStats />
                </div>
              </div>
            )}

            {activeTab === "analytics" && <AnalyticInterface />}

            {activeTab === "history" && <TransactionHistory />}
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center text-center  space-y-6  h-[60vh]">
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
            To access your staking dashboard, please connect your wallet
            securely.
          </p>
          <ConnectWallet />
        </div>
      )}
    </div>
  );
}
