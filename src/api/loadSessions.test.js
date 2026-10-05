import { describe, expect, test } from "vitest";
import { filterSessions } from "./loadSessions";

const DATASET = [
  { id: "s01", group: "A", domain: "web", title: "React composants" },
  { id: "s02", group: "B", domain: "web", title: "React événements" },
  { id: "s03", group: "Promotion", domain: "data", title: "Données et SQL" },
  { id: "s04", group: "A", domain: "cyber", title: "Authentification" },
  { id: "s06", group: "Promotion", domain: "projet", title: "Travail autonome" },
];

describe("filterSessions - le groupe A inclut aussi la Promotion", () => {
  test("filtrer par groupe A renvoie les séances A ET les séances Promotion", () => {
    const result = filterSessions(DATASET, { group: "A" });
    const ids = result.map((s) => s.id).sort();

    expect(ids).toEqual(["s01", "s03", "s04", "s06"]);
    expect(ids).not.toContain("s02");
  });

  test("filtrer par groupe B renvoie les séances B ET les séances Promotion, mais pas A", () => {
    const result = filterSessions(DATASET, { group: "B" });
    const ids = result.map((s) => s.id).sort();

    expect(ids).toEqual(["s02", "s03", "s06"]);
    expect(ids).not.toContain("s01");
    expect(ids).not.toContain("s04");
  });
});