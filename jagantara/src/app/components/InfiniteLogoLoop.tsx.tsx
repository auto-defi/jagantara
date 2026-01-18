"use client";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import GradientText from "@/components/gradient-text";
import clsx from "clsx";

const companies = [
  {
    name: "Binance",
    logo: "/campaign_logos/bnb_launchpad.png",
  },
  {
    name: "Coinbase",
    logo: "/landing_logo/coinbase.png",
  },
  {
    name: "Bank Indonesia",
    logo: "/landing_logo/bankindonesia.png",
  },
  {
    name: "Mantle",
    logo: "/landing_logo/mantle.svg",
  },
  {
    name: "DAO Maker",
    logo: "/landing_logo/daomaker.png",
  },
  {
    name: "OpenSea", // This one will be dynamic
    logo: "", // Leave empty; override later based on theme
  },
  {
    name: "UniSwap",
    logo: "/landing_logo/uniswap.png",
  },
];

const companies2 = [
  {
    name: "Indodax",
    logo: "/backing_img/indodax-logo.png",
  },
  {
    name: "Bitget",
    logo: "/landing_logo/bittget.png",
  },
  {
    name: "Bank Indonesia",
    logo: "/landing_logo/bankindonesia.png",
  },
  {
    name: "Mantle",
    logo: "/landing_logo/mantle.svg",
  },
  {
    name: "DAO Maker",
    logo: "/landing_logo/daomaker.png",
  },
  {
    name: "OpenSea", // This one will be dynamic
    logo: "", // Leave empty; override later based on theme
  },
  {
    name: "UniSwap",
    logo: "/landing_logo/uniswap.png",
  },
];

export default function InfiniteLogoLoop() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const getLogo = (company: { name: any; logo: any }) => {
    if (company.name === "OpenSea") {
      return theme === "dark"
        ? "/landing_logo/opensea_white.svg"
        : "/landing_logo/opensea.svg";
    }
    return company.logo || "/placeholder.svg";
  };

  if (!mounted) return null; // Prevent hydration mismatch

  return (
    <section className="relative w-full py-20 lg:py-28 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div
          className={clsx(
            "md:w-[800px] md:h-[800px] w-[400px] h-[400px] rounded-full",
            theme === "dark"
              ? "bg-[radial-gradient(circle,_rgba(147,197,253,0.3)_0%,_transparent_60%)]"
              : "bg-[radial-gradient(circle,_rgba(59,130,246,0.5)_0%,_transparent_50%)]"
          )}
        />
      </div>

      <div className="relative mx-auto  px-6 lg:px-8">
        {/* Enhanced Header Section */}
        <div className="mx-auto  text-center mb-5">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border/50 bg-background/50 backdrop-blur-sm mb-6">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-sm font-medium text-muted-foreground">
              Protecting Innovation Worldwide
            </span>
          </div>

          <div className="space-y-4">
            <GradientText
              colors={[
                "var(--primary)",
                "var(--accent)",
                "var(--primary)",
                "var(--accent)",
              ]}
              animationSpeed={6}
              showBorder={false}
              className="font-bold !px-0 text-4xl lg:text-5xl"
            >
              Trusted By Industry Leaders
            </GradientText>

            <p className="mt-6 text-md md:text-xl leading-8 text-muted-foreground max-w-3xl mx-auto">
              Join the world's most innovative financial technology companies
              and institutions who trust our platform to power their
              next-generation solutions
            </p>
          </div>

          {/* Stats or additional info */}
          <div className="flex items-center justify-center gap-8 mt-8 text-xs md:text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span>🏢 500+ Companies</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span>🌍 50+ Countries</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span>⚡ 99.9% Uptime</span>
            </div>
          </div>
        </div>

        {/* Logo Marquee Sections */}
        <div className="relative">
          {/* First Row */}
          <div className="overflow-hidden rounded-lg bg-gradient-to-r from-background via-muted/20 to-background p-1">
            <div className="overflow-hidden rounded-md bg-background/80 backdrop-blur-sm">
              <div className="flex animate-marquee md:space-x-16 md:py-8 min-w-fit will-change-transform">
                {[...companies, ...companies].map((company, index) => (
                  <div
                    key={`${company.name}-${index}`}
                    className="flex-shrink-0 flex items-center justify-center h-16 w-40 md:w-56 md:grayscale hover:grayscale-0 transition-all duration-500 md:opacity-60 hover:opacity-100 group"
                  >
                    <div className="relative p-4 rounded-lg transition-all duration-300 group-hover:scale-105">
                      <Image
                        src={getLogo(company) || "/placeholder.svg"}
                        alt={`${company.name} logo`}
                        width={120}
                        height={40}
                        className="h-20 w-full object-contain cursor-pointer"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Second Row with reverse animation */}
          <div className="overflow-hidden rounded-lg bg-gradient-to-r from-background via-muted/20 to-background p-1">
            <div className="overflow-hidden rounded-md bg-background/80 backdrop-blur-sm">
              <div className="flex animate-marquee-reverse md:space-x-16 md:py-8 w-max will-change-transform">
                {[
                  ...companies2.slice().reverse(),
                  ...companies2.slice().reverse(),
                ].map((company, index) => (
                  <div
                    key={`reverse-${company.name}-${index}`}
                    className="flex-shrink-0 flex items-center justify-center h-20 w-40 md:w-56 md:grayscale hover:grayscale-0 transition-all duration-500 md:opacity-60 hover:opacity-100 group"
                  >
                    <div className="relative p-4 rounded-lg  transition-all duration-300  group-hover:scale-105">
                      <Image
                        src={getLogo(company) || "/placeholder.svg"}
                        alt={`${company.name} logo`}
                        width={120}
                        height={40}
                        className="h-20 w-full object-contain cursor-pointer"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
