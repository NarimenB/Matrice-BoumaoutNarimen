import { formateurs } from "../data/sessions";
import { StatusBadge } from "./StatusBadge";

const DOMAIN_LABELS = {
  web: "Web",
  data: "Data",
  cyber: "Cybersécurité",
  projet: "Projet",
};

export function SessionCard({ session, onOpenDetail }) {
  const formateurName = session.formateurId
    ? formateurs[session.formateurId]
    : "Aucun formateur";

  return (
    <li>
      <button
        type="button"
        onClick={() => onOpenDetail(session.id)}
        className="flex w-full flex-col gap-2 rounded-2xl border-2 border-green-700 bg-white p-4 text-left shadow-sm hover:bg-pink-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-green-800"
      >
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-green-900">{session.title}</h3>
          <StatusBadge status={session.status} />
        </div>
        <p className="text-sm text-slate-800">
          {DOMAIN_LABELS[session.domain] ?? session.domain} · Groupe {session.group}
        </p>
        <p className="text-sm text-slate-800">{formateurName}</p>
      </button>
    </li>
  );
}