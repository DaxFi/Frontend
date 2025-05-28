import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { db } from "./firebase";

// Joins class names
export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

const ETH_PRICE_USD = 2560.27; // TODO: replace with live price

export function formatEthAmount(amount: bigint, decimals: number = 18): string {
  const factor = BigInt(10) ** BigInt(decimals);
  const integerPart = amount / factor;
  const fractionalPart = amount % factor;
  const fractionalStr = fractionalPart.toString().padStart(decimals, "0").replace(/0+$/, "");
  const formatted =
    fractionalStr.length > 0
      ? `${integerPart.toString()}.${fractionalStr}`
      : integerPart.toString();
  return `${formatted} ETH`;
}

export function formatEthToUSD(
  amount: bigint,
  ethPriceUSD: number = ETH_PRICE_USD,
  decimals: number = 18,
): string {
  const factor = BigInt(10) ** BigInt(decimals);
  const ethAmount = Number(amount) / Number(factor);
  const usdValue = ethAmount * ethPriceUSD;
  return `US$${usdValue.toFixed(2)}`;
}

export function convertUSDToEther(
  amount: number,
  ethPriceUSD: number = ETH_PRICE_USD,
  decimals: number = 18,
) {
  return (amount / ethPriceUSD).toFixed(decimals);
}

export function convertWeiToUSD(
  weiAmount: bigint,
  ethPriceUSD: number = ETH_PRICE_USD,
  decimals: number = 18,
): string {
  const factor = BigInt(10) ** BigInt(decimals);
  const ethAmount = Number(weiAmount) / Number(factor);
  const usdValue = ethAmount * ethPriceUSD;
  return `US$${usdValue.toFixed(2)}`;
}

export function inferRecipientInputType(input: string): "email" | "handle" | "address" {
  const trimmed = input.trim();

  if (/^0x[a-fA-F0-9]{40}$/.test(trimmed)) return "address";
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return "email";
  if (/^[a-zA-Z0-9_]{3,30}$/.test(trimmed)) return "handle";

  throw new Error("Invalid recipient format");
}

export function generateHandle(email?: string | null): string | null {
  if (!email) return null;

  const [local] = email.split("@");
  const base = local.toLowerCase().replace(/[^a-z0-9]/g, "");

  return base;
}

export async function fetchHandleSuggestions(input: string): Promise<string[]> {
  if (!input.startsWith("@")) return [];

  const handlePrefix = input.slice(1).toLowerCase();

  const q = query(
    collection(db, "users"),
    where("handle", ">=", handlePrefix),
    where("handle", "<=", handlePrefix + "\uf8ff"),
    limit(5),
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data().handle);
}

export async function resolveRecipientWalletAddress(input: string): Promise<`0x${string}`> {
  const type = inferRecipientInputType(input.trim());

  if (type === "address") {
    return input.trim() as `0x${string}`;
  }

  let q;

  if (type === "email") {
    q = query(collection(db, "users"), where("email", "==", input.toLowerCase()));
  } else if (type === "handle") {
    q = query(collection(db, "users"), where("handle", "==", input.toLowerCase()));
  }

  if (!q) {
    throw new Error("Invalid recipient input type");
  }

  const snapshot = await getDocs(q);
  const user = snapshot.docs[0]?.data();

  if (!user || !user.walletAddress) {
    throw new Error("Recipient not found");
  }

  return user.walletAddress;
}

export async function walletAddressToHandle(walletAddress: `0x${string}`): Promise<string | null> {
  const q = query(collection(db, "users"), where("walletAddress", "==", walletAddress));
  const snapshot = await getDocs(q);
  const user = snapshot.docs[0]?.data();
  return user ? user.handle : null;
}

export type ParsedTransaction = {
  hash: `0x${string}`;
  type: string;
  to: string;
  from: string;
  value: string;
  status: string;
  direction: "in" | "out";
  date: string;
};

async function parseTransaction(tx: any, userAddress: string): Promise<ParsedTransaction> {
  const isSender = tx.from.toLowerCase() === userAddress.toLowerCase();
  const isError = tx.isError !== "0" || tx.txreceipt_status !== "1";
  const timestamp = new Date(Number(tx.timeStamp) * 1000);

  return {
    hash: tx.hash,
    type: isSender ? "Sent" : "Received",
    to: (await walletAddressToHandle(tx.to)) || tx.to,
    from: (await walletAddressToHandle(tx.from)) || tx.from,
    value: convertWeiToUSD(tx.value),
    status: isError ? "Failed" : "Success",
    direction: isSender ? "out" : "in",
    date: timestamp.toLocaleDateString(),
  };
}

export async function parseTransactions(transactions: any[], userAddress: `0x${string}`) {
  const parsed = await Promise.all(transactions.map((tx) => parseTransaction(tx, userAddress)));
  return parsed;
}

export function truncate(str: string, length: number = 15, separator: string = "..."): string {
  if (str.length <= length) return str;
  return str.slice(0, length - separator.length) + separator;
}
