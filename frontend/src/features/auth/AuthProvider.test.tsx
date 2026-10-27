import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  getCurrentUser,
  login as loginRequest,
  logout as logoutRequest,
} from "@/api/auth";
import type { User } from "@/types";

import { AuthProvider, useAuth } from "./AuthProvider";

vi.mock("@/api/auth", () => ({
  getCsrfCookie: vi.fn(),
  getCurrentUser: vi.fn(),
  login: vi.fn(),
  logout: vi.fn(),
}));

const demoUser: User = {
  id: 1,
  username: "demo",
  email: "demo@example.com",
  first_name: "Demo",
  last_name: "User",
  is_staff: false,
};

function AuthProbe() {
  const { user, isLoading, login, logout } = useAuth();

  return (
    <div>
      <p>{isLoading ? "loading" : (user?.username ?? "anonymous")}</p>
      <button
        type="button"
        onClick={() => void login({ username: "demo", password: "secret" })}
      >
        log in
      </button>
      <button
        type="button"
        onClick={() => void logout().catch(() => undefined)}
      >
        log out
      </button>
    </div>
  );
}

function renderProvider() {
  return render(
    <AuthProvider>
      <AuthProbe />
    </AuthProvider>,
  );
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("AuthProvider", () => {
  it("loads the current user on mount", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(demoUser);

    renderProvider();

    expect(screen.getByText("loading")).toBeInTheDocument();
    expect(await screen.findByText("demo")).toBeInTheDocument();
    expect(getCurrentUser).toHaveBeenCalledTimes(1);
  });

  it.each([401, 403])(
    "normalizes a %i response to anonymous",
    async (status) => {
      vi.mocked(getCurrentUser).mockRejectedValue({
        isAxiosError: true,
        response: { status },
      });

      renderProvider();

      expect(await screen.findByText("anonymous")).toBeInTheDocument();
    },
  );

  it("normalizes an unexpected failure to anonymous", async () => {
    vi.mocked(getCurrentUser).mockRejectedValue(new Error("Network Error"));

    renderProvider();

    expect(await screen.findByText("anonymous")).toBeInTheDocument();
  });

  it("stores the user after a successful login", async () => {
    vi.mocked(getCurrentUser).mockRejectedValue({
      isAxiosError: true,
      response: { status: 403 },
    });
    vi.mocked(loginRequest).mockResolvedValue(demoUser);

    renderProvider();

    await screen.findByText("anonymous");
    await userEvent.click(screen.getByRole("button", { name: "log in" }));

    expect(loginRequest).toHaveBeenCalledWith({
      username: "demo",
      password: "secret",
    });
    expect(await screen.findByText("demo")).toBeInTheDocument();
  });

  it("clears the user after logout", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(demoUser);
    vi.mocked(logoutRequest).mockResolvedValue(undefined);

    renderProvider();

    await screen.findByText("demo");
    await userEvent.click(screen.getByRole("button", { name: "log out" }));

    expect(logoutRequest).toHaveBeenCalledTimes(1);
    expect(await screen.findByText("anonymous")).toBeInTheDocument();
  });

  it("clears the user even when the logout request fails", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(demoUser);
    vi.mocked(logoutRequest).mockRejectedValue(new Error("Network Error"));

    renderProvider();

    await screen.findByText("demo");
    await userEvent.click(screen.getByRole("button", { name: "log out" }));

    expect(logoutRequest).toHaveBeenCalledTimes(1);
    expect(await screen.findByText("anonymous")).toBeInTheDocument();
  });
});
