
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

describe("useSessions - scénario 5 : erreur puis nouvelle tentative", () => {
  test("une erreur passe le statut à error, puis retry() relance le chargement", async () => {
    let shouldReject = true;
    const loader = vi.fn(
      () =>
        new Promise((resolve, reject) => {
          setTimeout(() => {
            if (shouldReject) reject(new Error("Erreur réseau simulée"));
            else resolve(SAMPLE);
          }, 10);
        })
    );

    const { result } = renderHook(() => useSessions({ loader }));

    await waitFor(() => expect(result.current.status).toBe("error"));
    expect(result.current.error?.message).toBe("Erreur réseau simulée");

    shouldReject = false;
    act(() => {
      result.current.retry();
    });

    await waitFor(() => expect(result.current.status).toBe("success"));
    expect(result.current.sessions).toEqual(SAMPLE);
    expect(loader).toHaveBeenCalledTimes(2);
  });
});

describe("useSessions - scénario 6 : réponses dans le désordre", () => {
  test("une réponse lente lancée en premier n'écrase pas une réponse rapide lancée ensuite", async () => {
    const loader = vi.fn(({ group }) => {
      const delay = group === "A" ? 800 : 200;
      return new Promise((resolve) =>
        setTimeout(
          () => resolve([{ id: group, title: `Résultat ${group}`, status: "proposed" }]),
          delay
        )
      );
    });

    const { result } = renderHook(() => useSessions({ loader }));

    act(() => {
      result.current.setFilter("group", "A");
    });

    await new Promise((resolve) => setTimeout(resolve, 100));

    act(() => {
      result.current.setFilter("group", "B");
    });

    await waitFor(() => expect(result.current.sessions[0]?.id).toBe("B"), {
      timeout: 2000,
    });

    await new Promise((resolve) => setTimeout(resolve, 900));
    expect(result.current.sessions[0]?.id).toBe("B");
  }, 3000);
});

const SAMPLE_FORMATEUR = [
  { id: "s04", title: "Authentification", formateurId: "t2", status: "proposed" },
  { id: "s06", title: "Travail autonome", formateurId: null, status: "proposed" },
];

describe("useSessions - scénario 7 : confirmation sans formateur", () => {
  test("une séance sans formateur ne peut pas être confirmée, une séance avec formateur le peut", async () => {
    const loader = makeLoader({ delayMs: 10, result: SAMPLE_FORMATEUR });
    const { result } = renderHook(() => useSessions({ loader }));

    await waitFor(() => expect(result.current.status).toBe("success"));

    act(() => {
      result.current.updateStatus("s06", "confirmed");
    });
    expect(result.current.sessions.find((s) => s.id === "s06").status).toBe("proposed");

    act(() => {
      result.current.updateStatus("s04", "confirmed");
    });
    expect(result.current.sessions.find((s) => s.id === "s04").status).toBe("confirmed");
  });
});