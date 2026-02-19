"use client";

import type React from "react";

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
  Send,
  FileLock,
  Vote,
  CheckCircle,
  XCircle,
  Info,
  Building2,
  Bot,
  DollarSign,
  Users,
  ShieldCheck,
  Droplet,
} from "lucide-react";
import GradientText from "@/components/gradient-text";
import { Progress } from "@/components/ui/progress";

interface MenuContent {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  panel: React.ReactNode;
}
const StatCard = ({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: string;
}) => {
  return (
    <div
      className={`bg-gradient-to-br from-${accent}-500/10 to-white/5 p-5 rounded-2xl border border-white/10 flex items-center gap-4`}
    >
      <div className={`md:p-3 rounded-xl bg-${accent}-500/20`}>{icon}</div>
      <div>
        <p className="text-xl md:text-2xl font-semibold text-white">{value}</p>
        <p className="text-xs md:text-sm text-white/60">{label}</p>
      </div>
    </div>
  );
};

export default function HoverMenuCoverage() {
  const [activeContent, setActiveContent] = useState("simple");

  const menuItems: MenuContent[] = [
    {
      id: "protection",
      title: "Protection",
      description: "Submit a claim for coverage.",
      icon: <FileLock className="w-5 h-5" />,
      panel: (
        <div className="space-y-4">
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-xs md:text-sm overflow-x-auto">
            <div className="space-y-1">
              <div>
                <span className="text-blue-400">claimant:</span> "0x4E3b...aF9C"
              </div>
              <div>
                <span className="text-blue-400">coveredAddress:</span>{" "}
                "0xA1D9...7B2E"
              </div>
              <div>
                <span className="text-blue-400">tier:</span> "Jaga Pro"
              </div>
              <div>
                <span className="text-blue-400">title:</span> "Phishing Attack"
              </div>
              <div>
                <span className="text-blue-400">reason:</span> "Private keys
                exposed via malicious..."
              </div>
              <div>
                <span className="text-blue-400">claimType:</span> "Wallet
                Recovery"
              </div>
              <div>
                <span className="text-blue-400">amount:</span> 125000000n
              </div>
              <div className="text-gray-500">
                // Other fields set by contract:
              </div>
              <div className="text-gray-500">// createdAt: block.timestamp</div>
              <div className="text-gray-500">// yesVotes: 0</div>
              <div className="text-gray-500">// noVotes: 0</div>
              <div className="text-gray-500">
                // status: ClaimStatus.Pending
              </div>
              <div className="text-gray-500">// approvedAt: 0</div>
            </div>
          </div>

          <Button className="w-full bg-gray-900  cursor-pointer text-white py-6 rounded-3xl text-xs md:text-sm">
            <>
              <Send className="h-4 w-4 mr-2" />
              Submit Claim to DAO
            </>
          </Button>
        </div>
      ),
    },
    {
      id: "jagadao",
      title: "JagaDAO",
      description: "Vote on claims and shape the protocol.",
      icon: <Vote className="w-5 h-5" />,
      panel: (
        <div className="space-y-6">
          <div className="bg-[#001e3c] text-white rounded-xl p-6 shadow-lg ">
            <h3 className="text-sm md:text-lg font-semibold mb-4 flex items-center gap-2">
              <Vote className="w-5 h-5" />
              Cast Your Vote
            </h3>

            <div className="bg-blue-800/80 p-4 rounded-lg mb-4">
              <div className="text-white font-bold text-sm mb-1">
                Phishing Attack
              </div>
              <p className="text-xs md:text-sm text-blue-100 leading-snug">
                I interacted with a malicious dApp link disguised as a staking
                dashboard. It requested wallet access and triggered a hidden
                signature request. Within minutes, my funds were drained before
                I could revoke permissions.
              </p>
            </div>

            <div className="text-xs md:text-sm text-white/80 mb-3">
              <div className="flex justify-between mb-1">
                <span>Your Voting Power:</span>
                <span className="font-bold text-white">🛡️20,000 JAGA</span>
              </div>
              <div className="flex justify-between">
                <span>Time Remaining:</span>
                <span className="font-bold text-white">5 days</span>
              </div>
            </div>
            <div className="flex justify-between text-xs md:text-sm mb-3">
              <span>✅ For: {20000}</span>
              <span>❌ Against: {0}</span>
            </div>
            <Progress value={100} className="h-2 bg-white/40" />
            {/* Voting Buttons - Responsive */}
            <div className="flex flex-col sm:flex-row gap-3 mt-4 w-full">
              <button className="flex-1 bg-[image:var(--gradient-third)] hover:bg-[image:var(--gradient-third)]/50 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 cursor-pointer text-sm sm:text-base text-[var(--text)]">
                <CheckCircle className="h-4 w-4" />
                Vote For
              </button>
              <button className="flex-1 bg-[image:var(--gradient-third)] hover:bg-[image:var(--gradient-third)]/50 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 cursor-pointer text-sm sm:text-base text-[var(--text)]">
                <XCircle className="h-4 w-4" />
                Vote Against
              </button>
            </div>
            {/* Info line */}
            <div className="flex items-center gap-1 mt-4 text-xs md:text-sm text-[var(--text)]/70">
              <Info className="w-4 h-4 text-blue-500" />
              <span className="text-white/40">
                Voting power is calculated at a 1:1 ratio with your JAGA
                balance.
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "campaign",
      title: "Campaign",
      description: "Trusted by the world’s top companies and institutions.",
      icon: <Building2 className="w-5 h-5" />,
      panel: (
        <div className="space-y-4">
          <div className="bg-[#001e3c] text-white rounded-xl p-6 shadow-lg">
            {/* Header and Description */}
            <div className="text-center space-y-2">
              <h2 className="text-xl md:text-3xl font-bold">Campaign</h2>
              <p className="text-xs md:text-sm text-white/70 max-w-xl mx-auto mb-5">
                The world's most respected investors and institutions have
                chosen Jagantara as their trusted insurance partner.
              </p>
            </div>

            {/* Logo Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-3 gap-4 justify-items-center my-6">
              {[
                { name: "Binance", logo: "/campaign_logos/bnb_launchpad.png" },
                {
                  name: "Coinbase",
                  logo: "/coinbase-logo.webp",
                  hideOnMobile: true,
                },
                { name: "100+", isText: true },
              ]
                .filter(
                  (company) =>
                    !(
                      company.hideOnMobile &&
                      typeof window !== "undefined" &&
                      window.innerWidth < 640
                    )
                )
                .map((company) => (
                  <div
                    key={company.name}
                    className="bg-white/5 p-4 rounded-xl flex flex-col items-center w-full h-24 justify-center hover:bg-white/10 transition"
                  >
                    {company.isText ? (
                      <>
                        <span className="text-xl md:text-2xl font-bold text-white text-center">
                          100+
                        </span>
                        <span className="text-xs text-white/60 mt-2">More</span>
                      </>
                    ) : (
                      <img
                        src={company.logo}
                        alt={company.name}
                        className="w-full md:h-10 h-8 object-cover"
                      />
                    )}
                    {!company.isText && (
                      <span className="text-xs text-white/60 mt-1">
                        {company.name}
                      </span>
                    )}
                  </div>
                ))}
            </div>

            {/* Stat Cards */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <StatCard
                  icon={<Users className="w-6 h-6 text-blue-400" />}
                  label="Total Projects"
                  value="970+"
                  accent="blue"
                />
                <StatCard
                  icon={<DollarSign className="w-6 h-6 text-green-400" />}
                  label="Total Raised"
                  value="$14.7B+"
                  accent="green"
                />
              </div>
            </div>

            {/* Call to Action Button */}
            <button className="w-full bg-[var(--accent)] mt-6 py-4 rounded-xl font-bold text-sm md:text-lg transition-all duration-300 flex items-center justify-center gap-2 hover:opacity-90 cursor-pointer">
              <>
                <Building2 className="w-5 h-5" />
                <span>Join Our Campaign</span>
              </>
            </button>
          </div>
        </div>
      ),
    },

    {
      id: "jagabot",
      title: "Jagabot",
      description: "Ask AI about coverage, contracts, and claims.",
      icon: <Bot className="w-5 h-5" />,
      panel: (
        <div className="space-y-6">
          <div className="bg-[#001e3c] text-white rounded-xl p-6 shadow-lg">
            <h3 className="text-md md:text-lg font-semibold mb-4 flex items-center gap-2">
              <Bot className="w-5 h-5 text-purple-400" />
              Welcome to Jagantara AI Assistant
            </h3>
            <p className="text-xs md:text-sm text-white/70 mb-6">
              I can help you with web3 insurance quotes, smart contract
              analysis, and claim processing.
            </p>

            <div className="mt-6 bg-white/5 p-4 rounded-lg">
              <div className="text-white/90 font-medium mb-2">Try asking:</div>
              <ul className="list-disc list-inside text-white/60 text-xs md:text-sm space-y-1">
                <li>“Generate a quote for my NFT collection worth $5,000”</li>
                <li>“Analyze this smart contract address...”</li>
                <li>“Submit a claim for a protocol hack”</li>
              </ul>
            </div>

            <div className="mt-6">
              <input
                type="text"
                placeholder="Ask about insurance quotes, contract analysis, or submit a claim..."
                className="w-full rounded-lg px-4 py-3 bg-white/10 text-white placeholder-white/40 text-xs md:text-sm"
              />
              <button className="mt-3 w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg font-semibold text-sm md:text-md">
                Send ↗
              </button>
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
          {/* Left Panel - Dynamic Content */}
          <div className="bg-[image:var(--gradient-accent-soft)] rounded-3xl p-8  transition-all duration-300 h-full">
            <div className="h-fit">{currentContent.panel}</div>
          </div>
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
                  className="font-normal !px-0"
                >
                  Coverage
                </GradientText>
                <p className="text-[var(--text)]/70 text-xs md:text-lg">
                  Get covered and Vote the claims
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
                Get Coverage
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
                  } rounded-xl p-4`}
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
                        <p className=" text-sm">{item.description}</p>
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
        </div>
      </div>
    </div>
  );
}
