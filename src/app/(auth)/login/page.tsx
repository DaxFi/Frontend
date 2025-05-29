"use client";

import { useAuth } from "@/components/providers/authProvider";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { FaGoogle, FaEnvelope } from "react-icons/fa";

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();

  const t = useTranslations("login");

  const handleLogin = () => {
    router.push("/dashboard");
  };

  return (
    <main
      className="h-screen flex items-center justify-center bg-gradient-to-br 
        from-gray-50 to-gray-100"
    >
      <div className="max-w-md bg-white rounded-xl shadow-md p-8 text-center">
        <h1
          className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r 
            from-blue-600 to-teal-400 mb-4"
        >
          DaxFi
        </h1>
        <p className="text-lg font-semibold mb-1">{t("title")}</p>
        <p className="text-sm text-gray-500 mb-8">{t("subtitle")}</p>

        <div className="flex flex-col gap-4">
          <Button
            onClick={() => signIn?.("google")}
            variant="default"
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center 
                justify-center gap-2"
          >
            <FaGoogle />
            {t("loginWithGoogle")}
          </Button>

          <Button
            onClick={handleLogin}
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
