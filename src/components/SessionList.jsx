import React from "react";
import { SessionCard } from "./SessionCard";
import { groupByDay } from "../utils/groupByDay";

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

  const days = groupByDay(sessions);

  return (
    <div className="flex flex-col gap-6">
      {days.map((day) => (
        <section key={day.date} aria-labelledby={`day-${day.date}`}>
          <h2
            id={`day-${day.date}`}
            className="mb-3 text-lg font-bold italic text-green-900"
          >
            {day.label}
          </h2>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {day.sessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onOpenDetail={onOpenDetail}
              />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}