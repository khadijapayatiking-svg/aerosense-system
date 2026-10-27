import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import {
  AuthContext,
  type AuthContextValue,
} from "@/features/auth/AuthProvider";
import type { User } from "@/types";

import { ProtectedRoute } from "./ProtectedRoute";

const demoUser: User = {
  id: 1,
  username: "demo",
  email: "demo@example.com",
  first_name: "Demo",
  last_name: "User",
  is_staff: false,
};

function renderProtectedRoute({
  user,
  isLoading,
}: Pick<AuthContextValue, "user" | "isLoading">) {
  const value: AuthContextValue = {
    user,
    isLoading,
    login: vi.fn(),
    logout: vi.fn(),
  };

  return render(
    <MemoryRouter initialEntries={["/"]}>
      <AuthContext.Provider value={value}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<div>Dashboard</div>} />
          </Route>
          <Route path="/login" element={<div>Login</div>} />
        </Routes>
      </AuthContext.Provider>
    </MemoryRouter>,
  );
}

function LocationStateProbe() {
  const location = useLocation();

  return <pre data-testid="state">{JSON.stringify(location.state)}</pre>;
}

describe("ProtectedRoute", () => {
  it("shows a loading state while the session is resolving", () => {
    renderProtectedRoute({ user: null, isLoading: true });

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();
  });

  it("redirects an anonymous user to login", () => {
    renderProtectedRoute({ user: null, isLoading: false });

    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();
  });

  it("forwards the requested path, search, and hash to login", () => {
    const value: AuthContextValue = {
      user: null,
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
    };

    render(
      <MemoryRouter initialEntries={["/fields?crop=maize#plots"]}>
        <AuthContext.Provider value={value}>
          <Routes>
            <Route path="/fields" element={<ProtectedRoute />} />
            <Route path="/login" element={<LocationStateProbe />} />
          </Routes>
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    const state = JSON.parse(
      screen.getByTestId("state").textContent ?? "{}",
    ) as {
      from: { pathname: string; search: string; hash: string };
    };

    expect(state.from.pathname).toBe("/fields");
    expect(state.from.search).toBe("?crop=maize");
    expect(state.from.hash).toBe("#plots");
  });

  it("renders the child route for an authenticated user", () => {
    renderProtectedRoute({ user: demoUser, isLoading: false });

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.queryByText("Login")).not.toBeInTheDocument();
  });
});
