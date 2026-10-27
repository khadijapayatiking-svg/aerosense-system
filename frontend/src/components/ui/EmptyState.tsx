import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-border-strong bg-surface-muted px-6 py-12 text-center",
        className,
      )}
    >
      <h2 className="font-display text-base font-semibold text-surface-inverse">
        {title}
      </h2>
      <p className="mt-1 max-w-sm text-sm text-earth-600">{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
