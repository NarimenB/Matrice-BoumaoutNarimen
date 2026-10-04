import { useState } from "react";
import { useSessions } from "./hooks/useSessions";
import { FiltersBar } from "./components/FiltersBar";
import { SessionList } from "./components/SessionList";
import { SessionDetail } from "./components/SessionDetail";

export default function App() {
  const [selectedId, setSelectedId] = useState(null);

  const { filters, setFilter, sessions, status, error, retry, updateStatus } =
    useSessions();

  const selectedSession = sessions.find((s) => s.id === selectedId) ?? null;

  return (
    <div className="min-h-screen bg-pink-200">
      <header className="border-b-4 border-green-700 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-5">
          <h1 className="text-2xl font-bold italic text-green-900">
            MATRiCE — Planning
          </h1>
        </div>
      </header>

      <main className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-6">
        <FiltersBar filters={filters} onChange={setFilter} />

        <SessionList
          sessions={sessions}
          status={status}
          error={error}
          onRetry={retry}
          onOpenDetail={setSelectedId}
        />
      </main>

      <SessionDetail
        session={selectedSession}
        onClose={() => setSelectedId(null)}
        onChangeStatus={updateStatus}
      />
    </div>
  );
}