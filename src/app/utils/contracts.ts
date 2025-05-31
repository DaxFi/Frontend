import { sendTransaction } from "@wonderchain/sdk";
import { keccak256, parseEther, toUtf8Bytes, Interface, type TransactionLike } from "ethers";
import type { AlchemySigner } from "@account-kit/core";
import PendingClaimEthArtifact from "@/abi/PendingClaimETH.json";
import provider from "@/lib/provider";
import { Contract } from "zksync-ethers";

// TODO: Refactor entier file.
const CONTRACT_ADDRESS = "0x7e287B525ED8687927899D17DF3D23Eb3a86D281";

export async function sendPendingClaim({
  signer,
  recipientEmail,
  amountEth,
}: {
  signer: AlchemySigner;
  recipientEmail: string;
  amountEth: string;
}) {
  if (!signer) {
    throw new Error("Signer is not available.");
  }

  const from = await signer.getAddress();

  const iface = new Interface(PendingClaimEthArtifact.abi);
  const recipientHash = keccak256(toUtf8Bytes(recipientEmail));
  const encodedData = iface.encodeFunctionData("createPendingTransfer", [recipientHash]);

  const data: TransactionLike = {
    from,
    to: CONTRACT_ADDRESS,
    value: parseEther(amountEth).toString(),
    data: encodedData,
  };

  const tx = await sendTransaction(provider, data, signer.signTypedData);
  console.log("Pending claim TX:", tx);

  return tx;
}

export async function getPendingAmountForEmail(email?: string): Promise<string> {
  if (!email) return "0";

  const contract = new Contract(CONTRACT_ADDRESS, PendingClaimEthArtifact.abi, provider);

  const recipientHash = keccak256(toUtf8Bytes(email));

  const amount = await contract.getPendingAmount(recipientHash);
  console.log(amount);

  return amount.toString();
}

export async function claimFundsForEmail({
  signer,
  email,
  recipientAddress,
}: {
  signer: AlchemySigner;
  email: string;
  recipientAddress: string;
}) {
  if (!signer) {
    throw new Error("Signer is not available.");
  }

  const from = await signer.getAddress();

  const iface = new Interface(PendingClaimEthArtifact.abi);
  const recipientHash = keccak256(toUtf8Bytes(email));
  const encodedData = iface.encodeFunctionData("claimFunds", [recipientHash, recipientAddress]);

  const data: TransactionLike = {
    from,
    to: CONTRACT_ADDRESS,
    value: "0",
    data: encodedData,
  };

  const tx = await sendTransaction(provider, data, signer.signTypedData);
  console.log("Claim funds TX:", tx);

  return tx;
}
