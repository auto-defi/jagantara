"use client";

import type React from "react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Plus,
  TrendingUp,
  Shield,
  Zap,
  Target,
  ArrowUpRight,
  Info,
  Droplet,
  Landmark,
  Hourglass,
  Network,
} from "lucide-react";

interface MenuContent {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  panel: React.ReactNode;
}
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import GradientText from "@/components/gradient-text";
import { useTheme } from "next-themes";
import { FaUser } from "react-icons/fa6";

const data = [
  { date: "11/23", value: 2.2 },
  { date: "12/23", value: 3.1 },
  { date: "01/24", value: 4.2 },
  { date: "02/24", value: 5.5 },
  { date: "03/24", value: 6.4 },
  { date: "04/24", value: 7.6 },
  { date: "05/24", value: 8.8 },
  { date: "06/24", value: 9.6 },
  { date: "07/24", value: 10.0 },
  { date: "09/24", value: 10.25 },
];
export default function HoverMenuEarn() {
  const [activeContent, setActiveContent] = useState("simple");
  const { theme } = useTheme();
  const menuItems: MenuContent[] = [
    {
      id: "simple",
      title: "Simple",
      description: "Deposit and start earning.",
      icon: <Zap className="w-5 h-5" />,
      panel: (
        <div className="space-y-6">
          <div className="bg-[var(--background)]/30 rounded-xl p-6 shadow-lg">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm text-[var(--text)]/70">
                My Position (USDC)
              </span>
              <Shield className="w-5 h-5 text-blue-400" />
            </div>

            {/* Position Amount */}
            <div className="text-xl md:text-4xl font-semibold mb-4">
              5,000,000 USDC
            </div>

            {/* Stats */}
            <div className="">
              <div className="flex justify-between pb-2">
                <span className="text-[var(--text)] text-sm md:text-md">
                  Earn APY
                </span>
                <span className="text-sm md:text-lg font-semibold text-green-600">
                  15.00% ✨
                </span>
              </div>
              <div className="flex justify-between pb-2 ">
                <span className="text-[var(--text)] text-sm md:text-md">
                  Jaga Token
                </span>
                <span className="text-sm md:text-lg font-semibold ">
                  🛡️5M JAGA
                </span>
              </div>
              <div className="flex justify-between pt-2 pb-2">
                <span className="text-[var(--text)] text-sm md:text-md">
                  Projected Earnings / Month (USD)
                </span>
                <span className="font-semibold text-sm md:text-md">
                  $62,500.00
                </span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-[var(--text)] text-sm md:text-md">
                  Projected Earnings / Year (USD)
                </span>
                <span className="font-semibold text-sm md:text-md">
                  $750,000.00
                </span>
              </div>
            </div>

            {/* Disabled Claim Button */}
            <button className="w-full bg-[var(--accent)] mt-4 md:mt-6 py-4 rounded-xl font-bold text-sm md:text-lg transition-all duration-300 flex items-center justify-center gap-2  hover:opacity-90 cursor-pointer ">
              <>
                <Droplet className="md:w-5 md:h-5 w-4 h-4" />
                <span>Claim Rewards</span>
              </>
            </button>

            {/* Info line */}

            <div className="flex items-center gap-1 mt-4 text-xs md:text-sm text-[var(--text)]/70">
              <Info className="w-4 h-4 text-blue-400" />
              <span>
                Earn 1:1 JAGA tokens and participate in governance via JagaDAO.
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "optimized",
      title: "Optimized",
      description: "Advanced strategies for maximum yield.",
      icon: <TrendingUp className="w-5 h-5" />,
      panel: (
        <div className="space-y-6">
          <div className="bg-[var(--background)]/30 rounded-xl p-6 shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between ">
              <span className=" text-sm">My Deposits</span>
              <div className="text-right">
                <div className=" text-xs">All-time</div>
                <div className="text-blue-600 text-xs md:text-sm font-semibold">
                  8.55%
                </div>
              </div>
            </div>

            {/* Total Deposits */}
            <div className="text-xl md:text-4xl font-bold  mb-4">
              $10.25M{" "}
              <span className="text-xs md:text-sm text-blue-600 align-top ml-2">
                +22.25%
              </span>
            </div>

            {/* Recharts Line Chart */}
            <div className="bg-[var(--background)]/50 rounded-xl p-3 sm:p-4 h-60 sm:h-64 w-full overflow-hidden">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={data}
                  margin={{ top: 10, right: 10, bottom: 10, left: 0 }} // optimized spacing for mobile
                >
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10, fill: "var(--text)" }}
                    axisLine={false}
                    tickLine={false}
                    interval="preserveStartEnd"
                    tickMargin={6}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "none",
                    }}
                    labelStyle={{ color: "#cbd5e1" }}
                    itemStyle={{ color: "#3b82f6" }}
                    formatter={(value) => [
                      `$${Number(value).toFixed(2)}M`,
                      "Deposits",
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{
                      r: 3,
                      stroke: "#3b82f6",
                      strokeWidth: 2,
                      fill: "var(--text)",
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Earnings Info */}
            <div className="mt-6">
              <div className="space-y-2 text-sm ">
                <div className="flex justify-between items-center text-sm md:text-md">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-blue-600" />
                    <span>Vault APY</span>
                  </div>
                  <span>6.55%</span>
                </div>
                <div className="flex justify-between items-center  ">
                  <div className="flex items-center space-x-2 ">
                    <div className="w-2 h-2 rounded-full bg-blue-600" />
                    <span>MORPHO</span>
                  </div>
                  <span>2.00%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "protocolOverview",
      title: "Protocol Overview",
      description: "Key details about the staking infrastructure.",
      icon: <Landmark className="w-5 h-5" />,
      panel: (
        <div className="space-y-6">
          {/* Header */}
          <h2 className="text-lg font-semibold ">Network Details</h2>

          {/* 3 Protocol Cards */}
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            {/* Card 1: Batch Duration */}
            <div className="flex-1 glass rounded-xl p-5  bg-[var(--background)]/30 text-center shadow-md hover:shadow-lg transition">
              <div className="mb-1 flex justify-center">
                <Image
                  src="/morpho_logo2.png"
                  alt="mantle"
                  width={40}
                  height={40}
                />
              </div>
              <div className="text-xs md:text-sm font-semibold ">Hedge</div>
              <div className="text-lg md:text-2xl font-bold ">Morpho</div>
              <div className="text-xs md:text-sm text-[var(--text)]/70">
                Value Preservation
              </div>
            </div>

            {/* Card 2: Governance */}
            <div className="flex-1 glass rounded-xl p-5  bg-[var(--background)]/30 text-center shadow-md hover:shadow-lg transition">
              <div className="text-3xl mb-2">🏦</div>
              <div className="text-xs md:text-sm font-semibold ">
                Governance
              </div>
              <div className="text-lg md:text-2xl font-bold ">JagaDAO</div>
              <div className="text-xs md:text-sm text-[var(--text)]/70">
                Community Staking
              </div>
            </div>

            {/* Card 3: Network */}
            <div className="flex-1 glass rounded-xl p-5  bg-[var(--background)]/30 text-center shadow-md hover:shadow-lg transition">
              <div className="mb-2 flex justify-center">
                {theme === "dark" ? (
                  <Image
                    src="/mantle_white.svg"
                    alt="mantle"
                    width={75}
                    height={75}
                  />
                ) : (
                  <Image
                    src="/mantle_logo.svg"
                    alt="mantle"
                    width={40}
                    height={40}
                  />
                )}
              </div>
              <div className="text-xs md:text-sm font-semibold ">Network</div>
              <div className="text-lg md:text-2xl font-bold ">Mantle</div>
              <div className="text-xs md:text-sm text-[var(--text)]/70">
                Testnet
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            {/* Card 1: Total Value Locked */}
            <div className="flex-1 bg-[var(--background)]/30 rounded-xl p-5 text-center space-y-2 shadow-md hover:shadow-lg transition">
              <div className="flex justify-center text-green-600 text-xl">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xs md:text-sm font-semibold">
                Total Value Locked
              </h3>
              <p className="text-lg md:text-xl font-bold ">$101.67M</p>
              <p className="text-[var(--text)]/70 text-xs">
                Assets locked across strategies
              </p>
            </div>

            {/* Card 2: DAO Members */}
            <div className="flex-1 bg-[var(--background)]/30 rounded-xl p-5 text-center space-y-2 shadow-md hover:shadow-lg transition">
              <div className="flex justify-center text-blue-400 text-xl">
                <FaUser className="w-6 h-6" />
              </div>
              <h3 className="text-xs md:text-sm font-semibold">DAO Members</h3>
              <p className="text-lg md:text-xl font-bold ">1,482</p>
              <p className="text-[var(--text)]/70 text-xs">
                Actively participating in JagaDAO
              </p>
            </div>
          </div>
        </div>
      ),
    },

    {
      id: "non-custodial",
      title: "Non-custodial",
      description: "Keep full control of your assets.",
      icon: <Shield className="w-5 h-5" />,
      panel: (
        <div className="space-y-6">
          <div className="bg-[var(--background)]/30 rounded-xl p-4 md:p-6">
            <h3 className="text-md md:text-xl font-bold  mb-4">
              🗝️ Your Keys, Your Crypto
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-blue-800/20 rounded-lg ">
                <Shield className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="text-blue-600 font-semibold md:text-lg text-sm">
                    Wallet Connected
                  </div>
                  <div className="text-xs md:text-sm">0x1234...5678</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between md:text-lg text-sm">
                  <span className="">Available Balance</span>
                  <span className="">2,500,000 USDC</span>
                </div>
                <div className="flex justify-between md:text-lg text-sm">
                  <span className="">Staked Amount</span>
                  <span className="">1,000,000 USDC</span>
                </div>
                <div className="flex justify-between md:text-lg text-sm">
                  <span className="">Rewards Earned</span>
                  <span className="text-green-600">+45,230 USDC</span>
                </div>
              </div>
            </div>
            {/* Disabled Claim Button */}
            <button className="w-full bg-[var(--accent)] mt-4 md:mt-6 py-4 rounded-xl font-bold text-sm md:text-lg transition-all duration-300 flex items-center justify-center gap-2  hover:opacity-90 cursor-pointer ">
              <>
                <Droplet className="md:w-5 md:h-5 w-4 h-4" />
                <span>Remove Liquidity</span>
              </>
            </button>

            {/* Info line */}
            <div className="flex items-center  gap-1 mt-4 text-xs md:text-sm text-[var(--text)]/70">
              <Info className="md:w-4 md:h-4 h-3 w-3 text-blue-400" />
              <span>Withdraw anytime. No lock-in.</span>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const currentContent =
    menuItems.find((item) => item.id === activeContent) || menuItems[0];

  return (
    <div className="rounded-3xl bg-[image:var(--gradient-secondary)] md:p-8 ">
      <div className="w-full mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 ">
          {/* Left Panel - Menu */}
          <div className="space-y-8 px-4 pt-4 md:p-0">
            <div className="flex items-baseline justify-between mb-6">
              <div>
                <GradientText
                  colors={[
                    "var(--primary)",
                    "var(--accent)",
                    "var(--primary)",
                    "var(--accent)",
                  ]}
                  animationSpeed={6}
                  showBorder={false}
                  className="font-normal !px-0 "
                >
                  Earn
                </GradientText>
                <p className="text-[var(--text)]/70 text-xs md:text-lg">
                  Make your USDC work for you
                </p>
              </div>
              <Button
                size="lg"
                style={{
                  background: "var(--gradient-primary)",
                  color: "white",
                }}
                className="group hover:opacity-90 cursor-pointer glow-blue relative overflow-hidden pr-10 rounded-3xl text-center font-semibold transition-all duration-300"
                onClick={() => window.open("/earn", "_blank")} // 👈 open in new tab
              >
                Earn
                <ArrowUpRight className="ml-1 h-4 w-4 arrow-animate-out transition-all duration-300 group-hover:arrow-out" />
                <ArrowUpRight className="h-4 w-4 absolute right-3 top-1/2 -translate-y-1/2 opacity-0 arrow-animate-in transition-all duration-300 group-hover:arrow-in" />
              </Button>
            </div>

            <div className="space-y-4">
              {menuItems.map((item) => (
                <div
                  key={item.id}
                  className={`group cursor-pointer transition-all duration-200 ${
                    activeContent === item.id
                      ? "bg-[image:var(--gradient-accent-soft)]"
                      : "hover:bg-[var(--primary)]/20"
                  } rounded-xl md:p-4 p-3`}
                  onClick={() => {
                    if (window.innerWidth < 768) {
                      setActiveContent(item.id);
                    }
                  }}
                  onMouseEnter={() => {
                    if (window.innerWidth >= 768) {
                      setActiveContent(item.id);
                    }
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`p-2 rounded-lg ${
                          activeContent === item.id
                            ? ""
                            : "bg-[var(--background)]/70"
                        } transition-colors`}
                      >
                        {item.icon}
                      </div>
                      <div>
                        <h3 className=" font-semibold">{item.title}</h3>
                        <p className=" text-xs md:text-sm ">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    <Plus
                      className={`w-5 h-5 transition-transform ${
                        activeContent === item.id
                          ? "rotate-45 "
                          : "text-gray-500"
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel - Dynamic Content */}
          <div className="bg-[image:var(--gradient-accent-soft)] rounded-3xl p-8  transition-all duration-300 h-full">
            <div className="">{currentContent.panel}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
