"use client";

import { ChevronDown, User, Wallet } from "lucide-react";
import { useStacksWallet } from "@/hooks/useStacksWallet";

export default function ConnectWallet() {
  const { isConnected, address, connect, disconnect, isConnecting } = useStacksWallet();

  const formatAddress = (addr: string | null) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="flex items-center gap-4">
      {!isConnected ? (
        <button
          className="group flex items-center px-3 py-2 rounded-xl transition-all duration-300 glow-blue cursor-pointer"
          style={{ background: "var(--gradient-accent-soft)" }}
          onClick={connect}
          disabled={isConnecting}
        >
          <div className="relative flex items-center gap-2">
            <Wallet className="w-4 h-4 transition-transform group-hover:rotate-12" />
            <span className="hidden md:flex text-sm font-bold">
              {isConnecting ? "Connecting..." : "Connect Wallet"}
            </span>
            <span className="flex md:hidden text-sm font-bold">
              {isConnecting ? "..." : "Connect"}
            </span>
          </div>
        </button>
      ) : (
        <button
          className="group relative overflow-hidden bg-[var(--gradient-primary)] px-3 py-2 rounded-lg font-medium text-sm transition-all duration-300 hover:scale-105 hover:shadow-md active:scale-95 cursor-pointer glow-blue"
          style={{ background: "var(--gradient-accent-soft)" }}
          onClick={disconnect}
        >
          {/* Hover overlay */}
          <div
            className="absolute inset-0 bg-[var(--gradient-accent-soft)] opacity-0 group-hover:opacity-20 transition-opacity duration-300"
            style={{ background: "var(--gradient-accent-soft)" }}
          ></div>

          <div className="relative flex items-center gap-2">
            {/* Balance Section - STX balance would be fetched separately */}
            <div className="hidden md:flex items-center gap-1 px-2 py-0.5 bg-white/20 rounded-md border border-white/30 backdrop-blur-sm">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-xs font-mono">STX</span>
            </div>

            {/* Divider */}
            <div className="w-px h-4 bg-white/40 hidden md:flex"></div>

            {/* Address Section */}
            <div className="flex items-center gap-1">
              <div
                className="w-6 h-6 bg-[var(--accent)] rounded-full flex items-center justify-center"
                style={{ background: "var(--accent)" }}
              >
                <User className="w-3 h-3" />
              </div>
              <span className="text-xs font-mono">
                {formatAddress(address)}
              </span>
              <ChevronDown className="w-3 h-3 group-hover:rotate-180 transition-transform" />
            </div>
          </div>

          {/* Active click overlay */}
          <div className="absolute inset-0 bg-white opacity-0 group-active:opacity-10 transition-opacity duration-150 pointer-events-none"></div>
        </button>
      )}
    </div>
  );
}
