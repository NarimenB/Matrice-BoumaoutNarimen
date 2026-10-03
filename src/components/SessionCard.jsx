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
        className="flex w-full flex-col gap-2 rounded-lg border border-slate-200 bg-white p-4 text-left shadow-sm hover:border-indigo-300 hover:shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
      >
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-slate-900">{session.title}</h3>
          <StatusBadge status={session.status} />
        </div>
        <p className="text-sm text-slate-600">
          {DOMAIN_LABELS[session.domain] ?? session.domain} · Groupe {session.group}
        </p>
        <p className="text-sm text-slate-600">{formateurName}</p>
      </button>
    </li>
  );
}