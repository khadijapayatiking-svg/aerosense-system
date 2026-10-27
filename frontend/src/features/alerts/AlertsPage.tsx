import { Bell } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";

export function AlertsPage() {
  return (
    <section className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-surface-inverse">
          Alerts
        </h1>
        <p className="mt-1 max-w-prose text-sm text-earth-600">
          Scouting alerts and field issues will appear here once alert rules are
          connected to field records.
        </p>
      </header>

      <EmptyState
        title="No alerts right now"
        description="Alert rules are not connected to the API in this release. Vegetation index and flight issues will be surfaced here when they are detected."
        action={
          <Button variant="secondary" disabled>
            <Bell aria-hidden="true" className="size-4" />
            Configure alerts (coming soon)
          </Button>
        }
      />
    </section>
  );
}
