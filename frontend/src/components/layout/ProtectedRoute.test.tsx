import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
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

  it("renders the child route for an authenticated user", () => {
    renderProtectedRoute({ user: demoUser, isLoading: false });

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.queryByText("Login")).not.toBeInTheDocument();
  });
});
