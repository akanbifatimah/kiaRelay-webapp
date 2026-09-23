import type { ReactNode } from "react";
import { cn } from "../../../lib/cn";

export interface TotalsCell {
  content: ReactNode;
  align?: "left" | "right";
  className?: string;
}

interface TotalsRowProps {
  cells: TotalsCell[];
  /** "dark" = the navy "Total Filtered" bar; "muted" = the grey cohort row. */
  tone?: "dark" | "muted";
}

// Passed as DataTable's `footer`. One cell per column, same order, computed
// by the caller over the full filtered set (not just the visible page).
export function TotalsRow({ cells, tone = "dark" }: TotalsRowProps) {
  return (
    <tr className={cn("font-semibold", tone === "dark" ? "bg-sidebar text-white" : "bg-bg text-text")}>
      {cells.map((cell, index) => (
        <td
          key={index}
          className={cn(
            "whitespace-nowrap py-3 pr-4 font-mono text-sm tabular-nums first:pl-3",
            cell.align === "right" && "text-right",
            cell.className,
          )}
        >
          {cell.content}
        </td>
      ))}
    </tr>
  );
}
