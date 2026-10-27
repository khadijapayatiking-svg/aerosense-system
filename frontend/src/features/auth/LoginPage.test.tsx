import type { ComponentProps } from "react";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import type { User } from "@/types";

import { AuthContext, type AuthContextValue } from "./AuthProvider";
import { LoginPage } from "./LoginPage";

type InitialEntries = ComponentProps<typeof MemoryRouter>["initialEntries"];

const demoUser: User = {
  id: 1,
  username: "demo",
  email: "demo@example.com",
  first_name: "Demo",
  last_name: "User",
  is_staff: false,
};

function LocationDisplay() {
  const location = useLocation();

  return (
    <p data-testid="location">
      {`${location.pathname}${location.search}${location.hash}`}
    </p>
  );
}

function renderLoginPage(
  login: AuthContextValue["login"],
  initialEntries: InitialEntries = ["/login"],
) {
  return render(
    <AuthContext.Provider
      value={{ user: null, isLoading: false, login, logout: vi.fn() }}
    >
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<LocationDisplay />} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  );
}

async function submitCredentials(password = "secret") {
  await userEvent.type(screen.getByLabelText(/username/i), "demo");
  await userEvent.type(screen.getByLabelText(/password/i), password);
  await userEvent.click(screen.getByRole("button", { name: /sign in/i }));
}

describe("LoginPage", () => {
  it("shows an inline error when login fails", async () => {
    const login = vi.fn().mockRejectedValue(new Error("Invalid credentials"));

    renderLoginPage(login);
    await submitCredentials("wrong");

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /invalid credentials/i,
    );
    expect(screen.getByLabelText(/username/i)).toHaveValue("demo");
  });

  it("uses the server message from an Axios error", async () => {
    const login = vi.fn().mockRejectedValue({
      isAxiosError: true,
      response: {
        status: 400,
        data: { non_field_errors: ["Invalid credentials."] },
      },
    });

    renderLoginPage(login);
    await submitCredentials("wrong");

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Invalid credentials.",
    );
  });

  it("navigates to the requested page after login", async () => {
    const login = vi.fn().mockResolvedValue(demoUser);

    renderLoginPage(login, [
      {
        pathname: "/login",
        state: {
          from: { pathname: "/fields", search: "?crop=maize", hash: "#plots" },
        },
      },
    ]);
    await submitCredentials();

    expect(login).toHaveBeenCalledWith({
      username: "demo",
      password: "secret",
    });
    expect(await screen.findByTestId("location")).toHaveTextContent(
      "/fields?crop=maize#plots",
    );
  });

  it("navigates to the dashboard after login without a redirect target", async () => {
    const login = vi.fn().mockResolvedValue(demoUser);

    renderLoginPage(login);
    await submitCredentials();

    expect(await screen.findByTestId("location")).toHaveTextContent(/^\/$/);
  });
});
