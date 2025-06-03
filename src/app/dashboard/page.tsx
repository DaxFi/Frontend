"use client";

import { useAuth } from "@/components/providers/authProvider";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import {
  FaDollarSign,
  FaPaperPlane,
  FaDownload,
  FaMoneyBill,
} from "react-icons/fa";
import { useSigner, useUser } from "@account-kit/react";
import { useEffect, useState } from "react";
import { createPublicClient, http } from "viem";
import { baseWonderTestnet } from "@/config/chains";
import { RPC_URL } from "@/lib/provider";
import {
  ParsedTransaction,
  formatEthToUSD,
  parseTransactions,
  truncate,
} from "@/lib/utils";
import Image from "next/image";

const BLOCK_EXPLORER_URL =
  "https://block-explorer.testnet.wonderchain.org/api?module=account&action=txlist&page=1&offset=10&sort=desc&endblock=99999999&startblock=0&address=";

export default function HomePage() {
  const router = useRouter();

  const t = useTranslations("dashboard");
  const { signOut } = useAuth();

  const signer = useSigner();
  const user = useUser();

  const [balance, setBalance] = useState<bigint | null>(null);
  const [transactions, setTransactions] = useState<ParsedTransaction[] | undefined>();

  const [selectedTx, setSelectedTx] = useState<ParsedTransaction | null>(null);

  const [showMenu, setShowMenu] = useState(false);

  const fetchTransactions = async (address: `0x${string}`) => {
    try {
      const response = await fetch(`${BLOCK_EXPLORER_URL}${address}`);
      if (!response.ok) throw new Error("Failed to fetch transactions");
      const data = await response.json();
      const parsedTransactions = await parseTransactions(data.result, address);
      console.log("TRANS: ", parsedTransactions);
      setTransactions(parsedTransactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      return [];
    }
  };

  useEffect(() => {
    const client = createPublicClient({
      chain: baseWonderTestnet,
      transport: http(RPC_URL),
    });

    (async () => {
      try {
        const address = await signer?.getAddress();
        if (signer) client.getBalance({ address: await signer.getAddress() }).then(setBalance);
        if (address) await fetchTransactions(address);
      } catch (error) {
        console.error("Failed to fetch balance:", error);
      }
    })();
  }, [user]);

  return (
    <main className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1
            className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r 
                from-blue-600 to-teal-400"
          >
            <Image src="/daxfi-logo-web.png" alt="DaxFi Logo" width={100} height={100} />
          </h1>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="w-10 h-10 rounded-full overflow-hidden border border-gray-300 cursor-pointer"
            >
              <Image src="/avatar-placeholder.png" alt="User Avatar" width={40} height={40} />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg text-sm text-gray-700 z-50 border">
                <button
                  onClick={signOut}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Balance */}
        <div className="bg-gray-50 p-6 rounded-2xl shadow-md text-center">
          {balance === null ? (
            <>
              <div className="w-6 h-6 mx-auto border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
              <p className="text-sm text-gray-400 mt-4">{t("fetchingBalance")}</p>
            </>
          ) : (
            <>
              <p className="text-sm text-gray-500">Balance</p>
              <h2 className="text-3xl font-bold text-gray-800">{formatEthToUSD(balance)}</h2>
              <p className="text-xs text-gray-400 mt-1">Instant Payments</p>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <ActionButton
            icon={<FaDollarSign size={20} />}
            label={t("addFunds")}
            onClick={() => {}}
            disabled
          />
          <ActionButton
            icon={<FaPaperPlane size={20} />}
            label={t("send")}
            onClick={() => router.push("/send")}
          />
          <ActionButton
            icon={<FaDownload size={20} />}
            label={t("request")}
            onClick={() => router.push("/request")}
          />
          <ActionButton
            icon={<FaMoneyBill size={20} />}
            label={t("withdraw")}
            onClick={() => {}}
            disabled // Disable for now
          />
        </div>

        {/* Transaction History */}
        <div className="bg-gray-50 rounded-2xl shadow-md p-4">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Transaction History</h3>
          {!transactions ? (
            <div className="animate-pulse space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <p className="text-sm text-gray-500">No recent transactions.</p>
          ) : (
            <ul className="space-y-4">
              {transactions.map((item) => (
                <li
                  key={item.hash}
                  onClick={() => setSelectedTx(item)}
                  className="flex items-center space-x-4 cursor-pointer hover:bg-gray-100 p-2 rounded-lg"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg">
                    {"💸"}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">
                      {item.direction === "out"
                        ? `Sent to @${item.to}`
                        : `Received from @${item.from}`}
                    </p>
                    <p className="text-xs text-gray-500">{item.date}</p>
                    {/* <span className="text-xs text-gray-500 mt-0.5">
                      {item.status === "Pending" ? "⏳ Pending" : item.status === "Success" ? "✅ Completed" : "❌ Failed"}
                    </span> */}
                  </div>
                  <div
                    className={`text-sm font-semibold ${
                      item.direction === "out" ? "text-red-500" : "text-green-600"
                    }`}
                  >
                    {item.direction === "out" ? "-" : "+"}
                    {item.value}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Invite & Earn */}
        <button className="w-full flex items-center justify-between px-4 py-3 mt-4 bg-blue-50 border border-blue-200 text-sm text-blue-700 rounded-xl">
          <span>Invite & Earn</span>
          <span>→</span>
        </button>

        {/* Logout */}
        {/* <div>
          <Button
            variant="outline"
            onClick={signOut}
            className="mt-6 text-red-600 border-red-600 hover:bg-red-50 w-full"
          >
            {t("logout")}
          </Button>
        </div> */}
      </div>
      {selectedTx && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl max-w-sm w-full shadow-lg space-y-4">
            <h3 className="text-lg font-bold">Transaction Details</h3>
            <p className="text-sm">
              <strong>Type:</strong> {selectedTx.direction === "out" ? "Sent" : "Received"}
            </p>
            <p className="text-sm">
              <strong>To:</strong> {truncate(selectedTx.to)}
            </p>
            <p className="text-sm">
              <strong>From:</strong> {truncate(selectedTx.from)}
            </p>
            <p className="text-sm">
              <strong>Amount:</strong> {selectedTx.value}
            </p>
            <p className="text-sm">
              <strong>Date:</strong> {selectedTx.date}
            </p>
            <p className="text-sm">
              <strong>Status:</strong>{" "}
              {selectedTx.status === "Success" && (
                <span className="text-green-600">✅ Completed</span>
              )}
              {selectedTx.status === "Pending" && (
                <span className="text-yellow-500">⏳ Pending</span>
              )}
              {selectedTx.status === "Failed" && <span className="text-red-500">❌ Failed</span>}
            </p>

            <div className="pt-4">
              <Button onClick={() => setSelectedTx(null)} className="w-full">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
      <footer className="text-center text-xs text-gray-400 mt-12 pb-6">
        © 2025 DaxFi. All rights reserved. Test Environment.
      </footer>
    </main>
  );
}

function ActionButton({
  icon,
  label,
  onClick,
  disabled = false,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex flex-col items-center justify-center p-4 rounded-xl shadow-sm transition-all text-sm font-medium space-y-2
        ${
          disabled
            ? "opacity-50 cursor-not-allowed bg-gray-100"
            : "bg-gradient-to-r from-[#005AE2] to-[#0074FF] text-white hover:shadow-lg hover:brightness-110 cursor-pointer"
        }`}
      title={
        label === "Top Up" && disabled ? "Coming soon — fiat cash-out via on-ramp partners." : ""
      }
    >
      <div className="text-xl">{icon}</div>
      <span>{label}</span>
    </button>
  );
}
