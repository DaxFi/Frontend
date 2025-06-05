"use client";

import { useEffect, useRef } from "react";
import QRCodeStyling from "qr-code-styling";

export default function DynamicDaxfiQR({ link }: { link: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const qrCode = new QRCodeStyling({
    width: 160,
    height: 160,
    type: "svg",
    data: link,
    image: "/daxfi-logo-qr.png",
    dotsOptions: {
      color: "#FFFFFF",
      type: "rounded",
    },
    backgroundOptions: {
      color: "#0D0E12",
    },
    imageOptions: {
      crossOrigin: "anonymous",
      margin: 4,
      imageSize: 0.3,
    },
    cornersSquareOptions: {
      type: "extra-rounded",
      color: "#FFFFFF",
    },
    cornersDotOptions: {
      type: "dot",
      color: "#FFFFFF",
    },
  });

  useEffect(() => {
    if (ref.current) {
      ref.current.innerHTML = ""; // Clear old QR
      qrCode.append(ref.current);
      // Force size (bug workaround for qr-code-styling)
      ref.current.querySelector("svg")?.setAttribute("width", "160");
      ref.current.querySelector("svg")?.setAttribute("height", "160");
    }

    qrCode.update({ data: link });
  }, [link]);

  return (
    <div
      ref={ref}
      className="rounded-xl overflow-hidden"
      style={{ boxShadow: "0 0 10px #1A6DFF, 0 0 20px #1FC4F9", width: "160px", height: "160px" }}
    />
  );
}
