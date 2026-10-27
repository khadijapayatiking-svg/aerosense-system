import type { ReactElement } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { NdviTrendChart } from "./NdviTrendChart";

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

describe("NdviTrendChart", () => {
  it("renders the chart container", () => {
    render(<NdviTrendChart />);

    expect(screen.getByTestId("ndvi-chart")).toBeInTheDocument();
  });
});
