import { defaultConfig } from "@xellar/kit";
import { Config } from "wagmi";

// Define Stacks Sepolia testnet
const stacksSepolia = {
  id: 5003,
  name: "Stacks Sepolia",
  nativeCurrency: { name: "MNT", symbol: "MNT", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.sepolia.stacks.xyz"] },
  },
  blockExplorers: {
    default: { name: "Stacks Explorer", url: "https://explorer.stacks.co" },
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
  chains: [stacksSepolia],
  ssr: true,
}) as Config;
