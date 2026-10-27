import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { AppShell } from "./AppShell";

describe("AppShell", () => {
  it("renders the primary navigation", () => {
    render(
      <MemoryRouter>
        <AppShell />
      </MemoryRouter>,
    );
    expect(
      screen.getByRole("link", { name: /dashboard/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /fields/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /flights/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /alerts/i })).toBeInTheDocument();
  });
});
