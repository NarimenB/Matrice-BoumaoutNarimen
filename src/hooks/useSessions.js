import { useCallback, useEffect, useRef, useState } from "react";
import { loadSessions as realLoadSessions } from "../api/loadSessions";

export function useSessions({ loader = realLoadSessions } = {}) {
  const [filters, setFiltersState] = useState({
    group: "all",
    domain: "all",
    search: "",
  });

  const [sessions, setSessions] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  const requestIdRef = useRef(0);

    const runLoad = useCallback(
    (params) => {
      const requestId = ++requestIdRef.current;
      setStatus("loading");
      setError(null);

      return loader(params).then(
        (data) => {
          if (requestId !== requestIdRef.current) return;
          setSessions(data);
          setStatus(data.length === 0 ? "empty" : "success");
        },
        (err) => {
          if (requestId !== requestIdRef.current) return;
          setStatus("error");
          setError(err);
        }
      );
    },
    [loader]
  );

    useEffect(() => {
    runLoad(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, loader]);

  const setFilter = useCallback((key, value) => {
    setFiltersState((prev) => ({ ...prev, [key]: value }));
  }, []);

  const retry = useCallback(() => {
    runLoad(filters);
  }, [runLoad, filters]);

  const updateStatus = useCallback((sessionId, newStatus) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, status: newStatus } : s))
    );
  }, []);

  return {
    filters,
    setFilter,
    sessions,
    status,
    error,
    retry,
    updateStatus,
  };
}