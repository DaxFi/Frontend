import { sendTransaction } from "@wonderchain/sdk";
import { Contract, type TransactionLike, parseEther } from "ethers";
import provider from "@/lib/provider";
import paymentsAbi from "@/abi/payments.json";
import { type AlchemySigner } from "@account-kit/core";

const CONTRACT_ADDRESS = "0xaf53c48a4eba2C5C4c8f41f26cB1bA127308847F";

export async function sendPayment({
  signer,
  to,
  message,
  amountEth,
}: {
  signer: AlchemySigner;
  to: string;
  message: string;
  amountEth: string;
}) {
  console.log("debug: sendPayment called with", {
    to,
    message,
    amountEth,
  });

  console.log("debug: signer", signer);

  if (!signer) {
    throw new Error("Signer is not available. Please ensure you are connected.");
  }

  console.log("debug: signer", signer);

  const contract = new Contract(CONTRACT_ADDRESS, paymentsAbi.abi);

  console.log("debug: contract", contract);

  console.log("user address", await signer.getAddress());

  const address = await signer.getAddress();

  console.log("debug: parseEther", parseEther(amountEth));

  const data: TransactionLike = {
    from: address,
    to,
    value: parseEther(amountEth),
    data: "0x",
  };

  console.log("debug: data", data);

  const tx = await sendTransaction(provider, data, signer.signTypedData);

  console.log("debug: tx", tx);

  return tx;
}
