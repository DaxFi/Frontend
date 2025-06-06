import { defineChain } from "viem";
import { defineAlchemyChain } from "@account-kit/infra";

export const baseWonderTestnet = defineChain({
  id: 96371,
  name: "Wonder Chain Testnet",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["/api/wonder-rpc"],
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

export const wonderTestnetAlchemy = defineAlchemyChain({
  chain: {
    ...baseWonderTestnet,
    rpcUrls: {
      ...baseWonderTestnet.rpcUrls,
    },
  },
  rpcBaseUrl: "/api/wonder-rpc",
});
