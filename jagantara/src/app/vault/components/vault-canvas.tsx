"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Wallet } from "lucide-react";
import CountUp from "@/components/countup";
import GradientText from "@/components/gradient-text";
import { useRouter } from "next/navigation";
import { useClaimManager } from "@/hooks/useClaimManager";
import { useMorphoReinvest } from "@/hooks/useMorphoReinvest";
export default function Component() {
  const { formattedVaultBalance } = useClaimManager();
  const [activeStep, setActiveStep] = useState(1);
  const { scrollYProgress } = useScroll();
  const router = useRouter();
  const { totalReinvested } = useMorphoReinvest();
  // Transform scroll progress to step changes
  const step = useTransform(scrollYProgress, [0, 0.33, 0.66, 1], [1, 2, 3, 3]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  useEffect(() => {
    if (!isMobile) {
      const unsubscribe = step.onChange((latest) => {
        setActiveStep(Math.round(latest));
      });
      return unsubscribe;
    }
  }, [step, isMobile]);

  const renderCanvas = () => {
    switch (activeStep) {
      case 1:
        return <Step1Canvas />;
      case 2:
        return <Step2Canvas />;
      case 3:
        return <Step3Canvas />;
      default:
        return <Step1Canvas />;
    }
  };

  return (
    <div className=" ">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Content - Sticky */}
          <div className="lg:sticky lg:top-16 lg:h-fit lg:flex lg:flex-col lg:justify-center p-8">
            <div className="space-y-6 mt-3">
              <div className="flex flex-col md:flex-row justify-between items- md:items-end gap-4">
                <GradientText
                  colors={[
                    "var(--primary)",
                    "var(--accent)",
                    "var(--primary)",
                    "var(--accent)",
                  ]}
                  animationSpeed={6}
                  showBorder={false}
                  className="font-semibold !pb-0"
                >
                  How it Works
                </GradientText>
                <Button
                  size="lg"
                  style={{
                    background: "var(--gradient-primary)",
                    color: "white",
                  }}
                  className="group hover:opacity-90 cursor-pointer glow-blue relative overflow-hidden pr-10"
                  onClick={() => router.push("/earn")} // 👈 open in new tab
                >
                  Deposit Now
                  <ArrowUpRight className="ml-2 h-4 w-4 arrow-animate-out transition-all duration-300 group-hover:arrow-out" />
                  <ArrowUpRight className="h-4 w-4 absolute right-3 top-1/2 -translate-y-1/2 opacity-0 arrow-animate-in transition-all duration-300 group-hover:arrow-in" />
                </Button>
              </div>

              <div className="space-y-8">
                <motion.div
                  className="space-y-4"
                  animate={{
                    opacity: activeStep === 1 ? 1 : 0.5,
                  }}
                >
                  <div className="flex items-start gap-4">
                    <span
                      className={`text-xl md:text-2xl font-bold ${activeStep === 1 ? "text-blue-400" : "text-gray-500"}`}
                    >
                      01
                    </span>
                    <div>
                      <h3
                        onClick={() => isMobile && setActiveStep(1)}
                        className={`text-lg md:text-xl font-semibold mb-3 ${activeStep === 1 ? "" : "text-gray-400"} cursor-pointer`}
                      >
                        Deposit in Jagantara Vault
                      </h3>
                      {activeStep === 1 && (
                        <p className="leading-relaxed text-md">
                          Earn yield by depositing <strong>$USDC</strong> into
                          the Jagantara Vault. In return, you’ll receive{" "}
                          <strong>$JAGA</strong> tokens, which grant governance
                          rights within the JagaDAO. Stakers are entitled to 30%
                          of platform revenue, aligning rewards with platform
                          growth.
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="space-y-4"
                  animate={{
                    opacity: activeStep === 2 ? 1 : 0.5,
                  }}
                >
                  <div className="flex items-start gap-4">
                    <span
                      className={`text-xl md:text-2xl font-bold ${activeStep === 2 ? "text-blue-400" : "text-gray-500"}`}
                    >
                      02
                    </span>
                    <div>
                      <h3
                        onClick={() => isMobile && setActiveStep(2)}
                        className={`text-lg md:text-xl font-semibold mb-3 ${activeStep === 2 ? "" : "text-gray-400"} cursor-pointer`}
                      >
                        Revenue Allocated via Insurance Manager
                      </h3>
                      {activeStep === 2 && (
                        <p className="leading-relaxed">
                          Premiums collected from policyholders are managed by
                          the Insurance Manager, a smart contract that
                          systematically allocates the funds across four key
                          streams: 20% to the company, 30% to stakers, 25%
                          reinvested into the vault, and 25% held in the main
                          vault to maintain liquidity.
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="space-y-4"
                  animate={{
                    opacity: activeStep === 3 ? 1 : 0.5,
                  }}
                >
                  <div className="flex items-start gap-4">
                    <span
                      className={`text-xl md:text-2xl font-bold ${activeStep === 3 ? "text-blue-400" : "text-gray-500"}`}
                    >
                      03
                    </span>
                    <div>
                      <h3
                        onClick={() => isMobile && setActiveStep(3)}
                        className={`text-lg md:text-xl font-semibold mb-3 ${activeStep === 3 ? "" : "text-gray-400"} cursor-pointer`}
                      >
                        Earn yield from Policyholders
                      </h3>
                      {activeStep === 3 && (
                        <p className="leading-relaxed">
                          To obtain coverage, users are required to purchase a
                          premium using <strong>$USDC</strong>. The collected
                          funds are managed by the Insurance Manager, a
                          dedicated smart contract. As the number of
                          policyholders increases, so does the potential yield
                          for participants.
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:gap-6 ">
                <div className="flex flex-col justify-between p-4 rounded-2xl shadow-md  bg-[image:var(--gradient-primary)] text-white">
                  <p className="text-sm font-normal opacity-70">
                    Total Value Locked
                  </p>
                  <span className="text-3xl md:text-4xl font-normal tracking-tight">
                    $
                    <CountUp
                      from={0}
                      to={Number(formattedVaultBalance)}
                      separator=","
                      duration={1}
                    />
                  </span>
                </div>
                <div className="flex flex-col justify-between p-4 rounded-2xl shadow-md bg-gradient-to-br from-[#002747] to-[#050208] text-white">
                  <p className="text-sm font-normal opacity-70">
                    Total Wallet Protected
                  </p>
                  <span className="text-3xl md:text-4xl font-normal tracking-tight flex gap-1 items-end">
                    <Wallet size={30} />
                    <CountUp from={0} to={100000} separator="," duration={1} />
                  </span>
                </div>
              </div>
              <div className="glass rounded-xl p-4 sm:p-6 border border-white/10 bg-[var(--secondary)] mt-5">
                <div className="grid grid-cols-2 sm:flex sm:items-center sm:justify-between gap-4 sm:gap-6">
                  {/* Morpho Vault (Left Top) */}
                  <div className="flex items-center gap-3 col-span-1">
                    <div className="relative">
                      <div className="absolute inset-0 bg-[var(--background)]/20 rounded-full blur-sm" />
                      <div className="relative bg-[var(--background)]/10 rounded-full p-2 backdrop-blur-sm">
                        <Image
                          src="/morpho_logo.png"
                          alt="Morpho"
                          width={20}
                          height={20}
                          className="relative z-10"
                        />
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold text-sm sm:text-base">
                        Morpho Vault
                      </p>
                      <p className="text-[var(--text)]/50 text-xs sm:text-sm">
                        DeFi Protocol
                      </p>
                    </div>
                  </div>

                  {/* APY (Right Top) */}
                  <div className="text-right col-span-1">
                    <p className="text-[var(--text)]/50 text-xs font-medium uppercase tracking-wider">
                      APY
                    </p>
                    <div className="flex justify-end items-baseline gap-1">
                      <span className="text-emerald-600 text-lg sm:text-xl font-bold">
                        4.45
                      </span>
                      <span className="text-sm">%</span>
                    </div>
                  </div>

                  {/* Total Deposits (Left Bottom) */}
                  <div className="text-left sm:text-center col-span-1">
                    <p className="text-[var(--text)]/50 text-xs font-medium uppercase tracking-wider">
                      Total Deposits
                    </p>
                    <p className="font-bold text-base sm:text-lg">
                      {Math.round(
                        Number(totalReinvested) / 1e6
                      ).toLocaleString() + " USDC"}
                    </p>
                  </div>

                  {/* Collateral (Right Bottom) */}
                  <div className="text-right sm:text-center col-span-1">
                    <p className="text-[var(--text)]/50 text-xs font-medium uppercase tracking-wider">
                      Collateral
                    </p>
                    <p className="font-bold text-base sm:text-lg flex items-center">
                      <Image
                        src={"/usdc_logo.png"}
                        width={50}
                        height={50}
                        alt="usdc"
                        className="object-cover w-7 h-6"
                      />
                      USDC
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Canvas - Changes based on scroll */}
          <div className="min-h-[100vh] md:min-h-[200vh] flex items-start justify-center pt-20">
            <div className="sticky top-30">{renderCanvas()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Step 1 Canvas Component
function Step1Canvas() {
  return (
    <svg
      width="400"
      height="600"
      viewBox="0 0 400 600"
      className="w-full max-w-md"
    >
      <defs>
        <radialGradient id="lenderGradient" cx="0.3" cy="0.3" r="0.8">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="50%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1e40af" />
        </radialGradient>
        <radialGradient id="lenderGradient2" cx="0.3" cy="0.3" r="0.8">
          <stop offset="0%" stopColor="#93c5fd" />
          <stop offset="50%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#2563eb" />
        </radialGradient>
        <linearGradient id="wethGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="50%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1e40af" />
        </linearGradient>
        <linearGradient id="vaultGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#93c5fd" />
          <stop offset="30%" stopColor="#60a5fa" />
          <stop offset="70%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1e40af" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="yieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="50%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <filter id="yieldglow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <motion.g
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <text
          x="200"
          y="25"
          textAnchor="middle"
          className="fill-[var(--text)] text-sm font-medium"
        >
          Staker
        </text>
        <ellipse
          cx="200"
          cy="55"
          rx="25"
          ry="20"
          fill="url(#lenderGradient)"
          filter="url(#glow)"
        />
        <ellipse
          cx="200"
          cy="100"
          rx="30"
          ry="30"
          fill="url(#lenderGradient2)"
          filter="url(#glow)"
        />
        {/* DOWN ARROW - moved left to x=170 */}
        <line
          x1="170"
          y1="130"
          x2="170"
          y2="170"
          stroke="#60a5fa"
          strokeWidth="2"
          strokeDasharray="4,4"
        />
        <polygon points="165,165 170,175 175,165" fill="#60a5fa" />

        {/* UP ARROW - placed at x=230 and made green */}
        <line
          x1="230"
          y1="170"
          x2="230"
          y2="130"
          stroke="#34d399"
          strokeWidth="2"
          strokeDasharray="4,4"
        />
        <polygon points="225,135 230,125 235,135" fill="#34d399" />

        {/* Token Circle */}
        <ellipse
          cx="170"
          cy="200"
          rx="25"
          ry="25"
          fill="url(#wethGradient)"
          filter="url(#glow)"
        />
        <text
          x="170"
          y="205"
          textAnchor="middle"
          className="fill-[var(--text)] text-xs font-bold"
        >
          USDC
        </text>
        <ellipse
          cx="230"
          cy="200"
          rx="25"
          ry="25"
          fill="url(#yieldGradient)"
          filter="url(#yieldglow)"
        />
        <text
          x="230"
          y="205"
          textAnchor="middle"
          className="fill-[var(--text)] text-xs font-bold"
        >
          JAGA
        </text>

        {/* Bottom Arrow (centered under circle) */}
        <line
          x1="170"
          y1="225"
          x2="170"
          y2="280"
          stroke="#60a5fa"
          strokeWidth="2"
          strokeDasharray="4,4"
        />
        <polygon points="165,275 170,285 175,275" fill="#60a5fa" />
        <line
          x1="230"
          y1="235"
          x2="230"
          y2="285"
          stroke="#34d399"
          strokeWidth="2"
          strokeDasharray="4,4"
        />
        <polygon points="225,230 230,220 235,230" fill="#34d399" />

        <text
          x="200"
          y="310"
          textAnchor="middle"
          className="fill-[var(--text)]  text-sm font-medium"
        >
          Jagantara Vault
        </text>

        <g transform="translate(190, 400)">
          <path
            d="M -50 -50 L 50 -50 L 50 50 L -50 50 Z"
            fill="url(#vaultGradient)"
            filter="url(#glow)"
          />
          <path
            d="M 50 -50 L 70 -70 L 70 30 L 50 50 Z"
            fill="url(#lenderGradient2)"
          />
          <path
            d="M -50 -50 L -30 -70 L 70 -70 L 50 -50 Z"
            fill="url(#lenderGradient2)"
          />
          <motion.foreignObject
            x={-40}
            y={-40}
            width={80}
            height={80}
            animate={{ y: [0, -5, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <img
              src="/jagantara_icon.png"
              alt="Jagantara Icon"
              width="80"
              height="80"
              style={{
                pointerEvents: "none",
                borderRadius: "50%",
                filter: "brightness(0.6)", // ⬅️ darkens the icon
              }}
            />
          </motion.foreignObject>
        </g>
      </motion.g>
    </svg>
  );
}

// Step 2 Canvas Component
function Step2Canvas() {
  return (
    <svg
      width="500"
      height="600"
      viewBox="0 0 400 600"
      className="w-full max-w-md"
    >
      <defs>
        <linearGradient id="vaultGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#93c5fd" />
          <stop offset="30%" stopColor="#60a5fa" />
          <stop offset="70%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1e40af" />
        </linearGradient>
        <linearGradient id="yieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="50%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <linearGradient id="marketGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="50%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1e40af" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <motion.g
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* WETH Vault at top */}
        <text
          x="210"
          y="15"
          textAnchor="middle"
          className="fill-[var(--text)] text-sm font-medium"
        >
          Insurance Manager (Smart Contract)
        </text>
        <g transform="translate(200, 80)">
          <path
            d="M -40 -40 L 40 -40 L 40 40 L -40 40 Z"
            fill="url(#vaultGradient)"
            filter="url(#glow)"
          />
          <path
            d="M 40 -40 L 55 -55 L 55 25 L 40 40 Z"
            fill="url(#yieldGradient)"
          />
          <path
            d="M -40 -40 L -25 -55 L 55 -55 L 40 -40 Z"
            fill="url(#yieldGradient)"
          />
          <motion.foreignObject
            x={-35}
            y={-35}
            width={80}
            height={80}
            animate={{ y: [0, -5, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <img
              src="/jagantara_icon.png"
              alt="Jagantara Icon"
              width="70"
              height="70"
              style={{
                pointerEvents: "none",
                borderRadius: "50%",
                filter: "brightness(0.6)", // ⬅️ darkens the icon
              }}
            />
          </motion.foreignObject>
        </g>

        {/* Arrow down */}
        <line
          x1="200"
          y1="130"
          x2="200"
          y2="180"
          stroke="#60a5fa"
          strokeWidth="2"
          strokeDasharray="4,4"
        />
        <polygon points="195,175 200,185 205,175" fill="#60a5fa" />

        {/* Dotted container for markets */}
        <rect
          x="15"
          y="180"
          width="380"
          height="200"
          fill="none"
          stroke="#60a5fa"
          strokeWidth="1"
          strokeDasharray="8,4"
          rx="10"
          opacity="0.6"
        />

        {/* Four market cylinders */}
        <motion.g
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* wstETH / WETH - Adjusted Position */}
          <g transform="translate(85, 280)">
            <ellipse
              cx="0"
              cy="-25"
              rx="35"
              ry="8"
              fill="url(#marketGradient)"
            />
            <rect
              x="-35"
              y="-25"
              width="70"
              height="50"
              fill="url(#marketGradient)"
              filter="url(#glow)"
            />
            <ellipse cx="0" cy="25" rx="35" ry="8" fill="#1e40af" />
            <text
              x="0"
              y="45"
              textAnchor="middle"
              className="fill-[var(--text)] text-xs font-medium"
            >
              Company
            </text>
          </g>

          {/* sDAI / WETH - Adjusted Position */}
          <g transform="translate(165, 280)">
            <ellipse
              cx="0"
              cy="-25"
              rx="35"
              ry="8"
              fill="url(#marketGradient)"
            />
            <rect
              x="-35"
              y="-25"
              width="70"
              height="50"
              fill="url(#marketGradient)"
              filter="url(#glow)"
            />
            <ellipse cx="0" cy="25" rx="35" ry="8" fill="#1e40af" />
            <text
              x="0"
              y="45"
              textAnchor="middle"
              className=" text-xs font-medium fill-[var(--text)]"
            >
              Liquidity
            </text>
          </g>

          {/* sfrxETH / WETH - Adjusted Position */}
          <g transform="translate(245, 280)">
            <ellipse
              cx="0"
              cy="-25"
              rx="35"
              ry="8"
              fill="url(#marketGradient)"
            />

            <rect
              x="-35"
              y="-25"
              width="70"
              height="50"
              fill="url(#marketGradient)"
              filter="url(#glow)"
            />

            <image
              href="/morpho_logo.png"
              x="-16"
              y="-20"
              width="32"
              height="32"
            />

            <ellipse cx="0" cy="25" rx="35" ry="8" fill="#1e40af" />

            <text
              x="0"
              y="45"
              text-anchor="middle"
              className="text-xs font-medium fill-[var(--text)]"
            >
              Morpho
            </text>
          </g>

          {/* cbETH / WETH - Adjusted Position */}
          <g transform="translate(325, 280)">
            <ellipse
              cx="0"
              cy="-25"
              rx="35"
              ry="8"
              fill="url(#marketGradient)"
            />
            <rect
              x="-35"
              y="-25"
              width="70"
              height="50"
              fill="url(#marketGradient)"
              filter="url(#glow)"
            />
            <ellipse cx="0" cy="25" rx="35" ry="8" fill="#1e40af" />
            <text
              x="0"
              y="45"
              textAnchor="middle"
              className="text-xs font-medium fill-[var(--text)]"
            >
              Stakers
            </text>
          </g>
        </motion.g>
        {/* Connecting arrows */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {/* To wstETH */}
          <line
            x1="200"
            y1="185"
            x2="80"
            y2="230"
            stroke="#60a5fa"
            strokeWidth="2"
            strokeDasharray="4,4"
          />
          <polygon points="75,235 80,245 85,235" fill="#60a5fa" />

          {/* To sDAI */}
          <line
            x1="200"
            y1="185"
            x2="160"
            y2="230"
            stroke="#60a5fa"
            strokeWidth="2"
            strokeDasharray="4,4"
          />
          <polygon points="155,235 160,245 165,235" fill="#60a5fa" />

          {/* To sfrxETH */}
          <line
            x1="200"
            y1="185"
            x2="240"
            y2="230"
            stroke="#60a5fa"
            strokeWidth="2"
            strokeDasharray="4,4"
          />
          <polygon points="235,235 240,245 245,235" fill="#60a5fa" />

          {/* To cbETH */}
          <line
            x1="200"
            y1="185"
            x2="320"
            y2="230"
            stroke="#60a5fa"
            strokeWidth="2"
            strokeDasharray="4,4"
          />
          <polygon points="315,235 320,245 325,235" fill="#60a5fa" />
        </motion.g>
        {/* Downward arrows to Jagantara Vault (from Re-Invest & Liquidity) */}
        <g>
          {/* From Re-Invest (sfrxETH) */}
          <line
            x1="240"
            y1="330"
            x2="240"
            y2="410"
            stroke="#60a5fa"
            strokeWidth="2"
            strokeDasharray="4,4"
          />
          <polygon points="235,415 240,425 245,415" fill="#60a5fa" />

          {/* From Liquidity (cbETH) */}
          <line
            x1="165"
            y1="330"
            x2="165"
            y2="410"
            stroke="#60a5fa"
            strokeWidth="2"
            strokeDasharray="4,4"
          />
          <polygon points="160,415 165,425 170,415" fill="#60a5fa" />
        </g>

        {/* Jagantara Vault at bottom */}
        <text
          x="210"
          y="440"
          textAnchor="middle"
          className="fill-[var(--text)] text-sm font-medium"
        >
          Jagantara Vault
        </text>
        <g transform="translate(200, 510)">
          <path
            d="M -40 -40 L 40 -40 L 40 40 L -40 40 Z"
            fill="url(#vaultGradient)"
            filter="url(#glow)"
          />
          <path
            d="M 40 -40 L 55 -55 L 55 25 L 40 40 Z"
            fill="url(#marketGradient)"
          />
          <path
            d="M -40 -40 L -25 -55 L 55 -55 L 40 -40 Z"
            fill="url(#marketGradient)"
          />
          <motion.foreignObject
            x={-35}
            y={-35}
            width={80}
            height={80}
            animate={{ y: [0, -5, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <img
              src="/jagantara_icon.png"
              alt="Jagantara Icon"
              width="70"
              height="70"
              style={{
                pointerEvents: "none",
                borderRadius: "50%",
                filter: "brightness(0.6)", // ⬅️ darkens the icon
              }}
            />
          </motion.foreignObject>
        </g>
      </motion.g>
    </svg>
  );
}

// Step 3 Canvas Component
function Step3Canvas() {
  return (
    <svg
      width="400"
      height="600"
      viewBox="0 0 400 600"
      className="w-full max-w-md"
    >
      <defs>
        <linearGradient id="vaultGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#93c5fd" />
          <stop offset="30%" stopColor="#60a5fa" />
          <stop offset="70%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1e40af" />
        </linearGradient>
        <linearGradient id="yieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="50%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <motion.g
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Borrowers at bottom */}
        <text
          x="200"
          y="550"
          textAnchor="middle"
          className="fill-[var(--text)]  text-sm font-medium"
        >
          Policyholders
        </text>

        <ellipse
          cx="200"
          cy="455"
          rx="25"
          ry="20"
          fill="url(#yieldGradient)"
          filter="url(#glow)"
        />
        <ellipse
          cx="200"
          cy="500"
          rx="30"
          ry="30"
          fill="url(#yieldGradient)"
          filter="url(#glow)"
        />
        {/* Arrows from Policyholder to $ icons */}
        <motion.g
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Left Line + Arrow */}
          <line
            x1="200"
            y1="500"
            x2="100"
            y2="350"
            stroke="#34d399"
            strokeWidth="2"
            strokeDasharray="4,4"
          />
          <polygon points="95,355 100,345 105,355" fill="#34d399" />

          {/* Center Line + Arrow */}
          <line
            x1="200"
            y1="500"
            x2="200"
            y2="350"
            stroke="#34d399"
            strokeWidth="2"
            strokeDasharray="4,4"
          />
          <polygon points="195,355 200,345 205,355" fill="#34d399" />

          {/* Right Line + Arrow */}
          <line
            x1="200"
            y1="500"
            x2="300"
            y2="350"
            stroke="#34d399"
            strokeWidth="2"
            strokeDasharray="4,4"
          />
          <polygon points="295,355 300,345 305,355" fill="#34d399" />
        </motion.g>

        {/* Yield flow visualization */}
        <motion.g
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          <circle
            cx="100"
            cy="320"
            r="20"
            fill="url(#yieldGradient)"
            filter="url(#glow)"
          />
          <text
            x="100"
            y="325"
            textAnchor="middle"
            className="fill-[var(--text)]  text-xs font-bold"
          >
            USDC
          </text>

          <circle
            cx="200"
            cy="320"
            r="20"
            fill="url(#yieldGradient)"
            filter="url(#glow)"
          />
          <text
            x="200"
            y="325"
            textAnchor="middle"
            className="fill-[var(--text)]  text-xs font-bold"
          >
            USDC
          </text>

          <circle
            cx="300"
            cy="320"
            r="20"
            fill="url(#yieldGradient)"
            filter="url(#glow)"
          />
          <text
            x="300"
            y="325"
            textAnchor="middle"
            className="fill-[var(--text)]  text-xs font-bold"
          >
            USDC
          </text>
        </motion.g>

        {/* Arrows pointing up (yield flow) */}
        <motion.g
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
        >
          {/* Left Line + Arrow */}
          <line
            x1="100"
            y1="300"
            x2="100"
            y2="250"
            stroke="#34d399"
            strokeWidth="2"
          />
          <polygon points="95,245 100,235 105,245" fill="#34d399" />

          {/* Center Line + Arrow */}
          <line
            x1="200"
            y1="300"
            x2="200"
            y2="250"
            stroke="#34d399"
            strokeWidth="2"
          />
          <polygon points="195,245 200,235 205,245" fill="#34d399" />

          {/* Right Line + Arrow */}
          <line
            x1="300"
            y1="300"
            x2="300"
            y2="250"
            stroke="#34d399"
            strokeWidth="2"
          />
          <polygon points="295,245 300,235 305,245" fill="#34d399" />
        </motion.g>

        {/* Vault receiving yield */}
        <text
          x="210"
          y="50"
          textAnchor="middle"
          className="fill-[var(--text)]  text-sm font-medium"
        >
          Insurance Manager (Smart Contract )
        </text>
        <g transform="translate(200, 150)">
          <path
            d="M -50 -50 L 50 -50 L 50 50 L -50 50 Z"
            fill="url(#vaultGradient)"
            filter="url(#glow)"
          />
          <path
            d="M 50 -50 L 70 -70 L 70 30 L 50 50 Z"
            fill="url(#yieldGradient)"
            opacity="0.7"
          />
          <path
            d="M -50 -50 L -30 -70 L 70 -70 L 50 -50 Z"
            fill="url(#yieldGradient)"
            opacity="0.7"
          />
          <motion.foreignObject
            x={-35}
            y={-35}
            width={80}
            height={80}
            animate={{ y: [0, -5, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <img
              src="/jagantara_icon.png"
              alt="Jagantara Icon"
              width="70"
              height="70"
              style={{
                pointerEvents: "none",
                borderRadius: "50%",
                filter: "brightness(0.6)", // ⬅️ darkens the icon
              }}
            />
          </motion.foreignObject>
        </g>
      </motion.g>
    </svg>
  );
}
