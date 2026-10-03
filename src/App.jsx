import { useState } from "react";
import { useSessions } from "./hooks/useSessions";
import { FiltersBar } from "./components/FiltersBar";
import { SessionList } from "./components/SessionList";

export default function App() {
  const [selectedId, setSelectedId] = useState(null);

  const { filters, setFilter, sessions, status, error, retry } = useSessions();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-5">
          <h1 className="text-xl font-bold text-slate-900">MATRiCE — Planning</h1>
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
    </div>
  );
}