import type { LucideIcon } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

export interface StatCardProps {
  label: string;
  value: string;
  delta?: string;
  icon: LucideIcon;
  className?: string;
}

export function StatCard({
  label,
  value,
  delta,
  icon: Icon,
  className,
}: StatCardProps) {
  return (
    <Card
      className={cn("flex items-start justify-between gap-4 p-5", className)}
    >
      <div>
        <p className="text-sm font-medium text-earth-600">{label}</p>
        <p className="mt-1 text-2xl font-semibold text-surface-inverse">
          {value}
        </p>
        {delta ? (
          <p className="mt-1 text-xs font-medium text-canopy-700">{delta}</p>
        ) : null}
      </div>
      <span
        aria-hidden="true"
        className="rounded-lg bg-canopy-50 p-2 text-canopy-700"
      >
        <Icon className="size-5" />
      </span>
    </Card>
  );
}
