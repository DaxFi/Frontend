"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { sendPayment } from "@/lib/payments";
import { convertUSDToEther, resolveRecipientWalletAddress } from "@/lib/utils";
import { useSigner, useUser } from "@account-kit/react";
import { db } from "@/lib/firebase";
import { collection, addDoc, query, getDocs, where, serverTimestamp } from "firebase/firestore";
import { sendPendingClaim } from "@/app/utils/contracts";
import { useTheme } from "@/components/providers/appThemeProvider";

export default function ConfirmSendPage() {
  const router = useRouter();
  const t = useTranslations("confirmTransaction");
  const [isSending, setIsSending] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const params = useSearchParams();
  const { recipient, amount, message } = Object.fromEntries(params.entries());

  const signer = useSigner();
  const user = useUser();

  const isOnDaxFi = async (recipientEmail: string): Promise<boolean> => {
    const q = query(collection(db, "users"), where("email", "==", recipientEmail));
    const snapshot = await getDocs(q);
    const userData = snapshot.docs[0]?.data();
    return userData !== undefined;
  };

  const handleConfirm = async () => {
    setIsSending(true);
    try {
      if (!signer) {
        console.error("Signer not available");
        setIsSending(false);
        router.push(`/status?state=error`);
        return;
      }
      if (await isOnDaxFi(recipient)) {
        const recipientAddress = await resolveRecipientWalletAddress(recipient);
        await sendPayment({
          signer,
          to: recipientAddress,
          message,
          amountEth: convertUSDToEther(Number(amount)).toString(),
        });
      } else {
        const tx = await sendPendingClaim({
          signer,
          recipientEmail: recipient,
          amountEth: convertUSDToEther(Number(amount)).toString(),
        });

        const senderUsername = user?.email ? user.email.split("@")[0] : "";
        await addDoc(collection(db, "pendingTransfers"), {
          pendingTransactionHash: tx.hash,
          successTransactionHash: null,
          recipientEmail: recipient,
          senderName: senderUsername,
          senderWallet: await signer.getAddress(),
          recipientWallet: null,
          amount: amount,
          message: message,
          createdAt: serverTimestamp(),
          claimed: false,
        });
      }
      router.push(`/status?state=success&to=${recipient}&amount=${amount}`);
    } catch (error) {
      setIsSending(false);
      console.error("Transaction failed:", error);
      router.push(`/status?state=error`);
    }
  };

  const handleCancel = () => {
    router.push("/dashboard");
  };

  return (
    <main
      className={`min-h-screen flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 ${
        isDark ? "bg-[#0D0E12] text-white" : "bg-gradient-to-br from-gray-50 to-gray-100 text-black"
      }`}
    >
      <div
        className={`w-full max-w-md rounded-2xl shadow-xl p-8 text-center ${isDark ? "bg-[#1A1B1F]" : "bg-white"}`}
      >
        <h1 className={`text-2xl font-bold mb-10 ${isDark ? "text-white" : "text-gray-800"}`}>
          {t("confirmPayment")}
        </h1>

        <div className="text-left space-y-4 mb-10 text-sm">
          <InfoRow label={t("to")} value={recipient} isDark={isDark} />
          <InfoRow label={t("amount")} value={`$${amount}`} isDark={isDark} />
          <InfoRow label={t("fees")} value="$0.00" isDark={isDark} />
        </div>

        <div className="space-y-3">
          <Button
            onClick={handleConfirm}
            disabled={isSending}
            className="w-full bg-gradient-to-r from-[#005AE2] to-[#0074FF] font-semibold py-2 px-4 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110 transition"
          >
            {isSending ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            ) : (
              t("confirm")
            )}
          </Button>

          <Button
            variant="outline"
            onClick={handleCancel}
            className={`w-full border font-medium ${
              isDark
                ? "text-white border-gray-600 hover:bg-gray-800"
                : "text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            {t("cancel")}
          </Button>
        </div>
      </div>
    </main>
  );
}

function InfoRow({ label, value, isDark }: { label: string; value: string; isDark?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className={`${isDark ? "text-gray-400" : "text-gray-500"} font-medium`}>{label}</span>
      <span className={`${isDark ? "text-white" : "text-gray-900"} font-semibold`}>{value}</span>
    </div>
  );
}
