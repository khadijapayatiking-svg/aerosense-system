import type { ReactElement } from "react";

import { screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { api } from "@/api/client";
import { renderWithProviders } from "@/test/utils";
import { sampleFlights } from "@/types";

import { DashboardPage } from "./DashboardPage";
import { RecentFlightsTable } from "./RecentFlightsTable";

vi.mock("recharts", async (importOriginal) => {
  const actual = await importOriginal<typeof import("recharts")>();
  const React = await import("react");

  return {
    ...actual,
    ResponsiveContainer: ({ children }: { children: ReactElement }) =>
      React.cloneElement(
        children as ReactElement<{ width: number; height: number }>,
        { width: 640, height: 280 },
      ),
  };
});

vi.mock("@/api/client", () => ({
  api: { get: vi.fn() },
}));

beforeEach(() => {
  vi.mocked(api.get).mockResolvedValue({
    data: { status: "ok", service: "aerosense" },
  } as never);
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("DashboardPage", () => {
  it("renders the four stat cards", () => {
    renderWithProviders(<DashboardPage />);

    for (const label of [
      "Fields monitored",
      "Flights this month",
      "Avg. NDVI",
      "Open alerts",
    ]) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
  });

  it("escapes user-provided text", () => {
    renderWithProviders(
      <RecentFlightsTable
        flights={[{ ...sampleFlights[0], field: "<script>alert(1)</script>" }]}
      />,
    );

    expect(screen.getByText("<script>alert(1)</script>")).toBeInTheDocument();
    expect(document.querySelector("script")).not.toBeInTheDocument();
  });
});
