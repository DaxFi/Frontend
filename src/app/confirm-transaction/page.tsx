"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { sendPayment } from "@/lib/payments";
import { convertUSDToEther, isOnDaxFi, resolveRecipientWalletAddress } from "@/lib/utils";
import { useSigner, useUser } from "@account-kit/react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { sendPendingClaim } from "@/app/utils/contracts";

// TODO: Refactor isOnDaxFi and Pending Claim logic
export default function ConfirmSendPage() {
  const router = useRouter();
  const t = useTranslations("confirmTransaction");
  const [isSending, setIsSending] = useState(false);

  const params = useSearchParams();
  const { recipient, amount, message } = Object.fromEntries(params.entries());

  const signer = useSigner();
  const user = useUser();

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

        // TODO: Replace this for their actual name.
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
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
        <h1 className="text-3xl font-bold mb-10 text-gray-800">{t("confirmPayment")}</h1>

        <div className="text-left space-y-4 mb-10 text-sm">
          <InfoRow label={t("to")} value={recipient} />
          <InfoRow label={t("amount")} value={`$${amount}`} />
          <InfoRow label={t("fees")} value="$0.00" />
        </div>

        <div className="space-y-3">
          <Button
            onClick={handleConfirm}
            disabled={isSending}
            className="w-full bg-gradient-to-r from-[#005AE2] to-[#0074FF] font-semibold py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110 transition"
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
            className="w-full text-gray-700 border-gray-300"
          >
            {t("cancel")}
          </Button>
        </div>
      </div>
    </main>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500 font-medium">{label}</span>
      <span className="text-gray-900 font-semibold">{value}</span>
    </div>
  );
}
