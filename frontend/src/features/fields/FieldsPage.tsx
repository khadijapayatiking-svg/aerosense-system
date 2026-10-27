import { Sprout } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";

export function FieldsPage() {
  return (
    <section className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-surface-inverse">
          Fields
        </h1>
        <p className="mt-1 max-w-prose text-sm text-earth-600">
          Field boundaries, crop health, and imagery history will appear here
          once field records are connected.
        </p>
      </header>

      <EmptyState
        title="No fields monitored yet"
        description="Add a field to start tracking crop health across flights. Field management is not connected to the API in this release."
        action={
          <Button variant="secondary" disabled>
            <Sprout aria-hidden="true" className="size-4" />
            Add a field (coming soon)
          </Button>
        }
      />
    </section>
  );
}
