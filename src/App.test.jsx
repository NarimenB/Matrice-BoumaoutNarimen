import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import App from "./App";

describe("App - accessibilité du filtre de recherche", () => {
  test("le champ de recherche a un nom accessible exposé par son label", async () => {
    render(<App />);
    await waitFor(() =>
      expect(screen.getByText("React composants")).toBeInTheDocument()
    );

    expect(screen.getByRole("textbox", { name: /recherche/i })).toBeInTheDocument();
  });

  test("le champ de recherche est utilisable au clavier et filtre la liste", async () => {
    const user = userEvent.setup();
    render(<App />);
    await waitFor(() =>
      expect(screen.getByText("React composants")).toBeInTheDocument()
    );

    const searchInput = screen.getByRole("textbox", { name: /recherche/i });

    await user.tab(); // groupe
    await user.tab(); // domaine
    await user.tab(); // recherche
    expect(searchInput).toHaveFocus();

    await user.keyboard("Authentification");

    await waitFor(
      () => {
        expect(screen.queryByText("React composants")).not.toBeInTheDocument();
        expect(screen.getByText("Authentification")).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  });
});