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
      amount,
      message,
    }).toString();

    router.push(`/request/qr?${query}`);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="text-sm text-gray-500 mb-6 flex items-center cursor-pointer"
        >
          <FaArrowLeft size={14} className="mr-1" />
          {t("back")}
        </button>

        {/* Header */}
        <h1 className="text-2xl font-semibold text-center mb-8">{t("title")}</h1>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Amount Input */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium mb-1">
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
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200 focus:outline-none"
              />
            </div>
          </div>

          {/* Optional Message */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-1">
              {t("message")}
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t("messagePlaceholder")}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200 focus:outline-none"
            />
          </div>

          {/* Submit */}
          <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white">
            {t("createRequest")}
          </Button>
        </form>
      </div>
    </main>
  );
}
