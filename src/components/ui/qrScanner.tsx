// components/QrScanner.tsx
"use client";

import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect } from "react";

export default function QrScanner({ onScan }: { onScan: (result: string) => void }) {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      },
      false,
    );

    scanner.render(
      (decodedText) => {
        scanner.clear().then(() => onScan(decodedText));
      },
      (error) => {
        console.error("QR code scan error:", error);
      },
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, [onScan]);

  return <div id="qr-reader" className="w-full h-full" />;
}
