"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FaArrowLeft, FaCheck } from "react-icons/fa";
import { useState } from "react";
import { useUser } from "@account-kit/react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/components/providers/authProvider";
import DynamicDaxfiQR from "@/components/ui/qr";

export default function ConfirmRequestPage() {
  const router = useRouter();
  const params = useSearchParams();
  const t = useTranslations("qr");
  const user = useUser();
  const { handle } = useAuth();

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://daxfi.xyz";
  const amount = params.get("amount") || "0";
  const message = params.get("message") || "";
  const recipient = user?.email;

  const requestLink = `${baseUrl}/confirm-transaction?recipient=${recipient}&amount=${amount}&message=${message}`;

  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(requestLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center space-y-6">
        {/* Back */}
        <button
          onClick={() => router.back()}
          className="text-sm text-gray-500 flex items-center gap-1 cursor-pointer hover:text-blue-500"
        >
          <FaArrowLeft size={14} />
          {t("back")}
        </button>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-800">{t("title")}</h1>
        <p className="text-sm text-gray-500">{t("instructions")}</p>

        {/* Branded QR */}
        <div className="flex justify-center py-2">
          <div className="rounded-xl shadow-xl bg-white p-1 w-fit border border-gray-200">
            <DynamicDaxfiQR link={requestLink} />
          </div>
        </div>

        {/* Summary */}
        <div className="text-sm text-gray-800 space-y-1">
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
            className={`w-full bg-gradient-to-r from-[#005AE2] to-[#0074FF] font-semibold py-2 px-4 rounded-md transition ${
              copied ? "bg-green-600" : "bg-[#005AE2]"
            } text-white hover:brightness-110`}
          >
            {copied && <FaCheck className="mr-2" />}
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
