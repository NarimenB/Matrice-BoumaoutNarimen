import { describe, expect, test } from "vitest";
import { groupByDay } from "./groupByDay";

const SESSIONS = [
  { id: "s04", date: "2026-10-20", period: "am" },
  { id: "s03", date: "2026-10-19", period: "pm" },
  { id: "s01", date: "2026-10-19", period: "am" },
];

describe("groupByDay", () => {
  test("regroupe par jour, jours triés, matin avant après-midi", () => {
    const days = groupByDay(SESSIONS);

    expect(days.map((d) => d.date)).toEqual(["2026-10-19", "2026-10-20"]);
    expect(days[0].sessions.map((s) => s.id)).toEqual(["s01", "s03"]);
  });

  test("le libellé du jour est en français avec une majuscule", () => {
    const [first] = groupByDay(SESSIONS);
    expect(first.label).toBe("Lundi 19 octobre");
  });

  test("une liste vide ne donne aucun jour", () => {
    expect(groupByDay([])).toEqual([]);
  });
});