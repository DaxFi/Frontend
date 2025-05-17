import { Provider } from "zksync-ethers";

export const RPC_URL =
  process.env.WONDER_RPC_URL || "https://rpc.testnet.wonderchain.org";
export default new Provider(RPC_URL);
