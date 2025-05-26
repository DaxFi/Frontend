"use client";

import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import QrScanner from "@/components/ui/qrScanner";

export default function PayPage() {
  const t = useTranslations("pay");
  const router = useRouter();
  const [qrCode, setQrCode] = useState("");

  const handleSubmit = () => {
    if (!qrCode) return;
    router.push(qrCode);
  };

  useEffect(() => {
    if (!qrCode) return;

    try {
      const url = new URL(qrCode);
      const to = url.searchParams.get("to");
      const amount = url.searchParams.get("amount");

      if (to && amount) {
        router.push(`/confirm-transaction?to=${encodeURIComponent(to)}&amount=${amount}`);
      } else {
        console.warn("QR code missing required parameters");
      }
    } catch (err) {
      console.error("Invalid QR code scanned", err);
    }
  }, [qrCode]);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768; // TODO: Use a more robust mobile detection method

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow p-8 w-full max-w-xl">
        {/* Back & Title */}
        <div className="flex items-center mb-8">
          <button onClick={() => router.back()} className="mr-4">
            <FaArrowLeft />
          </button>
          <h1 className="text-2xl font-bold">{t("title")}</h1>
        </div>

        {/* QR or Camera */}
        <div className="flex justify-center mb-6">
          {isMobile && (
            <div className="w-60 h-60 bg-gray-900 rounded-xl flex items-center justify-center text-white">
              <QrScanner onScan={(code) => setQrCode(code)} />
            </div>
          )}
        </div>

        {/* Input */}
        <div className="mb-4">
          <label className="block font-bold mb-1">{t("pasteLabel")}</label>
          <input
            type="text"
            placeholder={t("placeholder")}
            value={qrCode}
            onChange={(e) => setQrCode(e.target.value)}
            className="w-full border rounded-md px-4 py-2"
          />
        </div>

        {/* Pay Button */}
        <Button
          className="w-full bg-teal-600 hover:bg-teal-700 text-white mt-4"
          onClick={handleSubmit}
        >
          {t("pay")}
        </Button>
      </div>
    </main>
  );
}
