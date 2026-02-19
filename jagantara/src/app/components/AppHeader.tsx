"use client";

import { useState } from "react";
import { Moon, Sun, Menu, X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import ConnectWallet from "./ConnectWallet";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";

export default function Header() {
  const navItems = [
    "Earn",
    "Coverage",
    "JagaDAO",
    "Vault",
    "Campaign",
    "Jagabot",
  ];
  const pathname = usePathname();
  const active =
    navItems.find(
      (item) => pathname === `/${item.toLowerCase().replace(/\s+/g, "-")}`
    ) || "Earn";
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleClick = (item: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const targetPath = `/${item.toLowerCase().replace(/\s+/g, "-")}`;
    if (pathname === targetPath) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setMenuOpen(false);
    router.push(targetPath);
  };

  return (
    <header
      className="px-3 md:px-6 py-3 flex items-center justify-between sticky w-full top-0 z-50 "
      style={{ background: "var(--background)" }}
    >
      {/* Left: Logo */}
      <div className="flex items-center gap-8">
        <button
          className="flex items-center gap-1 cursor-pointer"
          onClick={() => router.push("/")}
        >
          <Image src="/jagantara_icon.png" alt="Logo" width={50} height={50} />
          <span className="hidden md:flex font-semibold text-lg">
            Jagantara
          </span>
        </button>
        <nav className="hidden md:flex gap-2">
          {navItems.map((item) => (
            <button
              key={item}
              className={`text-sm px-4.5 py-2.5 rounded-full cursor-pointer font-semibold transition-colors duration-100 ease-in ${
                active === item
                  ? "bg-[var(--secondary)]"
                  : "hover:bg-[var(--secondary)]"
              }`}
              onClick={handleClick(item)}
            >
              {item}
            </button>
          ))}
        </nav>
      </div>

      {/* Center: Nav (desktop only) */}

      {/* Right: Wallet & Theme (always visible) */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          className="cursor-pointer rounded-full"
          onClick={toggleTheme}
        >
          {theme === "dark" ? (
            <Moon className="h-[1.2rem] w-[1.2rem]" />
          ) : (
            <Sun className="h-[1.2rem] w-[1.2rem]" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
        <ConnectWallet />

        {/* Mobile Menu Toggle (hidden on md+) */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-[var(--background)] px-6 py-4 flex flex-col gap-2 md:hidden z-40">
          {navItems.map((item) => (
            <button
              key={item}
              className={`text-sm w-full text-left px-4 py-2 rounded-md font-medium transition-colors duration-100 ${
                active === item
                  ? "bg-[var(--secondary)]"
                  : "hover:bg-[var(--secondary)]"
              }`}
              onClick={handleClick(item)}
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
