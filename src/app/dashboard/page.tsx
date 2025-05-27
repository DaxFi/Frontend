"use client";

import { useAuth } from "@/components/providers/authProvider";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { FaDollarSign, FaPaperPlane, FaDownload, FaQrcode } from "react-icons/fa";
import { useSigner } from "@account-kit/react";
import { useEffect, useState } from "react";
import { createPublicClient, http } from "viem";
import { baseWonderTestnet } from "@/config/chains";
import { RPC_URL } from "@/lib/provider";
import { formatEthAmount, formatEthToUSD } from "@/lib/utils";

export default function HomePage() {
  const router = useRouter();

  const t = useTranslations("dashboard");
  const { signOut } = useAuth();

  const signer = useSigner();

  const [balance, setBalance] = useState<bigint | null>(null);

  useEffect(() => {
    console.log("debug: signer", signer);
    const client = createPublicClient({
      chain: baseWonderTestnet,
      transport: http(RPC_URL),
    });

    (async () => {
      const address = await signer?.getAddress();
      console.log("debug: address", address);
      if (signer) client.getBalance({ address: await signer.getAddress() }).then(setBalance);
    })();
  }, [signer]);

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
          {balance === null ? (
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="w-6 h-6 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
              <p className="text-sm text-gray-400 mt-4">{t("fetchingBalance")}</p>
            </div>
          ) : (
            <>
              <h2 className="text-4xl font-bold mb-2">{formatEthToUSD(balance)}</h2>
              <p className="text-sm text-gray-500">{formatEthAmount(balance)}</p>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <DashboardAction
            icon={<FaDollarSign size={20} />}
            label={t("addFunds")}
            onClick={() => {}}
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
          <DashboardAction icon={<FaQrcode size={20} />} label="Pay" onClick={() => {}} />
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
        <div>
          {/* Temporary logout button for testing */}
          <Button
            variant="outline"
            onClick={signOut}
            className="mt-6 text-red-600 border-red-600 hover:bg-red-50"
          >
            {t("logout")}
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
      className="bg-white rounded-xl shadow flex flex-col items-center justify-center py-6 hover:bg-gray-50 transition cursor-pointer"
    >
      <div className="text-2xl mb-2">{icon}</div>
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}
