"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/components/providers/appThemeProvider";
import { BrowserMultiFormatReader } from "@zxing/library";

export default function ScanQRPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    codeReader
      .decodeFromVideoDevice(null, videoRef.current!, (result) => {
        if (result) {
          try {
            const url = new URL(result.getText());
            const path = url.pathname;
            const params = url.search;
            if (path.includes("/confirm-subscription"))
              router.push(`/confirm-subscription${params}`);
            else router.push(`/confirm-transaction${params}`);
          } catch {
            alert("Invalid QR code");
          }
        }
      })
      .catch(console.error);

    return () => {
      codeReader.reset();
    };
  }, [router]);

  return (
    <main
      className={`min-h-screen flex items-center justify-center ${isDark ? "bg-black text-white" : "bg-white text-black"}`}
    >
      <div className="text-center space-y-4">
        <h1 className="text-xl font-bold">Scan a QR Code</h1>
        <video
          ref={videoRef}
          className="rounded-xl shadow-md border w-80 h-80"
          autoPlay
          muted
          playsInline
        />
      </div>
    </main>
  );
}
