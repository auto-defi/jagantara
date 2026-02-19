import { Shield, FileCheck, Zap, TrendingUp, Lock, Unlock } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";

export default function PromotionalCards() {
  const { theme } = useTheme();
  const logoSrc = theme === "dark" ? "/mantle_white.svg" : "/mantle_logo.svg";
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mx-auto p-6">
      {/* Mantle Network - Foundation Layer */}
      <div className="group relative overflow-hidden rounded-2xl border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-purple-500/5 backdrop-blur-xl shadow-2xl transition-all duration-500 hover:shadow-blue-500/25 hover:border-blue-500/40 hover:-translate-y-2">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Floating Elements */}
        <div className="absolute top-4 right-4 w-20 h-20 bg-blue-400/10 rounded-full blur-xl group-hover:bg-blue-400/20 transition-colors duration-500" />
        <div className="absolute bottom-8 left-4 w-12 h-12 bg-purple-400/10 rounded-full blur-lg group-hover:bg-purple-400/20 transition-colors duration-500" />

        <div className="relative p-8 space-y-6">
          {/* Icon */}
          <div className="relative flex gap-2 items-center">
            <Image
              src={logoSrc} // Replace with your actual logo file
              alt="Mantle"
              width={theme === "dark" ? 35 : 35}
              height={theme === "dark" ? 35 : 35}
              className=""
            />
            <p className="font-semibold text-lg">Mantle Network</p>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <div>
              <h3 className="text-xl md:text-2xl font-bold mb-2">
                Powered by Mantle
              </h3>
              <p className="text-[var(--text)]/80 text-sm leading-relaxed">
                Built on the scalable and secure Mantle blockchain. Leverage fast
                finality, low fees, and Mantle's developer-friendly tools to build
                seamless DeFi experiences.
              </p>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span className=" font-semibold md:text-sm text-xs">
                  Blazing Speed
                </span>
              </div>
              <div className="h-4 w-px bg-[var(--text)]" />
              <span className="text-[var(--text)]/70 md:text-sm text-xs">
                dApp Ready
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* JagaDAO - Insurance Claims */}
      <div className="group relative overflow-hidden rounded-2xl  border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-purple-500/5 backdrop-blur-xl shadow-2xl transition-all duration-500 hover:shadow-blue-500/25 hover:border-blue-500/40 hover:-translate-y-2">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Floating Elements */}
        <div className="absolute top-4 right-4 w-20 h-20 bg-blue-400/10 rounded-full blur-xl group-hover:bg-blue-400/20 transition-colors duration-500" />
        <div className="absolute bottom-8 left-4 w-12 h-12 bg-purple-400/10 rounded-full blur-lg group-hover:bg-purple-400/20 transition-colors duration-500" />

        <div className="relative p-8 space-y-6">
          {/* Icon */}
          <div className="relative">
            <div className="relative  flex gap-2 items-center">
              <p className="text-2xl">🏛️</p>{" "}
              <p className="font-semibold text-lg">JagaDAO</p>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <div>
              <h3 className="text-xl md:text-2xl font-bold  mb-2">
                Seamless Claims
              </h3>
              <p className="text-[var(--text)]/80 text-sm leading-relaxed">
                Experience hassle-free insurance with JagaDAO. Quick claims
                processing, transparent coverage, and decentralized protection.
              </p>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-blue-600" />
                <span className=" font-semibold md:text-sm text-xs">
                  24h Claims
                </span>
              </div>
              <div className="h-4 w-px bg-[var(--text)]" />
              <span className="text-[var(--text)]/70 md:text-sm text-xs">
                100% Transparent
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* Morpho - Defend Against Inflation */}
      <div className="group relative overflow-hidden rounded-2xl  border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-purple-500/5 backdrop-blur-xl shadow-2xl transition-all duration-500 hover:shadow-blue-500/25 hover:border-blue-500/40 hover:-translate-y-2">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Floating Elements */}
        <div className="absolute top-4 right-4 w-20 h-20 bg-blue-400/10 rounded-full blur-xl group-hover:bg-blue-400/20 transition-colors duration-500" />
        <div className="absolute bottom-8 left-4 w-12 h-12 bg-purple-400/10 rounded-full blur-lg group-hover:bg-purple-400/20 transition-colors duration-500" />

        <div className="relative p-8 space-y-6">
          {/* Icon */}
          <div className="relative">
            <div className="relative  flex gap-2 items-center">
              <Image
                src="/morpho_logo.png"
                alt="Morpho"
                width={35}
                height={30}
                className="relative z-10"
              />
              <p className="font-semibold text-lg">Morpho</p>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <div>
              <h3 className="text-xl md:text-2xl font-bold mb-2">
                Hedge Inflation
              </h3>
              <p className="text-[var(--text)]/80 text-sm leading-relaxed">
                Protect your wealth with Morpho's high-yield vaults. Earn
                sustainable returns that outpace inflation and preserve your
                purchasing power.
              </p>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-600 font-semibold md:text-sm text-xs">
                  4.45%+ APY
                </span>
              </div>
              <div className="h-4 w-px bg-[var(--text)]" />
              <span className="text-[var(--text)]/70 text-xs md:text-sm">
                Beat Inflation
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Synthetix Model - Flexibility */}
      <div className="group relative overflow-hidden rounded-2xl  border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-purple-500/5 backdrop-blur-xl shadow-2xl transition-all duration-500 hover:shadow-blue-500/25 hover:border-blue-500/40 hover:-translate-y-2">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Floating Elements */}
        <div className="absolute top-4 right-4 w-20 h-20 bg-blue-400/10 rounded-full blur-xl group-hover:bg-blue-400/20 transition-colors duration-500" />
        <div className="absolute bottom-8 left-4 w-12 h-12 bg-purple-400/10 rounded-full blur-lg group-hover:bg-purple-400/20 transition-colors duration-500" />

        <div className="relative p-8 space-y-6">
          {/* Icon */}
          <div className="relative">
            <div className="relative  flex gap-2 items-center">
              <Image
                src="/landing_logo/synthetix-snx-logo.png"
                alt="Morpho"
                width={35}
                height={30}
                className="relative z-10"
              />
              <p className="font-semibold text-lg">Synthetix Model</p>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <div>
              <h3 className="text-xl md:text-2xl font-bold mb-2">
                Ultimate Flexibility
              </h3>
              <p className="text-[var(--text)]/80 text-sm leading-relaxed">
                Powered by Synthetix model algorithms. Stake and unstake anytime
                with no lock-up periods. Distibute claim rewards per second.
              </p>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <Unlock className="w-3 h-3 " />
                </div>
                <span className=" font-semibold md:text-sm text-xs">
                  No Lock-up
                </span>
              </div>
              <div className="h-4 w-px bg-[var(--text)]" />
              <span className="text-[var(--text)]/70 md:text-sm text-xs">
                Instant Access
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
