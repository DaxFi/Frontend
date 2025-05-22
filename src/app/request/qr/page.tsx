"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FaArrowLeft, FaCheck } from "react-icons/fa";
import QRCode from "react-qr-code";
import { useState } from "react";

export default function ConfirmRequestPage() {
  const router = useRouter();
  const params = useSearchParams();

  const amount = params.get("amount") || "0";
  const message = params.get("message") || "";
  const recipient = "John Dutton";
  const requestLink = `https://daxfi.xyz/send?to=${encodeURIComponent(recipient)}&amount=${amount}&msg=${encodeURIComponent(message)}`;
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
          className="text-sm text-gray-500 hover:underline flex items-center gap-1"
        >
          <FaArrowLeft size={14} />
          Back
        </button>

        {/* Title */}
        <h1 className="text-2xl font-semibold">Request Funds</h1>
        <p className="text-sm text-gray-500">
          Show the QR code on your screen, copy and paste the code, or send the link to who is
          paying you.
        </p>

        {/* QR Code */}
        <div className="flex justify-center py-4">
          <QRCode value={requestLink} size={128} />
        </div>

        {/* Summary */}
        <div className="text-sm space-y-1">
          <p>
            <strong>Amount:</strong> ${amount}
          </p>
          <p>
            <strong>To:</strong> {recipient}
          </p>
          {message && (
            <p>
              <strong>Message:</strong> {message}
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <Button
            onClick={handleCopy}
            className={`w-full ${
              copied ? "bg-green-600" : "bg-teal-600"
            } hover:bg-teal-700 text-white`}
          >
            {/* classname margin left 8px: margi */}
            {copied ? <FaCheck className="mr-2" /> : null}
            {copied ? "  Copied!" : "Copy code"}
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
            Send Request
          </Button>
        </div>
      </div>
    </main>
  );
}
