"use client";

import CountUp from "@/components/countup";
import Orb from "@/components/orb";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, CheckCircle, Wallet } from "lucide-react";
import { useRouter } from "next/navigation";
import SplitText from "@/components/split-text";
import FadeContent from "@/components/fade-content";
import Image from "next/image";
import FAQLanding from "./components/FAQLanding";
import { useClaimManager } from "@/hooks/useClaimManager";
import InfiniteLogoLoop from "./components/InfiniteLogoLoop.tsx";
import PricingCard from "./components/PricingCard";
import GradientText from "@/components/gradient-text";
import HoverMenuEarn from "./components/hover-menu-earn";
import HoverMenuCoverage from "./components/hover-menu-coverage";
import PromotionalCards from "./components/promotional-card";

function App() {
  const { formattedVaultBalance } = useClaimManager();
  const router = useRouter();
  return (
    <>
      <main className="flex-1 mx-auto max-w-11/12 px-5 pb-5 ">
        <section className="w-full pb-20">
          <div className=" md:px-6">
            <div className="grid gap-6 md:grid-cols-2 lg:gap-12 lg:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <div className="">
                    <SplitText
                      text="Decentralized Protection "
                      className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none "
                      delay={20}
                      duration={0.6}
                      ease="power3.out"
                      splitType="chars"
                      from={{ opacity: 0, y: 40 }}
                      to={{ opacity: 1, y: 0 }}
                      threshold={0.1}
                      rootMargin="-100px"
                      textAlign="left"
                      // style={{ color: "var(--text)" }}
                    />
                    <SplitText
                      text="for Your Precious"
                      className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none pr-5"
                      delay={20}
                      duration={0.6}
                      ease="power3.out"
                      splitType="chars"
                      from={{ opacity: 0, y: 40 }}
                      to={{ opacity: 1, y: 0 }}
                      threshold={0.1}
                      rootMargin="-100px"
                      textAlign="left"
                      // style={{ color: "var(--text)" }}
                    />
                    <FadeContent
                      blur={false}
                      duration={2000}
                      easing="ease-out"
                      initialOpacity={0}
                    >
                      <h1
                        className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none"
                        style={{ color: "var(--text)" }}
                      >
                        <span className="bg-[image:var(--gradient-primary)] bg-clip-text text-transparent pr-5">
                          Digital Assets
                        </span>
                      </h1>
                    </FadeContent>
                  </div>

                  <p
                    className="max-w-[600px] md:text-xl font-light"
                    style={{
                      color: "var(--text)",
                      opacity: 0.8,
                    }}
                  >
                    Jagantara provides comprehensive insurance coverage for your
                    cryptocurrency, NFTs, and DeFi investments. Powered by
                    blockchain technology for transparent, trustless protection.
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-2 min-[400px]:flex-row">
                    <Button
                      size="lg"
                      style={{
                        background: "var(--gradient-primary)",
                        color: "white",
                      }}
                      className="group hover:opacity-90 cursor-pointer glow-blue relative overflow-hidden pr-10"
                      onClick={() => window.open("/earn", "_blank")} // 👈 open in new tab
                    >
                      Launch App
                      <ArrowUpRight className="ml-2 h-4 w-4 arrow-animate-out transition-all duration-300 group-hover:arrow-out" />
                      <ArrowUpRight className="h-4 w-4 absolute right-3 top-1/2 -translate-y-1/2 opacity-0 arrow-animate-in transition-all duration-300 group-hover:arrow-in" />
                    </Button>

                    <Button
                      variant="outline"
                      size="lg"
                      className="group hover:opacity-80 cursor-pointer relative overflow-hidden pr-10"
                      style={{
                        background: "var(--secondary)",
                        color: "var(--text)",
                        borderColor: "var(--secondary)",
                      }}
                      onClick={() => window.open("/coverage", "_blank")} // 👈 open in new tab
                    >
                      Get Coverage
                      <ArrowUpRight className="ml-2 h-4 w-4 arrow-animate-out transition-all duration-300 group-hover:arrow-out" />
                      <ArrowUpRight className="h-4 w-4 absolute right-3 top-1/2 -translate-y-1/2 opacity-0 arrow-animate-in transition-all duration-300 group-hover:arrow-in" />
                    </Button>
                  </div>

                  <div
                    className="flex items-center gap-4 text-sm"
                    style={{ color: "var(--text)", opacity: 0.8 }}
                  >
                    <div className="flex items-center gap-1">
                      <CheckCircle
                        className="h-4 w-4"
                        style={{ color: "var(--primary)" }}
                      />
                      <span>$50M+ Assets Protected</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle
                        className="h-4 w-4"
                        style={{ color: "var(--primary)" }}
                      />
                      <span>24/7 Coverage</span>
                    </div>
                  </div>
                  <div className="grid gap-6 md:grid-cols-2 lg:gap-6 ">
                    {/* Total Deposits */}
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

                    {/* Policies Issued */}
                    <div className="flex flex-col justify-between p-4 rounded-2xl shadow-md bg-gradient-to-br from-[#002747] to-[#050208] text-white">
                      <p className="text-sm font-normal opacity-70">
                        Total Wallet Protected
                      </p>
                      <span className="text-3xl md:text-4xl font-normal tracking-tight flex gap-1 items-end">
                        <Wallet size={30} />
                        <CountUp
                          from={0}
                          to={100000}
                          separator=","
                          duration={1}
                        />
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center ">
                <div className="relative w-full h-[600px] cursor-grab">
                  <Orb
                    hoverIntensity={1}
                    rotateOnHover={true}
                    hue={0}
                    forceHoverState={false}
                  />
                  <FadeContent
                    blur={false}
                    duration={2000}
                    easing="ease-out"
                    initialOpacity={0}
                  >
                    {/* Desktop Icon */}
                    <div className="absolute inset-0 hidden md:flex items-center justify-center pointer-events-none float-animation">
                      <Image
                        src="/jagantara_icon.png"
                        alt="Jagantara Icon"
                        loading="lazy"
                        width={400}
                        height={400}
                      />
                    </div>

                    {/* Mobile Icon */}
                    <div className="absolute inset-0 flex md:hidden items-center justify-center pointer-events-none float-animation">
                      <Image
                        src="/jagantara_icon.png"
                        alt="Jagantara Icon"
                        loading="lazy"
                        width={250}
                        height={250}
                      />
                    </div>
                  </FadeContent>
                </div>
              </div>
            </div>
          </div>
        </section>
        <InfiniteLogoLoop />

        <section
          className="md:mx-10 lg:mx-20 my-40 scroll-mt-32 "
          id="features"
        >
          {/* Header */}
          <div className="text-center md:mb-16">
            <GradientText
              colors={[
                "var(--primary)",
                "var(--accent)",
                "var(--primary)",
                "var(--accent)",
              ]}
              animationSpeed={6}
              showBorder={false}
              className="font-bold text-3xl mb-3"
            >
              Next Gen Defi Solutions
            </GradientText>
            <p className="text-md md:text-xl text-[var(--text)]/70 max-w-2xl mx-auto">
              Discover powerful tools to protect, insure, and maximize your
              crypto assets with cutting-edge protocols
            </p>
          </div>

          <PromotionalCards />
        </section>

        <section className=" md:mx-6 lg:mx-20  mt-80">
          <HoverMenuEarn />
        </section>

        <section className="md:mx-6 lg:mx-20 mt-40 pb-40">
          <HoverMenuCoverage />
        </section>

        <section className="scroll-mt-32" id="pricing">
          <div className="text-center  ">
            <h2 className=" font-bold tracking-tight md:text-5xl mb-4 space-y-1">
              <GradientText
                colors={[
                  "var(--primary)",
                  "var(--accent)",
                  "var(--primary)",
                  "var(--accent)",
                ]}
                animationSpeed={6}
                showBorder={false}
                className="font-bold text-3xl"
              >
                Premium Prices
              </GradientText>
            </h2>
            <p className="text-[var(--text)]/70 text-md md:text-lg max-w-3xl mx-auto">
              Choose the right coverage for your digital assets with our
              flexible premium plans. Whether you're an individual or a
              business, we have a plan that fits your needs.
            </p>
          </div>
          <PricingCard />
        </section>

        <section
          id="FAQ"
          className="scroll-mt-28 w-full md:mx-6 flex flex-col justify-center items-center pt-10 mb-20"
        >
          <FAQLanding />
        </section>
      </main>
    </>
  );
}

export default App;
