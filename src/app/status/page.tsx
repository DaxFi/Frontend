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
    },
    error: {
      icon: <FaExclamationTriangle className="text-red-500 text-5xl mb-4" />,
      title: t("failedTitle"),
      message: t("failedMessage"),
      button: t("retryButton"),
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
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-sm w-full text-center">
        <div className="flex justify-center">{status.icon}</div>
        <h1 className="text-xl font-semibold mb-2">{status.title}</h1>
        <p className="text-sm text-gray-600 mb-6">{status.message}</p>
        <Button
          onClick={handleClick}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
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
      {" "}
      {/* TODO: Loading state */}
      <TransactionStatusContent />
    </Suspense>
  );
}
