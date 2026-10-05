import React from "react";
import { SessionCard } from "./SessionCard";

export function SessionList({ sessions, status, error, onRetry, onOpenDetail }) {
  if (status === "loading") {
    return (
      <p
        role="status"
        className="rounded-2xl bg-white p-6 text-center text-sm text-green-900"
      >
        Chargement du planning…
      </p>
    );
  }

  if (status === "error") {
    return (
      <div
        role="alert"
        className="flex flex-col items-center gap-3 rounded-2xl bg-white p-6 text-center"
      >
        <p className="text-sm text-red-900">
          Une erreur est survenue pendant le chargement du planning.
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="rounded-full bg-green-800 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-green-800 focus-visible:ring-offset-2"
        >
          Réessayer
        </button>
      </div>
    );
  }

  if (status === "empty") {
    return (
      <p className="rounded-2xl bg-white p-6 text-center text-sm text-green-900">
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