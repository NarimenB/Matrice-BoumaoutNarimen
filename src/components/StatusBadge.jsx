const STATUS_CONFIG = {
  confirmed: {
    label: "Confirmée",
    className: "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-300",
  },
  proposed: {
    label: "Proposée",
    className: "bg-amber-50 text-amber-800 ring-1 ring-amber-300",
  },
};

export function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.proposed;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}
    >
      {status === "confirmed" ? "✓" : "○"}
      {config.label}
    </span>
  );
}