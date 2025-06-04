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
  FaSun,
  FaMoon,
  FaSyncAlt,
  FaQrcode,
} from "react-icons/fa";
import { useSigner, useUser } from "@account-kit/react";
import { useEffect, useState } from "react";
import { createPublicClient, http } from "viem";
import { baseWonderTestnet } from "@/config/chains";
import { RPC_URL } from "@/lib/provider";
import { ParsedTransaction, formatEthToUSD, parseTransactions, truncate } from "@/lib/utils";
import Image from "next/image";
import { useTheme } from "@/components/providers/appThemeProvider";

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

  const { theme, toggleTheme } = useTheme();
  const darkMode = theme === "dark";

  const mockSubscriptions = [
    { handle: "@filmtub", image: "/movie.png", description: "FilmClub+", nextPayment: "Aug 15" },
    {
      handle: "@frenchwithmarie",
      image: "/france.png",
      description: "French classes with Marie",
      nextPayment: "Aug 1",
    },
  ];

  const [selectedSubscription, setSelectedSubscription] = useState<
    (typeof mockSubscriptions)[0] | null
  >(null);

  const fetchTransactions = async (address: `0x${string}`) => {
    try {
      const response = await fetch(`${BLOCK_EXPLORER_URL}${address}`);
      if (!response.ok) throw new Error("Failed to fetch transactions");
      const data = await response.json();
      const parsedTransactions = await parseTransactions(data.result, address);
      setTransactions(parsedTransactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  useEffect(() => {
    const client = createPublicClient({ chain: baseWonderTestnet, transport: http(RPC_URL) });
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
    <main
      className={`${darkMode ? "bg-[#0D0E12] text-white" : "bg-white text-black"} min-h-screen py-6 px-4 sm:px-6 lg:px-8 font-sans`}
    >
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header with Logo, Avatar and Toggle */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">
            <Image
              src={darkMode ? "/daxfi-logo-web-white.png" : "/daxfi-logo-web.png"}
              alt="DaxFi Logo"
              width={100}
              height={100}
            />
          </h1>
          <div className="flex items-center gap-4">
            <button onClick={toggleTheme} className="text-xl cursor-pointer">
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="w-10 h-10 rounded-full overflow-hidden border border-gray-700 cursor-pointer"
              >
                <Image src="/avatar-placeholder.png" alt="User Avatar" width={40} height={40} />
              </button>
              {showMenu && (
                <div className="absolute right-0 mt-2 w-32 bg-[#1C1F26] rounded-md shadow-lg text-sm text-white z-50 border border-gray-700">
                  <button
                    onClick={signOut}
                    className="w-full text-left px-4 py-2 hover:bg-gray-800 cursor-pointer"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Balance card */}
        <div
          className={`${darkMode ? "bg-[#16181D]" : "bg-gray-50"} p-6 rounded-2xl shadow-md text-center`}
        >
          {balance === null ? (
            <>
              <div className="w-6 h-6 mx-auto border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin" />
              <p className="text-sm text-gray-500 mt-4">{t("fetchingBalance")}</p>
            </>
          ) : (
            <>
              <p className="text-sm text-gray-400">Balance</p>
              <h2 className={`${darkMode ? "text-white" : "text-gray-800"} text-3xl font-bold`}>
                {formatEthToUSD(balance)}
              </h2>
              <p className="text-xs text-gray-500 mt-1">Instant Payments</p>
            </>
          )}
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
          {/* Render disabled buttons first */}
          {[
            {
              icon: <FaDollarSign size={16} />,
              label: t("addFunds"),
              onClick: () => {},
              disabled: true,
            },
            {
              icon: <FaMoneyBill size={16} />,
              label: t("withdraw"),
              onClick: () => {},
              disabled: true,
            },
          ].map((btn, i) => (
            <ActionButton
              key={`disabled-${i}`}
              icon={btn.icon}
              label={btn.label}
              onClick={btn.onClick}
              disabled={btn.disabled}
            />
          ))}

          {/* Then render enabled buttons */}
          {[
            {
              icon: <FaPaperPlane size={16} />,
              label: t("send"),
              onClick: () => router.push("/send"),
            },
            {
              icon: <FaDownload size={16} />,
              label: t("request"),
              onClick: () => router.push("/request"),
            },
            {
              icon: <FaSyncAlt size={16} />,
              label: t("newSubscription"),
              onClick: () => router.push("/new-subscription"),
            },
            {
              icon: <FaQrcode size={16} />,
              label: t("scanQrCode"),
              onClick: () => router.push("/scan-qr"),
            },
          ].map((btn, i) => (
            <ActionButton
              key={`enabled-${i}`}
              icon={btn.icon}
              label={btn.label}
              onClick={btn.onClick}
            />
          ))}
        </div>

        {/* Subscriptions */}
        <div className={`${darkMode ? "bg-[#16181D]" : "bg-gray-50"} rounded-2xl shadow-md p-4`}>
          <h3 className={`${darkMode ? "text-white" : "text-gray-800"} text-lg font-semibold mb-4`}>
            Your Subscriptions
          </h3>
          <ul className={`${darkMode ? "divide-y divide-gray-800" : ""}`}>
            {mockSubscriptions.map((sub, i) => (
              <li
                key={i}
                onClick={() => setSelectedSubscription(sub)}
                className={`${darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"} cursor-pointer rounded-lg px-2 -mx-2`}
              >
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 text-sm">
                      {/* {i === 0 ? "👤" : "💵"} */}
                      <Image src={sub.image} alt="Subscription Icon" width={30} height={30} />
                    </div>
                    <div className="flex flex-col">
                      <span
                        className={`${darkMode ? "text-white" : "text-gray-900"} text-sm font-medium`}
                      >
                        {sub.handle}
                      </span>
                      <span className="text-xs text-gray-400">{sub.description}</span>
                    </div>
                  </div>
                  <div
                    className={`${darkMode ? "text-white" : "text-gray-800"} flex items-center gap-4 text-sm`}
                  >
                    <div className="flex flex-col text-right space-y-0.5">
                      <span className="text-xs text-gray-400">Next payment</span>
                      <span className="font-medium">{sub.nextPayment}</span>
                    </div>
                    <button className="text-sm font-semibold text-red-500 hover:underline cursor-pointer">
                      Cancel
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <p className="text-xs text-gray-500 pt-4 text-center">
            All payments are feeless and processed by DaxFi.
          </p>
        </div>

        {/* Transactions */}
        <div className={`${darkMode ? "bg-[#16181D]" : "bg-gray-50"} rounded-2xl shadow-md p-4`}>
          <h3 className={`${darkMode ? "text-white" : "text-gray-800"} text-lg font-medium mb-4`}>
            Transaction History
          </h3>
          {!transactions ? (
            <div className="animate-pulse space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-800 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-800 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <p className="text-sm text-gray-500">No recent transactions.</p>
          ) : (
            <ul className={`${darkMode ? "divide-y divide-gray-800" : ""}`}>
              {transactions.map((item) => (
                <li
                  key={item.hash}
                  onClick={() => setSelectedTx(item)}
                  className={`${darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"} flex items-center space-x-4 cursor-pointer p-2 rounded-lg`}
                >
                  <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-lg">
                    {"💸"}
                  </div>
                  <div className="flex-1">
                    <p
                      className={`${darkMode ? "text-white" : "text-gray-800"} text-sm font-medium`}
                    >
                      {item.direction === "out"
                        ? `Sent to @${item.to}`
                        : `Received from @${item.from}`}
                    </p>
                    <p className="text-xs text-gray-400">{item.date}</p>
                  </div>
                  <div
                    className={`text-sm font-semibold ${
                      item.direction === "out" ? "text-red-500" : "text-green-400"
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

        {/* Invite CTA */}
        {/* {`${darkMode ? "bg-[#0D0E12] text-white" : "bg-white text-black"} min-h-screen py-6 px-4 sm:px-6 lg:px-8 font-sans`} */}
        <button
          className={`${darkMode ? "bg-[#10141C] border-gray-700" : "bg-blue-50 border-blue-200"} w-full flex items-center justify-between px-4 py-3 mt-4 border  text-sm text-blue-400 rounded-xl`}
        >
          <span>Invite & Earn</span>
          <span>→</span>
        </button>
      </div>
      {selectedTx && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div
            className={`${darkMode ? "bg-[#1C1F26]" : "bg-white"} p-6 rounded-xl max-w-sm w-full shadow-lg space-y-4`}
          >
            <h3 className={`${darkMode ? "text-white" : ""} text-lg font-bold`}>
              Transaction Details
            </h3>
            <p className={`${darkMode ? "text-white" : ""} text-sm`}>
              <strong>Type:</strong> {selectedTx.direction === "out" ? "Sent" : "Received"}
            </p>
            <p className={`${darkMode ? "text-white" : ""} text-sm`}>
              <strong>To:</strong> {truncate(selectedTx.to)}
            </p>
            <p className={`${darkMode ? "text-white" : ""} text-sm`}>
              <strong>From:</strong> {truncate(selectedTx.from)}
            </p>
            <p className={`${darkMode ? "text-white" : ""} text-sm`}>
              <strong>Amount:</strong> {selectedTx.value}
            </p>
            <p className={`${darkMode ? "text-white" : ""} text-sm`}>
              <strong>Date:</strong> {selectedTx.date}
            </p>
            <p className="text-sm">
              <strong>Status:</strong>{" "}
              {selectedTx.status === "Success" && (
                <span className="text-green-400">✅ Completed</span>
              )}
              {selectedTx.status === "Pending" && (
                <span className="text-yellow-400">⏳ Pending</span>
              )}
              {selectedTx.status === "Failed" && <span className="text-red-400">❌ Failed</span>}
            </p>
            <div className="pt-4">
              <Button onClick={() => setSelectedTx(null)} className="w-full">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Subscription Details Modal */}
      {selectedSubscription && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div
            className={`${darkMode ? "bg-[#1C1F26]" : "bg-white"} p-6 rounded-xl max-w-sm w-full shadow-lg space-y-4`}
          >
            <h3 className={`${darkMode ? "text-white" : ""} text-lg font-bold`}>
              Subscription Details
            </h3>
            <p className={`${darkMode ? "text-white" : ""} text-sm`}>
              <strong>To:</strong> {selectedSubscription.handle}
            </p>
            <p className={`${darkMode ? "text-white" : ""} text-sm`}>
              <strong>Description:</strong> {selectedSubscription.description}
            </p>
            <p className={`${darkMode ? "text-white" : ""} text-sm`}>
              <strong>Next Payment:</strong> {selectedSubscription.nextPayment}
            </p>
            <p className="text-sm text-gray-400">
              This is your subscription. In the future, you will be able to manage, pause, or update
              your subscriptions.
            </p>
            <div className="pt-4">
              <Button onClick={() => setSelectedSubscription(null)} className="w-full">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="text-center text-xs text-gray-500 mt-12 pb-6">
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
      className={`flex flex-col items-center justify-center px-2 py-2 rounded-xl shadow-sm transition-all text-[10px] font-medium space-y-0.5
        ${
          disabled
            ? "opacity-50 cursor-not-allowed bg-gray-800 text-gray-500"
            : "bg-gradient-to-r from-[#005AE2] to-[#0074FF] text-white hover:shadow-lg hover:brightness-110 cursor-pointer"
        }`}
    >
      <div className="text-sm">{icon}</div>
      <span>{label}</span>
    </button>
  );
}
