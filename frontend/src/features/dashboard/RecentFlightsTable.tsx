import { Badge, type BadgeProps } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { Flight } from "@/types";

export interface RecentFlightsTableProps {
  flights: Flight[];
}

const statusTone: Record<Flight["status"], BadgeProps["tone"]> = {
  completed: "success",
  processing: "warning",
  failed: "danger",
};

const statusLabel: Record<Flight["status"], string> = {
  completed: "Completed",
  processing: "Processing",
  failed: "Failed",
};

export function RecentFlightsTable({ flights }: RecentFlightsTableProps) {
  return (
    <Card className="overflow-hidden">
      <div className="border-b border-border-subtle px-5 py-4">
        <h2 className="font-display text-base font-semibold text-surface-inverse">
          Recent flights
        </h2>
        <p className="mt-1 text-sm text-earth-600">
          Latest sample captures and their vegetation index.
        </p>
      </div>

      {flights.length === 0 ? (
        <p className="px-5 py-8 text-center text-sm text-earth-600">
          No flights have been recorded yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border-subtle text-left text-sm">
            <caption className="sr-only">Recent flights</caption>
            <thead className="bg-surface-muted text-xs font-semibold tracking-wide text-earth-600 uppercase">
              <tr>
                <th scope="col" className="px-5 py-3">
                  Field
                </th>
                <th scope="col" className="px-5 py-3">
                  Date
                </th>
                <th scope="col" className="px-5 py-3">
                  Status
                </th>
                <th scope="col" className="px-5 py-3 text-right">
                  NDVI
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {flights.map((flight) => (
                <tr key={flight.id}>
                  <td className="px-5 py-3 font-medium text-surface-inverse">
                    {flight.field}
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap text-earth-600">
                    {flight.date}
                  </td>
                  <td className="px-5 py-3">
                    <Badge tone={statusTone[flight.status]}>
                      {statusLabel[flight.status]}
                    </Badge>
                  </td>
                  <td className="px-5 py-3 text-right text-earth-600 tabular-nums">
                    {flight.ndvi.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
