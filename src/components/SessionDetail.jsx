import { useEffect, useRef } from "react";
import { formateurs } from "../data/sessions";
import { StatusBadge } from "./StatusBadge";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export function SessionDetail({ session, onClose, onChangeStatus }) {
  const dialogRef = useRef(null);
  const previousActiveElement = useRef(null);

  useEffect(() => {
    if (!session) return undefined;

    previousActiveElement.current = document.activeElement;
    const dialogNode = dialogRef.current;
    const focusable = dialogNode
      ? Array.from(dialogNode.querySelectorAll(FOCUSABLE_SELECTOR))
      : [];
    focusable[0]?.focus();

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key === "Tab" && focusable.length > 0) {
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previousActiveElement.current?.focus?.();
    };
  }, [session, onClose]);

  if (!session) return null;
    return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="session-detail-title"
        className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id="session-detail-title" className="text-lg font-semibold text-slate-900">
            {session.title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer le détail de la séance"
            className="rounded p-1 text-slate-500 hover:bg-slate-100"
          >
            ✕
          </button>
        </div>

        <dl className="mt-4 space-y-2 text-sm text-slate-700">
          <div>
            <dt className="font-medium">Domaine</dt>
            <dd>{session.domain}</dd>
          </div>
          <div>
            <dt className="font-medium">Groupe</dt>
            <dd>Groupe {session.group}</dd>
          </div>
          <div>
            <dt className="font-medium">Formateur</dt>
            <dd>
              {session.formateurId ? formateurs[session.formateurId] : "Aucun formateur"}
            </dd>
          </div>
          <div>
            <dt className="font-medium">Statut actuel</dt>
            <dd>
              <StatusBadge status={session.status} />
            </dd>
          </div>
        </dl>

        <div className="mt-6 flex flex-col gap-1">
          <label htmlFor="detail-status" className="text-sm font-medium text-slate-700">
            Modifier le statut (local)
          </label>
          <select
            id="detail-status"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
            value={session.status}
            onChange={(event) => onChangeStatus(session.id, event.target.value)}
          >
            <option value="proposed">Proposée</option>
            <option value="confirmed">Confirmée</option>
          </select>
        </div>
      </div>
    </div>
  );
}