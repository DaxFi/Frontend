"use client";

import { useRouter } from "next/navigation";
import { FaUser, FaDollarSign, FaArrowLeft } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { fetchHandleSuggestions, inferRecipientInputType } from "@/lib/utils";
import { useTheme } from "@/components/providers/appThemeProvider";

export default function SendPage() {
  const router = useRouter();
  const t = useTranslations("send");

  const messageRef = useRef<HTMLTextAreaElement>(null);

  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [isInvalidRecipient, setIsInvalidRecipient] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const { theme } = useTheme();
  const isDark = theme === "dark";

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
    <main
      className={`min-h-screen flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 ${isDark ? "bg-[#0D0E12] text-white" : "bg-gradient-to-br from-gray-50 to-gray-100 text-black"}`}
    >
      <div
        className={`w-full max-w-lg rounded-2xl shadow-xl p-8 ${isDark ? "bg-[#1C1F26]" : "bg-white"}`}
      >
        <button
          onClick={() => router.back()}
          className={`text-sm mb-6 flex items-center gap-1 cursor-pointer ${isDark ? "text-gray-400 hover:text-blue-400" : "text-gray-500 hover:text-blue-500"}`}
        >
          <FaArrowLeft size={14} /> {t("back")}
        </button>

        <h1
          className={`text-3xl font-bold text-center mb-8 ${isDark ? "text-white" : "text-gray-800"}`}
        >
          {t("sendFunds")}
        </h1>

        <form className="space-y-6">
          <div>
            <label
              className={`block text-sm font-semibold mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}
              htmlFor="to"
            >
              {t("to")}
            </label>
            <div className="relative">
              <span
                className={`absolute inset-y-0 left-0 flex items-center pl-3 ${isDark ? "text-gray-500" : "text-gray-400"}`}
              >
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
                className={`w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-200 focus:outline-none ${isDark ? `bg-[#0D0E12] text-white ${isInvalidRecipient ? "border-red-500" : "border-gray-700"}` : `bg-white text-black ${isInvalidRecipient ? "border-red-500" : "border-gray-300"}`}`}
              />

              {suggestions.length > 0 && (
                <ul
                  className={`absolute z-10 mt-1 w-full border rounded-md shadow-md max-h-48 overflow-auto ${isDark ? "bg-[#1C1F26] border-gray-700" : "bg-white border-gray-300"}`}
                >
                  {suggestions.map((handle) => (
                    <li
                      key={handle}
                      onClick={() => {
                        setRecipient(`@${handle}`);
                        setSuggestions([]);
                        setIsInvalidRecipient(false);
                      }}
                      className={`px-4 py-2 cursor-pointer ${isDark ? "hover:bg-gray-800" : "hover:bg-gray-100"}`}
                    >
                      {handle}
                    </li>
                  ))}
                </ul>
              )}
            </div>

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

          <div>
            <label
              className={`block text-sm font-semibold mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}
              htmlFor="amount"
            >
              {t("amount")}
            </label>
            <div className="relative">
              <span
                className={`absolute inset-y-0 left-0 flex items-center pl-3 ${isDark ? "text-gray-500" : "text-gray-400"}`}
              >
                <FaDollarSign />
              </span>
              <input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className={`w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-200 focus:outline-none ${isDark ? "bg-[#0D0E12] text-white border-gray-700" : "bg-white text-black border-gray-300"}`}
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

          <div>
            <label
              className={`block text-sm font-semibold mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}
              htmlFor="message"
            >
              {t("optionalMessage")}
            </label>
            <textarea
              id="message"
              ref={messageRef}
              placeholder={t("addNote")}
              rows={3}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-200 focus:outline-none ${isDark ? "bg-[#0D0E12] text-white border-gray-700" : "bg-white text-black border-gray-300"}`}
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
