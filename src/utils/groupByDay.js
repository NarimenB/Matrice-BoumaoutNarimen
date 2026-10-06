const PERIOD_ORDER = { am: 0, pm: 1 };

function formatDay(isoDate) {
  const [year, month, day] = isoDate.split("-").map(Number);
  const label = new Date(year, month - 1, day).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function groupByDay(sessions) {
  const byDate = new Map();

  for (const session of sessions) {
    if (!byDate.has(session.date)) byDate.set(session.date, []);
    byDate.get(session.date).push(session);
  }

  return [...byDate.keys()].sort().map((date) => ({
    date,
    label: formatDay(date),
    sessions: byDate
      .get(date)
      .sort((a, b) => (PERIOD_ORDER[a.period] ?? 0) - (PERIOD_ORDER[b.period] ?? 0)),
  }));
}