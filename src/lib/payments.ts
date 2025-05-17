import { Contract, parseEther } from "ethers";
import { Provider, Wallet } from "zksync-ethers";
import paymentsAbi from "@/abi/payments.json";
import provider from "./provider";

const CONTRACT_ADDRESS = "0xaf53c48a4eba2C5C4c8f41f26cB1bA127308847F";

async function getPaymentsContract(signerOrProvider?: Wallet | Provider) {
  const connected = signerOrProvider || provider;

  const contract = new Contract(CONTRACT_ADDRESS, paymentsAbi.abi, connected);

  return contract;
}

export async function sendPayment({
  signer,
  to,
  message,
  amountEth,
}: {
  signer: Wallet;
  to: string;
  message: string;
  amountEth: string;
}) {
  const contract = await getPaymentsContract(signer);

  const tx = await contract.sendPayment(to, message, {
    value: parseEther(amountEth),
  });

  console.log("[Tx] Sent:", tx.hash);

  const receipt = await tx.wait();

  return receipt;
}
