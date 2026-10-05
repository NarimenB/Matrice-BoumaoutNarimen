import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { useSessions } from "./useSessions";

function makeLoader({ delayMs = 10, result = [], shouldReject = false } = {}) {
  return vi.fn(
    () =>
      new Promise((resolve, reject) => {
        setTimeout(() => {
          if (shouldReject) reject(new Error("Erreur réseau simulée"));
          else resolve(result);
        }, delayMs);
      })
  );
}

const SAMPLE = [
  { id: "s01", title: "React composants", group: "A", status: "confirmed" },
];

describe("useSessions - scénario 1 : chargement", () => {
  test("le statut passe à loading dès le montage, avant toute résolution", () => {
    const loader = makeLoader({ delayMs: 50, result: SAMPLE });
    const { result } = renderHook(() => useSessions({ loader }));
    expect(result.current.status).toBe("loading");
  });
});

describe("useSessions - scénario 2 : succès", () => {
  test("le statut passe à success et les séances sont disponibles", async () => {
    const loader = makeLoader({ delayMs: 10, result: SAMPLE });
    const { result } = renderHook(() => useSessions({ loader }));

    await waitFor(() => expect(result.current.status).toBe("success"));
    expect(result.current.sessions).toEqual(SAMPLE);
  });
});

describe("useSessions - scénario 4 : résultat vide", () => {
  test("le statut passe à empty quand le loader renvoie un tableau vide", async () => {
    const loader = makeLoader({ delayMs: 10, result: [] });
    const { result } = renderHook(() => useSessions({ loader }));

    await waitFor(() => expect(result.current.status).toBe("empty"));
    expect(result.current.sessions).toEqual([]);
  });
});