import { defaultConfig } from "@xellar/kit";
import { Config } from "wagmi";

// Define Mantle Sepolia testnet
const mantleSepolia = {
  id: 5003,
  name: "Mantle Sepolia",
  nativeCurrency: { name: "MNT", symbol: "MNT", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.sepolia.mantle.xyz"] },
  },
  blockExplorers: {
    default: { name: "Mantle Explorer", url: "https://sepolia.mantlescan.xyz" },
  },
  contracts: {
    wrappedToken: {
      address: "0x19f5557E23e9914A18239990f6C70D68FDF0deD5",
    },
  },
} as const;

export const config = defaultConfig({
  appName: "Xellar",
  walletConnectProjectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID ?? "",
  xellarAppId:
    process.env.NEXT_PUBLIC_XELLAR_PROJECT_ID ??
    "46574487-464a-4487-9029-56278f8ba8ff",
  xellarEnv: "sandbox",
  chains: [mantleSepolia],
  ssr: true,
}) as Config;
