"use client";

import { useRouter } from "next/navigation";
import { FaUser, FaDollarSign, FaArrowLeft } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { fetchHandleSuggestions } from "@/lib/utils";

export default function SendPage() {
  const router = useRouter();

  const t = useTranslations("send");

  const amountRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [recipient, setRecipient] = useState("");

  const handleSubmit = () => {
    const amount = amountRef.current?.value;
    const message = messageRef.current?.value;

    if (!recipient || !amount) {
      alert(t("noAmountOrRecipientError"));
      return;
    }

    const params = new URLSearchParams();
    params.set("recipient", recipient);
    params.set("amount", amount);
    params.set("message", message || "");
    router.push(`/confirm-transaction?${params.toString()}`);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-md p-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="text-sm text-gray-500 mb-6 flex items-center gap-1 cursor-pointer"
        >
          <FaArrowLeft size={14} /> {t("back")}
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
                onChange={async (e) => {
                  const val = e.target.value;
                  setRecipient(val);

                  if (val.startsWith("@")) {
                    const results = await fetchHandleSuggestions(val);
                    setSuggestions(results);
                  } else {
                    setSuggestions([]);
                  }
                }}
                placeholder={t("toPlaceholder")}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200 focus:outline-none"
              />
              {suggestions.length > 0 && (
                <ul className="mt-1 border border-gray-300 rounded-md bg-white shadow-md absolute z-10 w-full max-h-48 overflow-auto">
                  {suggestions.map((handle) => (
                    <li
                      key={handle}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setRecipient(handle);
                        setSuggestions([]);
                      }}
                    >
                      {handle}
                    </li>
                  ))}
                </ul>
              )}
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
                ref={amountRef}
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
              ref={messageRef}
              placeholder={t("addNote")}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200 focus:outline-none"
            />
          </div>

          <Button
            type="button"
            className="w-full bg-teal-600 hover:bg-teal-700 text-white"
            onClick={handleSubmit}
          >
            {t("reviewAndSend")}
          </Button>
        </form>
      </div>
    </main>
  );
}
