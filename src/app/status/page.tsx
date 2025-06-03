"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

function TransactionStatusContent() {
  const router = useRouter();
  const params = useSearchParams();
  const state = params.get("state") || "success";
  const to = params.get("to");
  const amount = params.get("amount");

  const t = useTranslations("confirmation");

  const STATUS_MAP = {
    success: {
      icon: <FaCheckCircle className="text-green-500 text-5xl mb-4" />,
      title: t("successTitle"),
      message: t("successMessage", {
        amount: `$${amount!}`,
        recipient: to!,
      }),
      button: t("okButton"),
      buttonStyle: "bg-gradient-to-r from-[#005AE2] to-[#0074FF] hover:brightness-110 text-white",
    },
    error: {
      icon: <FaExclamationTriangle className="text-red-500 text-5xl mb-4" />,
      title: t("failedTitle"),
      message: t("failedMessage"),
      button: t("retryButton"),
      buttonStyle: "bg-red-600 hover:bg-red-700 text-white",
    },
  };

  const status = STATUS_MAP[state as keyof typeof STATUS_MAP] || STATUS_MAP.success;

  const handleClick = () => {
    if (state === "success") {
      router.push("/dashboard");
    } else {
      router.back();
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full text-center">
        <div className="flex justify-center">{status.icon}</div>
        <h1 className="text-2xl font-bold mb-2 text-gray-800">{status.title}</h1>
        <p className="text-sm text-gray-600 mb-6">{status.message}</p>
        <Button
          onClick={handleClick}
          className={`w-full font-semibold py-2 px-4 rounded-md transition ${status.buttonStyle}`}
        >
          {status.button}
        </Button>
      </div>
    </main>
  );
}

export default function TransactionStatusPage() {
  return (
    <Suspense fallback={<div className="text-center py-16">...</div>}>
      <TransactionStatusContent />
    </Suspense>
  );
}
