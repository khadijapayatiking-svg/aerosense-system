import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import {
  AuthContext,
  type AuthContextValue,
} from "@/features/auth/AuthProvider";
import type { User } from "@/types";

import { AppShell } from "./AppShell";

const demoUser: User = {
  id: 1,
  username: "demo",
  email: "demo@example.com",
  first_name: "Demo",
  last_name: "User",
  is_staff: false,
};

function renderAppShell(auth: Partial<AuthContextValue> = {}) {
  const value: AuthContextValue = {
    user: demoUser,
    isLoading: false,
    login: vi.fn(),
    logout: vi.fn(),
    ...auth,
  };

  return render(
    <MemoryRouter>
      <AuthContext.Provider value={value}>
        <AppShell />
      </AuthContext.Provider>
    </MemoryRouter>,
  );
}

describe("AppShell", () => {
  it("renders the primary navigation", () => {
    renderAppShell();

    expect(
      screen.getByRole("link", { name: /dashboard/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /fields/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /flights/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /alerts/i })).toBeInTheDocument();
  });

  it("shows the signed-in username", () => {
    renderAppShell();

    expect(screen.getByText(/signed in as/i)).toHaveTextContent("demo");
  });

  it("logs out from the app shell", async () => {
    const logout = vi.fn().mockResolvedValue(undefined);

    renderAppShell({ logout });
    await userEvent.click(
      screen.getByRole("button", { name: /log out|sign out/i }),
    );

    expect(logout).toHaveBeenCalled();
  });
});
