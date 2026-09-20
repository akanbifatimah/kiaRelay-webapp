import type { ReactNode } from "react";
import { cn } from "../lib/cn";

interface TooltipProps {
  label: string;
  children: ReactNode;
  side?: "top" | "bottom" | "right";
  /** Extends the wrapper span's classes — e.g. `w-full` so a block-level
   * child (a full-width nav row) keeps its own layout instead of shrinking
   * to the wrapper's default `inline-flex` sizing. */
  className?: string;
}

// CSS-only (no JS positioning/portal) — fine for the small icon buttons this
// wraps, which never sit close enough to a viewport edge to need flipping.
// Shows on hover and keyboard focus alike (group-focus-within). "right" was
// added for the collapsed sidebar's icon rail (2026-09-18) — a left-edge
// fixed rail has no room above/below for top/bottom placement.
export function Tooltip({ label, children, side = "top", className }: TooltipProps) {
  return (
    <span className={cn("group relative inline-flex", className)}>
      {children}
      <span
        role="tooltip"
        className={cn(
          "pointer-events-none absolute z-50 whitespace-nowrap rounded-md bg-sidebar px-2 py-1 text-xs font-medium text-white opacity-0 shadow-md transition-opacity delay-150 duration-150 group-hover:opacity-100 group-focus-within:opacity-100",
          side === "top" && "bottom-full left-1/2 mb-1.5 -translate-x-1/2",
          side === "bottom" && "top-full left-1/2 mt-1.5 -translate-x-1/2",
          side === "right" && "left-full top-1/2 ml-2 -translate-y-1/2",
        )}
      >
        {label}
      </span>
    </span>
  );
}
