"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useUser } from "@account-kit/react";
import { FaArrowLeft, FaTimes } from "react-icons/fa";
import { useAuth } from "@/components/providers/authProvider";
import { useTranslations } from "next-intl";
import { useTheme } from "@/components/providers/appThemeProvider";

export default function RequestEmailPage() {
  const router = useRouter();
  const params = useSearchParams();
  const t = useTranslations("requestEmail");
  const { theme } = useTheme();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const amount = params.get("amount");
  const message = params.get("message");

  const user = useUser();
  const { handle } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || isNaN(Number(amount))) {
      alert("Invalid amount");
      return;
    }

    setLoading(true);

    try {
      if (!user) return;
      await addDoc(collection(db, "requests"), {
        amount: Number(amount).toFixed(2),
        message: message || "",
        requesterEmail: user.email,
        requesteeEmail: email,
        requesterName: handle,
        createdAt: serverTimestamp(),
      });

      setShowModal(true);
    } catch (err) {
      console.error("Firestore error:", err);
      alert("Failed to send request link.");
    } finally {
      setLoading(false);
    }
  };

  const isDark = theme === "dark";

  return (
    <main
      className={`min-h-screen flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 ${
        isDark ? "bg-[#0D0E12] text-white" : "bg-gradient-to-br from-gray-50 to-gray-100 text-black"
      }`}
    >
      <div
        className={`w-full max-w-md rounded-xl shadow-md p-8 relative ${
          isDark ? "bg-zinc-900 text-white" : "bg-white text-black"
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => router.back()}
            className={`text-sm cursor-pointer flex items-center gap-1 hover:text-blue-500 ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          >
            <FaArrowLeft size={14} />
            {t("back")}
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

        <h1 className="text-2xl font-semibold text-center mb-8">{t("title")}</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className={`block text-sm font-medium mb-1 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {t("emailLabel")}
            </label>
            <input
              id="email"
              type="email"
              placeholder={t("emailPlaceholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-200 focus:outline-none ${
                isDark
                  ? "bg-zinc-800 text-white border-gray-600 placeholder-gray-400"
                  : "bg-white border-gray-300"
              }`}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-[#005AE2] to-[#0074FF] font-semibold py-2 px-4 rounded-md transition hover:brightness-110"
            disabled={loading}
          >
            {loading ? t("sending") : t("submit")}
          </Button>
        </form>

        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl shadow-lg text-center w-full max-w-sm mx-4">
              <h2 className="text-xl font-semibold mb-2">{t("modalTitle")}</h2>
              <p className="text-gray-600 mb-4">
                {t("modalBody")} <strong>{email}</strong>.
              </p>
              <Button
                className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                onClick={() => router.push("/dashboard")}
              >
                {t("returnButton")}
              </Button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
