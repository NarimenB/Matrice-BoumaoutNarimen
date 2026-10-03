import { sessions } from "../data/sessions";

export function filterSessions(allSessions, { group, domain, search } = {}) {
  const normalizedSearch = (search ?? "").trim().toLowerCase();

  return allSessions.filter((session) => {
    const matchesGroup =
      !group ||
      group === "all" ||
      session.group === group ||
      session.group === "Promotion";

    const matchesDomain =
      !domain || domain === "all" || session.domain === domain;

    const matchesSearch =
      normalizedSearch.length === 0 ||
      session.title.toLowerCase().includes(normalizedSearch);

    return matchesGroup && matchesDomain && matchesSearch;
  });
}

export const DEFAULT_DELAY_MS = 400;

export function loadSessions({
  group,
  domain,
  search,
  delayMs = DEFAULT_DELAY_MS,
  simulateError = false,
} = {}) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (simulateError) {
        reject(new Error("Erreur réseau simulée"));
        return;
      }
      resolve(filterSessions(sessions, { group, domain, search }));
    }, delayMs);
  });
}