import { Provider } from "zksync-ethers";

export const RPC_URL =
  process.env.NEXT_PUBLIC_WONDER_RPC_URL || "https://rpc.testnet.wonderchain.org";
const provider = new Provider(RPC_URL);
export default provider;
