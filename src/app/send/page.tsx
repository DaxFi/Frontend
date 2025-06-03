"use client";

import { useRouter } from "next/navigation";
import { FaUser, FaDollarSign, FaArrowLeft } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { fetchHandleSuggestions, inferRecipientInputType } from "@/lib/utils";

export default function SendPage() {
  const router = useRouter();
  const t = useTranslations("send");

  const messageRef = useRef<HTMLTextAreaElement>(null);

  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [isInvalidRecipient, setIsInvalidRecipient] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const normalizeHandle = (val: string) => (val.startsWith("@") ? val.slice(1) : val);

  const handleSubmit = async () => {
    const message = messageRef.current?.value;
    const isAmountValid = Number(amount) >= 0.01;
    const trimmed = recipient.trim();
    const normalizedHandle = normalizeHandle(trimmed);

    let isValidRecipient = false;

    try {
      const inputType = inferRecipientInputType(normalizedHandle);
      if (inputType === "handle") {
        const results = await fetchHandleSuggestions(`@${normalizedHandle}`);
        isValidRecipient = results.includes(normalizedHandle);
      } else {
        isValidRecipient = true;
      }
    } catch {
      isValidRecipient = false;
    }

    setIsInvalidRecipient(!isValidRecipient);

    if (!isAmountValid || !isValidRecipient) return;

    const params = new URLSearchParams();
    params.set("recipient", normalizedHandle);
    params.set("amount", amount);
    params.set("message", message || "");
    router.push(`/confirm-transaction?${params.toString()}`);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="text-sm text-gray-500 mb-6 flex items-center gap-1 cursor-pointer hover:text-blue-500"
        >
          <FaArrowLeft size={14} /> {t("back")}
        </button>

        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">{t("sendFunds")}</h1>

        <form className="space-y-6">
          {/* To */}
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700" htmlFor="to">
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
                  setIsInvalidRecipient(false);
                  if (val.length >= 3) {
                    const query = val.startsWith("@") ? val : `@${val}`;
                    const res = await fetchHandleSuggestions(query);
                    setSuggestions(res);
                  } else {
                    setSuggestions([]);
                  }
                }}
                placeholder={t("toPlaceholder")}
                className={`w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-200 focus:outline-none bg-white ${
                  isInvalidRecipient ? "border-red-500" : "border-gray-300"
                }`}
              />

              {/* Suggestions */}
              {suggestions.length > 0 && (
                <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-md max-h-48 overflow-auto">
                  {suggestions.map((handle) => (
                    <li
                      key={handle}
                      onClick={() => {
                        setRecipient(`@${handle}`);
                        setSuggestions([]);
                        setIsInvalidRecipient(false);
                      }}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {handle}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Error */}
            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                isInvalidRecipient
                  ? "max-h-10 opacity-100 translate-y-0"
                  : "max-h-0 opacity-0 -translate-y-1"
              }`}
            >
              <p className="text-sm text-red-700 mt-1">{t("handleNotFoundMessage")}</p>
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700" htmlFor="amount">
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
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200 focus:outline-none bg-white"
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
              />
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700" htmlFor="message">
              {t("optionalMessage")}
            </label>
            <textarea
              id="message"
              ref={messageRef}
              placeholder={t("addNote")}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200 focus:outline-none bg-white"
            />
          </div>

          <Button
            type="button"
            disabled={!recipient || Number(amount) < 0.01}
            className="w-full bg-gradient-to-r from-[#005AE2] to-[#0074FF] font-semibold py-2 px-4 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110 transition"
            onClick={handleSubmit}
          >
            {t("reviewAndSend")}
          </Button>
        </form>
      </div>
    </main>
  );
}
