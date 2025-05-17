import { defineChain } from "viem";

export const wonderTestnet = defineChain({
  id: 96371,
  name: "Wonder Chain Testnet",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["http://rpc.testnet.wonderchain.org/"],
    },
  },
  blockExplorers: {
    default: {
      name: "Wonder Explorer",
      url: "https://explorer.testnet.wonderchain.org/",
    },
  },
  testnet: true,
});
