import { cn } from "../../../lib/cn";
import { formatSlaWindow } from "../formatTicketTime";
import { slaLabels, type SlaStatus } from "../types";

const dotClasses: Record<SlaStatus, string> = {
  breached: "bg-danger",
  "at-risk": "bg-warning",
  pending: "bg-warning",
  healthy: "bg-success",
  resolved: "bg-success",
  open: "bg-success",
};

// Breached/At Risk read in their own color in the screenshot; the calmer
// states keep default text next to their dot.
const textClasses: Partial<Record<SlaStatus, string>> = {
  breached: "text-danger",
  "at-risk": "text-warning",
};

export function SlaStatusBadge({ sla, minutesLeft }: { sla: SlaStatus; minutesLeft: number }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 whitespace-nowrap text-sm font-medium text-text", textClasses[sla])}>
      <span className={cn("h-2 w-2 rounded-full", dotClasses[sla])} />
      {slaLabels[sla]} {formatSlaWindow(minutesLeft)}
    </span>
  );
}
