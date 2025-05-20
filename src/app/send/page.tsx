"use client";

import { useRouter } from "next/navigation";
import { FaUser, FaDollarSign } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { sendPayment } from "@/lib/payments";
import { useAccount } from "@account-kit/react";
import { convertUSDToEth } from "@/lib/utils";

export default function SendPage() {
  const router = useRouter();

  const [recipient, setRecipient] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const t = useTranslations("send");

  const { account } = useAccount({ type: "LightAccount" });

  const handleSend = async () => {
    console.log("Initiating transfer...");
    if (!account) {
      console.error("No account found");
      return;
    }
    await sendPayment({
      from: account,
      amountEth: convertUSDToEth(Number(amount)),
      message,
      to: recipient,
    })
      .then(() => {
        router.push("/status?state=success");
      })
      .catch((error) => {
        console.error("Transfer failed:", error);
        router.push("/status?state=error");
      });
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-md p-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="text-sm text-gray-500 mb-6 hover:underline"
        >
          ← {t("back")}
        </button>

        {/* Header */}
        <h1 className="text-2xl font-semibold text-center mb-8">{t("sendFunds")}</h1>

        <form className="space-y-6">
          {/* To */}
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="to">
              {t("to")}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <FaUser />
              </span>
              <input
                id="to"
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder={t("toPlaceholder")}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="amount">
              {t("amount")}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <FaDollarSign />
              </span>
              <input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="message">
              {t("optionalMessage")}
            </label>
            <textarea
              id="message"
              placeholder={t("addNote")}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200 focus:outline-none"
            />
          </div>

          <Button
            type="button"
            className="w-full bg-teal-600 hover:bg-teal-700 text-white"
            onClick={handleSend}
          >
            {t("reviewAndSend")}
          </Button>
        </form>
      </div>
    </main>
  );
}
