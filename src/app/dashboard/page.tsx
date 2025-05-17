"use client";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { FaDollarSign, FaPaperPlane, FaDownload } from "react-icons/fa";

export default function HomePage() {
  const router = useRouter();

  const t = useTranslations("dashboard");

  return (
    <main
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-16 px-4 sm:px-6 
        lg:px-8"
    >
      <div className="max-w-3xl mx-auto">
        {/* Logo */}
        <div className="mb-10">
          <h1
            className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r 
                from-blue-600 to-teal-400"
          >
            DaxFi
          </h1>
        </div>

        {/* Balance */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-2">US$1,024</h2>
          <p className="text-sm text-gray-500">wUSDC ≈ 1 USD</p>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          <DashboardAction
            icon={<FaDollarSign size={20} />}
            label={t("addFunds")}
            onClick={() => router.push("/add")}
          />
          <DashboardAction
            icon={<FaPaperPlane size={20} />}
            label={t("send")}
            onClick={() => router.push("/send")}
          />
          <DashboardAction
            icon={<FaDownload size={20} />}
            label={t("request")}
            onClick={() => router.push("/request")}
          />
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow p-6 text-center">
          <div className="text-3xl text-gray-400 mb-4">📥</div>
          <h3 className="text-lg font-semibold mb-1">{t("recentActivity")}</h3>
          <p className="text-sm text-gray-500 mb-4">{t("noRecentActivity")}</p>
          <Button
            variant="outline"
            onClick={() => router.push("/send")}
            className="text-blue-600 border-blue-600 hover:bg-blue-50"
          >
            {t("sendFirstTransfer")}
          </Button>
        </div>
      </div>
    </main>
  );
}

function DashboardAction({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-xl shadow flex flex-col items-center justify-center py-6 hover:bg-gray-50 transition"
    >
      <div className="text-2xl mb-2">{icon}</div>
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}
