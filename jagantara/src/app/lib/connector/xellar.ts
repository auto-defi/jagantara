import { defaultConfig } from "@xellar/kit";
import { Config } from "wagmi";

// Define BNB Smart Chain Mainnet
const bscMainnet = {
  id: 56,
  name: "BNB Smart Chain",
  nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://bsc-dataseed.bnbchain.org"] },
  },
  blockExplorers: {
    default: { name: "BSCScan", url: "https://bscscan.com" },
  },
  contracts: {
    wrappedToken: {
      address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
    },
  },
} as const;

// Define BNB Smart Chain Testnet
const bscTestnet = {
  id: 97,
  name: "BNB Smart Chain Testnet",
  nativeCurrency: { name: "BNB", symbol: "tBNB", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://bsc-testnet-dataseed.bnbchain.org"] },
  },
  blockExplorers: {
    default: { name: "BSCScan Testnet", url: "https://testnet.bscscan.com" },
  },
  contracts: {
    wrappedToken: {
      address: "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd",
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
  chains: [bscMainnet, bscTestnet],
  ssr: true,
}) as Config;
