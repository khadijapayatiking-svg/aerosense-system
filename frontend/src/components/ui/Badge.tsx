import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type BadgeTone = "success" | "warning" | "danger" | "neutral";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

const toneClasses: Record<BadgeTone, string> = {
  success: "bg-canopy-100 text-canopy-800",
  warning: "bg-earth-100 text-earth-800",
  danger: "bg-red-100 text-red-800",
  neutral: "bg-surface-sunken text-earth-800",
};

export function Badge({ className, tone = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        toneClasses[tone],
        className,
      )}
      {...props}
    />
  );
}
