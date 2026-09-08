import type { ReactNode } from "react";
import { cn } from "../lib/cn";

interface TooltipProps {
  label: string;
  children: ReactNode;
  side?: "top" | "bottom";
}

// CSS-only (no JS positioning/portal) — fine for the small icon buttons this
// wraps, which never sit close enough to a viewport edge to need flipping.
// Shows on hover and keyboard focus alike (group-focus-within).
export function Tooltip({ label, children, side = "top" }: TooltipProps) {
  return (
    <span className="group relative inline-flex">
      {children}
      <span
        role="tooltip"
        className={cn(
          "pointer-events-none absolute left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-md bg-sidebar px-2 py-1 text-xs font-medium text-white opacity-0 shadow-md transition-opacity delay-150 duration-150 group-hover:opacity-100 group-focus-within:opacity-100",
          side === "top" ? "bottom-full mb-1.5" : "top-full mt-1.5",
        )}
      >
        {label}
      </span>
    </span>
  );
}
