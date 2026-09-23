import { cn } from "../../../lib/cn";
import { statusLabels, type TicketStatus } from "../types";

const classes: Record<TicketStatus, string> = {
  open: "bg-tag-info-bg text-tag-info-fg",
  "awaiting-customer": "bg-tag-overnight-bg text-tag-overnight-fg",
  "awaiting-internal": "bg-tag-warning-bg text-tag-warning-fg",
  resolved: "bg-success/10 text-success",
};

export function TicketStatusBadge({ status }: { status: TicketStatus }) {
  return (
    <span className={cn("text-badge whitespace-nowrap rounded-full px-2 py-0.5", classes[status])}>
      {statusLabels[status]}
    </span>
  );
}
