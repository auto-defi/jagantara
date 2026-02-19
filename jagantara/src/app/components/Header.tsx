"use client";

import { useState } from "react";

import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "../../components/ui/resizable-navbar";
import ConnectWallet from "./ConnectWallet";
import { ArrowUpRight, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import AnimatedContent from "@/components/animated-content";
export default function Header() {
  const navItems = [
    {
      name: "Features",
      link: "#features",
    },
    {
      name: "Pricing",
      link: "#pricing",
    },
    {
      name: "FAQ",
      link: "#FAQ",
    },
    {
      name: "Docs",
      link: "#contact",
    },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };
  return (
    <header className="sticky w-full top-0 z-50 ">
      <AnimatedContent
        distance={100}
        direction="vertical"
        reverse={true}
        duration={1.2}
        ease="power3.out"
        initialOpacity={0}
        animateOpacity
        scale={1}
        threshold={0.1}
        delay={0}
      >
        <Navbar>
          <NavBody>
            <NavbarLogo />

            <NavItems items={navItems} />
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="z-[100] cursor-pointer rounded-full"
                onClick={toggleTheme}
              >
                {theme === "dark" ? (
                  <Moon className="h-[1.2rem] w-[1.2rem] transition-all " />
                ) : (
                  <Sun className="h-[1.2rem] w-[1.2rem] transition-all" />
                )}
                <span className="sr-only">Toggle theme</span>
              </Button>

              <Button
                size="lg"
                style={{
                  background: "var(--gradient-primary)",
                  color: "white",
                }}
                className="group hover:opacity-90 cursor-pointer glow-blue relative overflow-hidden pr-5 rounded-3xl"
                onClick={() => window.open("/earn", "_blank")} // 👈 open in new tab
              >
                Launch App
                <ArrowUpRight className="ml-2 h-4 w-4 arrow-animate-out transition-all duration-300 group-hover:arrow-out" />
                <ArrowUpRight className="h-4 w-4 absolute right-3 top-1/2 -translate-y-1/2 opacity-0 arrow-animate-in transition-all duration-300 group-hover:arrow-in" />
              </Button>
            </div>
          </NavBody>

          {/* Mobile Navigation */}
          <MobileNav>
            <MobileNavHeader>
              <NavbarLogo />
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="z-[100] cursor-pointer rounded-full"
                  onClick={toggleTheme}
                >
                  {theme === "dark" ? (
                    <Moon className="h-[1.2rem] w-[1.2rem] transition-all " />
                  ) : (
                    <Sun className="h-[1.2rem] w-[1.2rem] transition-all" />
                  )}
                  <span className="sr-only">Toggle theme</span>
                </Button>

                <button
                  style={{
                    background: "var(--gradient-primary)",
                    color: "white",
                  }}
                  className="group hover:opacity-90 cursor-pointer glow-blue relative overflow-hidden p-2.5 rounded-xl text-sm font-medium"
                  onClick={() => window.open("/earn", "_blank")} // 👈 open in new tab
                >
                  Launch App
                </button>

                <MobileNavToggle
                  isOpen={isMobileMenuOpen}
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                />
              </div>
            </MobileNavHeader>

            <MobileNavMenu
              isOpen={isMobileMenuOpen}
              onClose={() => setIsMobileMenuOpen(false)}
            >
              {navItems.map((item, idx) => (
                <a
                  key={`mobile-link-${idx}`}
                  href={item.link}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="relative text-neutral-600 dark:text-neutral-300"
                >
                  <span className="block">{item.name}</span>
                </a>
              ))}
            </MobileNavMenu>
          </MobileNav>
        </Navbar>
      </AnimatedContent>
    </header>
  );
}
