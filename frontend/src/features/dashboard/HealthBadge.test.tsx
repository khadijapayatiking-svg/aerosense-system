import { screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { api } from "@/api/client";
import { renderWithProviders } from "@/test/utils";

import { HealthBadge } from "./HealthBadge";

vi.mock("@/api/client", () => ({
  api: { get: vi.fn() },
}));

afterEach(() => {
  vi.clearAllMocks();
});

describe("HealthBadge", () => {
  it("shows a checking state while the health request is pending", () => {
    vi.mocked(api.get).mockReturnValue(new Promise(() => {}));

    renderWithProviders(<HealthBadge />);

    expect(screen.getByText("Checking...")).toBeInTheDocument();
  });

  it("shows operational when the health check succeeds", async () => {
    vi.mocked(api.get).mockResolvedValue({
      data: { status: "ok", service: "aerosense" },
    } as never);

    renderWithProviders(<HealthBadge />);

    expect(await screen.findByText("Operational")).toBeInTheDocument();
  });

  it("shows unavailable when the health check fails", async () => {
    vi.mocked(api.get).mockRejectedValue(new Error("Network error"));

    renderWithProviders(<HealthBadge />);

    expect(await screen.findByText("Unavailable")).toBeInTheDocument();
  });
});
