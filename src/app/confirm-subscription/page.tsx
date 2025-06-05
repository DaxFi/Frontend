"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTheme } from "@/components/providers/appThemeProvider";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { FaArrowLeft, FaTimes } from "react-icons/fa";

export default function ReviewSubscriptionPage() {
  const router = useRouter();
  const params = useSearchParams();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const creator = params.get("creator") || "@frenchwithmarie";
  const image = params.get("image") || "/france.png";
  const plan = params.get("plan") || "Monthly";
  const amount = params.get("amount") || "240.00";
  const nextDue = params.get("nextDue") || "Jul 11th";

  const bg = isDark ? "bg-[#0D0E12]" : "bg-gradient-to-br from-gray-50 to-gray-100";
  const card = isDark ? "bg-[#16181D]" : "bg-white";
  const text = isDark ? "text-white" : "text-gray-900";
  const subtext = "text-sm text-gray-400";

  return (
    <main className={`min-h-screen flex items-center justify-center ${bg} py-16 px-4`}>
      <div className={`w-full max-w-md ${card} rounded-2xl shadow-xl p-8`}>
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

        <h1 className={`text-2xl text-center font-bold mb-8 ${text}`}>Review Subscription</h1>

        {/* Creator Info */}
        <div className="flex flex-col items-center gap-2 mb-6">
          <Image src={image} alt="Creator" width={64} height={64} className="rounded-full" />
          <span className={`${text} font-semibold`}>{creator}</span>
        </div>

        <div className="space-y-4 text-sm">
          <DetailRow label="From" value="Me" isDark={isDark} />
          <DetailRow label="Plan" value={plan} isDark={isDark} />
          <DetailRow label="Amount" value={`$${amount}`} isDark={isDark} />
          <DetailRow label="Next Due" value={nextDue} isDark={isDark} />
          <DetailRow
            label="Message"
            value="Thank you for being the best teacher 😉"
            isDark={isDark}
          />
        </div>

        <Button
          className="w-full mt-8 bg-gradient-to-r from-[#005AE2] to-[#0074FF] font-semibold py-2 px-4 rounded-md transition hover:brightness-110"
          onClick={() => alert("Mock: Subscribed!")}
        >
          Confirm subscription
        </Button>
      </div>
    </main>
  );
}

function DetailRow({ label, value, isDark }: { label: string; value: string; isDark: boolean }) {
  return (
    <div className={`${isDark ? "border-b border-gray-700" : ""} flex justify-between pb-2`}>
      <span className={`${isDark ? "text-gray-400" : "text-gray-500"} font-medium`}>{label}</span>
      <span className={`${isDark ? "text-white" : "text-gray-900"} font-semibold`}>{value}</span>
    </div>
  );
}
