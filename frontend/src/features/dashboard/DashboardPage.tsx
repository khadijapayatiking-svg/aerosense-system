import { Bell, Leaf, Plane, Sprout } from "lucide-react";

import { Badge, type BadgeProps } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { sampleAlerts, sampleFlights, sampleStats, type Alert } from "@/types";

import { HealthBadge } from "./HealthBadge";
import { NdviTrendChart } from "./NdviTrendChart";
import { RecentFlightsTable } from "./RecentFlightsTable";

const severityTone: Record<Alert["severity"], BadgeProps["tone"]> = {
  info: "neutral",
  warning: "warning",
  critical: "danger",
};

const severityLabel: Record<Alert["severity"], string> = {
  info: "Info",
  warning: "Warning",
  critical: "Critical",
};

export function DashboardPage() {
  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-surface-inverse">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-earth-600">
            Sample data — not connected to field records yet.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium tracking-wide text-earth-600 uppercase">
            API status
          </span>
          <HealthBadge />
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Fields monitored"
          value={String(sampleStats.fieldsMonitored)}
          icon={Sprout}
        />
        <StatCard
          label="Flights this month"
          value={String(sampleStats.flightsThisMonth)}
          icon={Plane}
        />
        <StatCard
          label="Avg. NDVI"
          value={sampleStats.averageNdvi.toFixed(2)}
          icon={Leaf}
        />
        <StatCard
          label="Open alerts"
          value={String(sampleStats.openAlerts)}
          icon={Bell}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <NdviTrendChart />

        <Card className="p-5">
          <h2 className="font-display text-base font-semibold text-surface-inverse">
            Latest alerts
          </h2>
          <p className="mt-1 text-sm text-earth-600">
            Sample issues that need a scouting visit.
          </p>
          <ul className="mt-4 space-y-3">
            {sampleAlerts.map((alert) => (
              <li key={alert.id} className="flex items-start gap-3">
                <Badge tone={severityTone[alert.severity]}>
                  {severityLabel[alert.severity]}
                </Badge>
                <div className="min-w-0">
                  <p className="text-sm text-surface-inverse">
                    {alert.message}
                  </p>
                  <p className="mt-0.5 text-xs text-earth-600">{alert.date}</p>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <RecentFlightsTable flights={sampleFlights} />
    </section>
  );
}
