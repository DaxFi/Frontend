"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FaArrowLeft, FaCheck, FaTimes } from "react-icons/fa";
import { useState } from "react";
import { useUser } from "@account-kit/react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/components/providers/authProvider";
import DynamicDaxfiQR from "@/components/ui/qr";
import { useTheme } from "@/components/providers/appThemeProvider";

export default function ConfirmRequestPage() {
  const router = useRouter();
  const params = useSearchParams();
  const t = useTranslations("qr");
  const user = useUser();
  const { handle } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://daxfi.xyz";
  const amount = params.get("amount") || "0";
  const message = params.get("message") || "";
  const recipient = user?.email;

  const requestLink = `${baseUrl}/confirm-transaction?recipient=${encodeURIComponent(
    recipient || "",
  )}&amount=${encodeURIComponent(amount)}&message=${encodeURIComponent(message)}`;

  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(requestLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main
      className={`min-h-screen flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 ${
        isDark ? "bg-[#0D0E12] text-white" : "bg-gradient-to-br from-gray-50 to-gray-100 text-black"
      }`}
    >
      <div
        className={`w-full max-w-md rounded-2xl shadow-xl p-8 text-center space-y-6 ${
          isDark ? "bg-[#1C1C1E]" : "bg-white"
        }`}
      >
        {/* Back */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => router.back()}
            className={`text-sm cursor-pointer flex items-center gap-1 hover:text-blue-500 ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          >
            <FaArrowLeft size={14} />
            Back
          </button>
          <button
            onClick={() => router.push("/dashboard")}
            className={`text-xl transition-colors cursor-pointer hover:text-blue-500 ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
            aria-label="Close"
          >
            <FaTimes size={15} />
          </button>
        </div>

        {/* Title */}
        <h1 className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-800"}`}>
          {t("title")}
        </h1>
        <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
          {t("instructions")}
        </p>

        {/* Branded QR */}
        <div className="flex justify-center py-2">
          <div
            className={`rounded-xl shadow-xl p-1 w-fit border ${
              isDark ? "bg-[#0D0E12] border-gray-700" : "bg-white border-gray-200"
            }`}
          >
            <DynamicDaxfiQR link={requestLink} />
          </div>
        </div>

        {/* Summary */}
        <div className={`text-sm space-y-1 ${isDark ? "text-gray-200" : "text-gray-800"}`}>
          <p>
            <strong>{t("amount")}:</strong> ${amount}
          </p>
          <p>
            <strong>{t("to")}:</strong> {handle}
          </p>
        </div>

        {/* Buttons */}
        <div className="space-y-3 pt-4">
          <Button
            onClick={handleCopy}
            className={`w-full font-semibold py-2 px-4 rounded-md transition flex items-center justify-center gap-2 ${
              copied
                ? "bg-zinc-800 text-white dark:bg-zinc-200 dark:text-black"
                : "bg-gradient-to-r from-[#005AE2] to-[#0074FF] text-white hover:brightness-110"
            }`}
          >
            {copied && <FaCheck />}
            {copied ? t("copied") : t("copy")}
          </Button>
          <Button
            variant="default"
            className="w-full bg-gradient-to-r from-[#005AE2] to-[#0074FF] font-semibold py-2 px-4 rounded-md transition"
            onClick={() => {
              const query = new URLSearchParams({
                amount: amount || "",
                message: message || "",
              }).toString();
              router.push(`/request/email?${query}`);
            }}
          >
            {t("send")}
          </Button>
        </div>
      </div>

      {/* Tailwind animation class */}
      <style>{`
        .animate-glow {
          animation: glowPulse 2s infinite ease-in-out;
        }
        @keyframes glowPulse {
          0%, 100% {
            box-shadow: 0 0 10px #1A6DFF, 0 0 30px #1A6DFF;
          }
          50% {
            box-shadow: 0 0 20px #1FC4F9, 0 0 40px #1FC4F9;
          }
        }
      `}</style>
    </main>
  );
}
