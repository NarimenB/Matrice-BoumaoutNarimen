import { SessionCard } from "./SessionCard";

export function SessionList({ sessions, status, error, onRetry, onOpenDetail }) {
  if (status === "loading") {
    return (
      <p role="status" className="py-10 text-center text-sm text-slate-500">
        Chargement du planning…
      </p>
    );
  }

  if (status === "error") {
    return (
      <div role="alert" className="flex flex-col items-center gap-3 py-10 text-center">
        <p className="text-sm text-red-700">
          Une erreur est survenue pendant le chargement du planning.
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
        >
          Réessayer
        </button>
      </div>
    );
  }

  if (status === "empty") {
    return (
      <p className="py-10 text-center text-sm text-slate-500">
        Aucune séance ne correspond à ces filtres.
      </p>
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {sessions.map((session) => (
        <SessionCard key={session.id} session={session} onOpenDetail={onOpenDetail} />
      ))}
    </ul>
  );
}