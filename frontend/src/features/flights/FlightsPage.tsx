import { Plane } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";

export function FlightsPage() {
  return (
    <section className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-surface-inverse">
          Flights
        </h1>
        <p className="mt-1 max-w-prose text-sm text-earth-600">
          Drone flight plans, capture history, and processed imagery will appear
          here once flights are connected.
        </p>
      </header>

      <EmptyState
        title="No flights recorded yet"
        description="Flight planning and uploads are not connected to the API in this release. Completed flights will be listed here with their vegetation indices."
        action={
          <Button variant="secondary" disabled>
            <Plane aria-hidden="true" className="size-4" />
            Plan a flight (coming soon)
          </Button>
        }
      />
    </section>
  );
}
