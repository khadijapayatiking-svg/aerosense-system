import type { AxiosAdapter, InternalAxiosRequestConfig } from "axios";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import type { User } from "@/types";

import { getCsrfCookie, login, logout } from "./auth";
import { api } from "./client";

interface CapturedRequest {
  method: string;
  url: string;
  headers: Record<string, unknown>;
  data: unknown;
}

const demoUser: User = {
  id: 1,
  username: "demo",
  email: "demo@example.com",
  first_name: "Demo",
  last_name: "User",
  is_staff: false,
};

function fullUrl(config: InternalAxiosRequestConfig): string {
  return `${config.baseURL ?? ""}${config.url ?? ""}`;
}

function createAdapter(
  respond: (config: InternalAxiosRequestConfig) => unknown = () => null,
) {
  const requests: CapturedRequest[] = [];
  const adapter: AxiosAdapter = async (config) => {
    requests.push({
      method: (config.method ?? "get").toUpperCase(),
      url: fullUrl(config),
      headers: {
        "X-CSRFToken": config.headers.get("X-CSRFToken"),
      },
      data: config.data,
    });

    return {
      data: respond(config),
      status: 200,
      statusText: "OK",
      headers: {},
      config,
    };
  };

  return { adapter, requests };
}

function setCsrfCookie(value: string) {
  document.cookie = `csrftoken=${value}; path=/`;
}

function clearCookies() {
  document.cookie = "csrftoken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
}

let originalAdapter: typeof api.defaults.adapter;

beforeEach(() => {
  originalAdapter = api.defaults.adapter;
  clearCookies();
});

afterEach(() => {
  api.defaults.adapter = originalAdapter;
  clearCookies();
});

describe("api client", () => {
  it("uses the documented session defaults", () => {
    expect(api.defaults.baseURL).toBe("/api");
    expect(api.defaults.withCredentials).toBe(true);
    expect(api.defaults.xsrfCookieName).toBe("csrftoken");
    expect(api.defaults.xsrfHeaderName).toBe("X-CSRFToken");
  });

  it("requests the CSRF cookie endpoint", async () => {
    const { adapter, requests } = createAdapter();
    api.defaults.adapter = adapter;

    await getCsrfCookie();

    expect(requests).toHaveLength(1);
    expect(requests[0]).toMatchObject({
      method: "GET",
      url: "/api/auth/csrf/",
    });
  });

  it("awaits the CSRF cookie before posting credentials", async () => {
    const { adapter, requests } = createAdapter((config) =>
      config.url?.includes("/auth/login/") ? { user: demoUser } : null,
    );
    api.defaults.adapter = adapter;

    const user = await login({ username: "demo", password: "secret" });

    expect(requests.map(({ method, url }) => `${method} ${url}`)).toEqual([
      "GET /api/auth/csrf/",
      "POST /api/auth/login/",
    ]);
    expect(JSON.parse(String(requests[1].data))).toEqual({
      username: "demo",
      password: "secret",
    });
    expect(user).toEqual(demoUser);
  });

  it("sends the CSRF token from the cookie on unsafe requests", async () => {
    const { adapter, requests } = createAdapter();
    api.defaults.adapter = adapter;
    setCsrfCookie("token-one");

    await logout();

    expect(requests[0]).toMatchObject({
      method: "POST",
      url: "/api/auth/logout/",
    });
    expect(requests[0].headers["X-CSRFToken"]).toBe("token-one");
  });

  it("does not send a CSRF token on safe requests", async () => {
    const { adapter, requests } = createAdapter();
    api.defaults.adapter = adapter;
    setCsrfCookie("token-one");

    await api.get("/auth/me/");

    expect(requests[0].headers["X-CSRFToken"]).toBeFalsy();
  });

  it("reads a rotated CSRF cookie on every unsafe request", async () => {
    const { adapter, requests } = createAdapter();
    api.defaults.adapter = adapter;

    setCsrfCookie("pre-login-token");
    await api.post("/auth/login/", {
      username: "demo",
      password: "secret",
    });

    // Django rotates the CSRF token during login().
    setCsrfCookie("post-login-token");
    await api.post("/auth/logout/");

    expect(requests[0].headers["X-CSRFToken"]).toBe("pre-login-token");
    expect(requests[1].headers["X-CSRFToken"]).toBe("post-login-token");
  });
});
