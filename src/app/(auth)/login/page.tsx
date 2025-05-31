"use client";

import { useAuth } from "@/components/providers/authProvider";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { FaGoogle, FaEnvelope, FaSpinner } from "react-icons/fa";

export default function LoginPage() {
  const router = useRouter();
  const { signIn, user, isLoading } = useAuth();
  const t = useTranslations("login");

  if (isLoading || user) {
    return (
      <main className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <FaSpinner className="animate-spin h-8 w-8 text-gray-500" />
      </main>
    );
  }

  return (
    <main className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-md bg-white rounded-xl shadow-md p-8 text-center">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r mb-6">
          <Image
            src="/daxfi-logo-web.png"
            alt="DaxFi Logo"
            width={150}
            height={150}
            className="mx-auto"
          />
        </h1>
        <p className="text-lg font-semibold mb-1">{t("title")}</p>
        <p className="text-sm text-gray-500 mb-8">{t("subtitle")}</p>

        <div className="flex flex-col gap-4">
          <Button
            onClick={() => signIn?.("google")}
            variant="default"
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
          >
            <FaGoogle />
            {t("loginWithGoogle")}
          </Button>

          <Button
            onClick={() => {}}
            variant="outline"
            className="flex items-center justify-center gap-2"
            disabled
          >
            <FaEnvelope />
            {t("loginWithEmail")}
          </Button>
        </div>
      </div>
    </main>
  );
}
