import {
  createSmartAccountClient,
  type SmartAccountClient as BaseClient,
  type SmartContractAccount,
} from "@aa-sdk/core";
import { http } from "viem";
import { baseWonderTestnet } from "@/config/chains";
import provider, { RPC_URL } from "../provider";

export async function getSmartAccountClient(account: SmartContractAccount) {
  const client = await createSmartAccountClient({
    account,
    chain: baseWonderTestnet,
    transport: http(RPC_URL),
  });

  return client;
}

export default class SmartAccountClient {
  private client: BaseClient;

  constructor(account: SmartContractAccount) {
    this.client = createSmartAccountClient({
      account,
      chain: baseWonderTestnet,
      transport: http(RPC_URL),
    });
  }

  async getSmartAccount() {
    return this.client;
  }

  async getBalance() {
    const address = await this.client.account!.address;
    const balance = await provider.getBalance(address);
    console.log("[SmartAccountClient] getBalance:", balance);
    return await provider.getBalance(address);
  }
}
