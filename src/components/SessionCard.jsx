import React from "react";
import { formateurs } from "../data/sessions";
import { StatusBadge } from "./StatusBadge";

const DOMAIN_LABELS = {
  web: "Web",
  data: "Data",
  cyber: "Cybersécurité",
  projet: "Projet",
};

const PERIOD_LABELS = { am: "Matin", pm: "Après-midi" };

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
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-800">
          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-900 ring-1 ring-slate-500">
            {DOMAIN_LABELS[session.domain] ?? session.domain}
          </span>
          <span>
            Groupe {session.group} · {PERIOD_LABELS[session.period] ?? session.period}
          </span>
        </div>
        <p className="text-sm text-slate-800">{formateurName}</p>
      </button>
    </li>
  );
}