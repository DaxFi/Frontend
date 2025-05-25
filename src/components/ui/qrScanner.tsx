import { Html5Qrcode } from "html5-qrcode";
import { useEffect } from "react";

export default function QrScanner({ onScan }: { onScan: (result: string) => void }) {
  useEffect(() => {
    const scanner = new Html5Qrcode("qr-reader");

    scanner
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        (decodedText) => {
          scanner.stop().then(() => onScan(decodedText));
        },
        (error) => {
          console.warn("Scan error", error);
        },
      )
      .catch(console.error);

    return () => {
      scanner.stop().catch(console.error);
    };
  }, [onScan]);

  return <div id="qr-reader" style={{ width: "100%", height: "300px" }} />;
}
