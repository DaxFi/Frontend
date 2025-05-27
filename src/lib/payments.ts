import { sendTransaction } from "@wonderchain/sdk";
import { type TransactionLike, parseEther } from "ethers";
import provider from "@/lib/provider";
import type { AlchemySigner } from "@account-kit/core";

export async function sendPayment({
  signer,
  to,
  amountEth,
}: {
  signer: AlchemySigner;
  to: string;
  message?: string;
  amountEth: string;
}) {
  if (!signer) {
    throw new Error("Signer is not available. Please ensure you are connected.");
  }

  const from = await signer.getAddress();

  const data: TransactionLike = {
    from,
    to,
    value: parseEther(amountEth).toString(),
  };

  const tx = await sendTransaction(provider, data, signer.signTypedData);

  console.log("debug: tx", tx);

  return tx;
}
