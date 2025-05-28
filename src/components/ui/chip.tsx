import { useTranslations } from "next-intl";

export function Chip({ status }: { status: string }) {
  const t = useTranslations("chip");

  const color =
    status === "Success"
      ? "text-green-600 bg-green-50 border border-green-400"
      : status === "Pending"
        ? "text-yellow-600 bg-yellow-50 border border-yellow-400"
        : "text-red-600 bg-red-50 border border-red-400";

  return (
    <span className={`text-xs px-2 py-1 rounded-full inline-flex items-center gap-1 ${color}`}>
      {status === "Success" && <span>✔</span>}
      {status === "Pending" && <span>⏱</span>}
      {status === "Failed" && <span>⚠️</span>}
      {t(status.toLowerCase())}
    </span>
  );
}
