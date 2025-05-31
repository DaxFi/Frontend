"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FaArrowLeft, FaCheck } from "react-icons/fa";
import QRCode from "react-qr-code";
import { useState } from "react";
import { useUser } from "@account-kit/react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/components/providers/authProvider";

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
  const requestLink = `${baseUrl}/confirm-transaction?recipient=${handle || recipient}&amount=${amount}&message=${message}`;
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(requestLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8 text-center space-y-6">
        {/* Back */}
        <button
          onClick={() => router.back()}
          className="text-sm text-gray-500 flex items-center gap-1 cursor-pointer"
        >
          <FaArrowLeft size={14} />
          {t("back")}
        </button>

        {/* Title */}
        <h1 className="text-2xl font-semibold">{t("title")}</h1>
        <p className="text-sm text-gray-500">{t("instructions")}</p>

        {/* QR Code */}
        <div className="flex justify-center py-2">
          <QRCode value={requestLink} size={128} />
        </div>

        {/* Summary */}
        <div className="flex justify-center w-[128px] mx-auto mb-8">
          <div className="text-sm space-y-1 text-left">
            <p>
              <strong>{t("amount")}:</strong> ${amount}
            </p>
            <p>
              <strong>{t("to")}:</strong> {handle}
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <Button
            onClick={handleCopy}
            className={`w-full ${copied ? "bg-green-600" : "bg-teal-600"} hover:bg-teal-700 text-white`}
          >
            {copied && <FaCheck className="mr-2" />}
            {copied ? t("copied") : t("copy")}
          </Button>

          <Button
            variant="default"
            className="w-full bg-teal-600 hover:bg-teal-700 text-white"
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
    </main>
  );
}
