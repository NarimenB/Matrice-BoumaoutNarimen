import React from "react";
const STATUS_CONFIG = {
  confirmed: {
    label: "Confirmée",
    className: "bg-green-100 text-green-900 ring-1 ring-green-700",
  },
  proposed: {
    label: "Proposée",
    className: "bg-pink-100 text-pink-900 ring-1 ring-pink-700",
  },
};

export function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.proposed;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${config.className}`}
    >
      {status === "confirmed" ? "✓" : "○"}
      {config.label}
    </span>
  );
}