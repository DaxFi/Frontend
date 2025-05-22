import { parseEther } from "ethers";
import { Contract } from "zksync-ethers";
import paymentsAbi from "@/abi/payments.json";
import { type AlchemySigner, type LightAccount } from "@account-kit/core";
import { createSmartAccountClient } from "@aa-sdk/core";
import { wonderTestnetAlchemy } from "@/config/chains";
import { http } from "viem";
import { RPC_URL } from "./provider";

const CONTRACT_ADDRESS = "0xcD7b8b601eD648eaDAcCd272A0bAdC34A018Fd6c";

export async function sendPayment({
  from,
  to,
  message,
  amountEth,
}: {
  from: LightAccount<AlchemySigner>;
  to: string;
  message: string;
  amountEth: string;
}) {
  const contract = new Contract(CONTRACT_ADDRESS, paymentsAbi.abi);

  const data = contract.interface.encodeFunctionData("sendPayment", [to, message]) as `0x${string}`;

  console.log("debug: data", data);
  console.log("debug: from", from);
  console.log("debug: to", to);
  console.log("debug: message", message);
  console.log("debug: amount", amountEth);
  console.log("debug: contract", contract);

  const client = await createSmartAccountClient({
    chain: wonderTestnetAlchemy,
    transport: http(RPC_URL),
    account: from,
  });

  const tx = await client.sendUserOperation({
    uo: {
      target: CONTRACT_ADDRESS,
      data,
      value: parseEther(amountEth),
    },
  });

  console.log("debug: tx", tx);
  console.log("debug: client", client);

  return tx;
}
