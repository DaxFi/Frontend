"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FaArrowLeft } from "react-icons/fa";
import { useTranslations } from "next-intl";

export default function RequestPage() {
  const router = useRouter();
  const t = useTranslations("request");

  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = new URLSearchParams({
      amount: parseFloat(amount).toFixed(2),
      message,
    }).toString();
    router.push(`/request/qr?${query}`);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="text-sm text-gray-500 mb-6 flex items-center gap-1 cursor-pointer hover:text-blue-500"
        >
          <FaArrowLeft size={14} />
          {t("back")}
        </button>

        {/* Header */}
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">{t("title")}</h1>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Amount Input */}
          <div>
            <label htmlFor="amount" className="block text-sm font-semibold mb-1 text-gray-700">
              {t("amount")}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                $
              </span>
              <input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={t("amountPlaceholder")}
                onBlur={(e) => {
                  const raw = e.target.value.trim();
                  if (raw === "") return;
                  const num = parseFloat(raw);
                  if (!isNaN(num)) {
                    e.target.value = num.toFixed(2);
                  } else {
                    e.target.value = "0.00";
                  }
                  setAmount(e.target.value);
                }}
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200 focus:outline-none bg-white"
              />
            </div>
          </div>

          {/* Optional Message */}
          <div>
            <label htmlFor="message" className="block text-sm font-semibold mb-1 text-gray-700">
              {t("message")}
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t("messagePlaceholder")}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200 focus:outline-none bg-white"
            />
          </div>

          {/* Submit */}
          <Button
            disabled={!(parseFloat(amount) >= 0.01)}
            type="submit"
            className="w-full bg-gradient-to-r from-[#005AE2] to-[#0074FF] font-semibold py-2 px-4 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110 transition"
          >
            {t("createRequest")}
          </Button>
        </form>
      </div>
    </main>
  );
}
