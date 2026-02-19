import { createConfig } from "ponder";
import { http } from "viem";
import { ERC20_ABI, JAGA_STAKE_ABI } from "./abis/StakeAbi";

export default createConfig({
  chains: {
    bscMainnet: {
      id: 56,
      rpc: http("https://bsc-dataseed.bnbchain.org"),
    },
    bscTestnet: {
      id: 97,
      rpc: http("https://bsc-testnet-dataseed.bnbchain.org"),
    },
  },
  contracts: {
    JagaStake: {
      chain: "bscTestnet",
      address: "0x0ba73ebe6da9Ce35340d696e00FCE64Ed4A2FAc3",
      abi: JAGA_STAKE_ABI,
      startBlock: 90470368,
    },
    JagaToken: {
      chain: "bscTestnet",
      address: "0xae7fc51CC770B23Bea3bA160fEb088467E37F000",
      abi: ERC20_ABI,
      startBlock: 90470368,
    },
    USDC: {
      chain: "bscTestnet",
      address: "0x32BC3202d410d4aE76C1f973517B13986Ac967cF",
      abi: ERC20_ABI,
      startBlock: 90470368,
    },
  },
});
