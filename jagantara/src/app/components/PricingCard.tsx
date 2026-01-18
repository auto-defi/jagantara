"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Check,
  Shield,
  Star,
  Crown,
  Building2,
  ArrowRight,
} from "lucide-react";
const tiers = [
  {
    id: "lite",
    name: "Lite",
    icon: Shield,
    rate: 0.001,
    bestFor: "Students, first-time Web3 users",
    claimCap: "$5,000",
    startingPrice: 65,
    assetValue: "<$5k",
    durations: [1, 3, 6, 12],
    coverage: ["Failed Token Swaps", "Phishing Scam Reimbursement"],
    color: "bg-blue-50 border-blue-200",
    iconColor: "text-blue-600",
  },
  {
    id: "shield",
    name: "Shield",
    icon: Star,
    rate: 0.003,
    bestFor: "NFT collectors, DAO voters, casual DeFi",
    claimCap: "$15,000",
    startingPrice: 145,
    assetValue: "$5k–15k",
    durations: [1, 3, 6, 12],
    coverage: [
      "All Lite coverage",
      "NFT Theft Coverage",
      "Wallet Recovery Assistance",
    ],
    color: "bg-yellow-50 border-yellow-200",
    iconColor: "text-yellow-500",
    popular: true,
  },
  {
    id: "max",
    name: "Max",
    icon: Crown,
    rate: 0.005,
    bestFor: "Active investors, DeFi builders",
    claimCap: "$50,000",
    startingPrice: 205,
    assetValue: "$15k–25k",
    durations: [3, 6, 12],
    coverage: ["All Shield coverage", "Rug Pull Protection"],
    color: "bg-amber-50 border-amber-200",
    iconColor: "text-amber-600",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    icon: Building2,
    rate: null,
    bestFor: "DAOs, protocols, high-net-worth users",
    claimCap: "$100,000+",
    startingPrice: 295,
    assetValue: "Custom",
    durations: [3, 6, 12],
    coverage: [
      "All Max coverage",
      "Exchange / Custodial Insolvency",
      "Major Smart Contract Failures",
    ],
    color: "bg-emerald-50 border-emerald-200",
    iconColor: "text-emerald-600",
    custom: true,
  },
];
export default function PricingCard() {
  return (
    <div>
      <section className=" py-10 w-full max-w-6xl mx-auto px-4 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Tier Selection */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tiers.map((tier) => {
              const Icon = tier.icon;
              return (
                <Card
                  key={tier.id}
                  className={`bg-[image:var(--gradient-third)] relative transition-all duration-200 hover:shadow-lg border-none `}
                  // onClick={() => setSelectedTier(tier.id)}
                >
                  {tier.popular && (
                    <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-blue-600 text-xs text-white">
                      🔥Popular
                    </Badge>
                  )}
                  <CardHeader className="">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full bg-white flex items-center justify-center`}
                      >
                        <Icon className={`w-5 h-5 ${tier.iconColor}`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{tier.name}</CardTitle>
                        <div className="text-lg font-bold ">
                          {tier.custom
                            ? "Custom"
                            : `${(tier.rate! * 100).toFixed(1)}% of cap`}
                          <span className="text-sm font-normal "> / mo</span>
                        </div>
                      </div>
                    </div>
                    <CardDescription className="text-sm">
                      🎯 {tier.bestFor}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col justify-between h-full space-y-3">
                    <div className="space-y-3">
                      <div className="bg-[var(--background)]/70  rounded-lg p-4 space-y-3 ">
                        {/* <div className="flex justify-between text-sm">
                          <span className=" flex items-center gap-1">
                            💰 <span>Claim Cap:</span>
                          </span>
                          <span className="font-bold ">{tier.claimCap}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className=" flex items-center gap-1">
                            📊 <span>Asset Value:</span>
                          </span>
                          <span className="font-bold ">{tier.assetValue}</span>
                        </div> */}
                        <div className="space-y-1">
                          <h4 className="font-semibold text-sm  flex items-center gap-1">
                            🛡️ Coverage Includes:
                          </h4>
                          {tier.coverage.slice(0, 3).map((item, index) => (
                            <div
                              key={index}
                              className="flex items-center text-xs"
                            >
                              <Check className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                              <span>{item}</span>
                            </div>
                          ))}
                          {tier.coverage.length > 3 && (
                            <div className="text-xs  ml-5">
                              ✨ +{tier.coverage.length - 3} more features
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-auto space-y-2">
                      <Button
                        className={`w-full bg-[var(--background)]/70 cursor-pointer font-semibold py-3 rounded-lg transition-all duration-200 hover:shadow-lg transform hover:scale-105 flex items-center justify-center gap-2`}
                        onClick={() => {
                          window.open("/coverage", "_blank");
                        }}
                      >
                        {tier.custom ? (
                          <>
                            💬 Contact Sales
                            <ArrowRight className="w-4 h-4" />
                          </>
                        ) : (
                          <>
                            🚀 Get Started
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </Button>

                      <p className="text-xs  text-center">
                        ⚡ Instant activation • 🔄 Cancel anytime
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
      {/* Additional Info */}
      <div className="text-center space-y-4 pb-20">
        <div className="flex flex-wrap justify-center gap-6 text-sm ">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-500" />
            <span>30-day money-back guarantee</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-500" />
            <span>24/7 claim processing</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-500" />
            <span>No hidden fees</span>
          </div>
        </div>
        <p className="text-sm text-gray-500 max-w-2xl mx-auto">
          All plans include basic smart contract protection and community
          governance participation. Enterprise customers get custom terms and
          dedicated support.
        </p>
      </div>
    </div>
  );
}
