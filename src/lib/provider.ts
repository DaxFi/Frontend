import { Provider } from "zksync-ethers";

export const RPC_URL = process.env.WONDER_RPC_URL || "https://rpc.testnet.wonderchain.org";
const provider = new Provider(RPC_URL);
export default provider;
