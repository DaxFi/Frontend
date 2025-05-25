"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export default function ConfirmSendPage() {
  const router = useRouter();

  const t = useTranslations("confirmTransaction");

  const params = useSearchParams();
  const { to, amount } = Object.fromEntries(params.entries());

  const handleConfirm = () => {
    router.push(`/status?state=success&to=${to}&amount=${amount}`);
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center bg-gradient-to-br 
        from-gray-50 to-gray-100 py-16 px-4 sm:px-6 lg:px-8"
    >
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8 text-center">
        <h1 className="text-2xl font-semibold mb-8">{t("confirmPayment")}</h1>

        <div className="text-left space-y-4 mb-8">
          <InfoRow label={t("to")} value={to} />
          <InfoRow label={t("amount")} value={`$${amount}`} />
          <InfoRow label={t("fees")} value="$0.45" />
        </div>

        <div className="space-y-3">
          <Button
            onClick={handleConfirm}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {t("confirm")}
          </Button>
          <Button variant="outline" onClick={handleCancel} className="w-full">
            {t("cancel")}
          </Button>
        </div>
      </div>
    </main>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-600 font-medium">{label}</span>
      <span className="text-gray-800">{value}</span>
    </div>
  );
}
