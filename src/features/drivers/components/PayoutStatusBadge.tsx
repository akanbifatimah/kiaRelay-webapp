import { cn } from "../../../lib/cn";
import type { PayoutStatus } from "../driverPayouts";

const classes: Record<PayoutStatus, string> = {
  ready: "bg-tag-healthcare-bg text-tag-healthcare-fg",
  pending: "bg-tag-warning-bg text-tag-warning-fg",
  "on-hold": "bg-tag-danger-bg text-tag-danger-fg",
};

const dotClasses: Record<PayoutStatus, string> = {
  ready: "bg-success",
  pending: "bg-warning",
  "on-hold": "bg-danger",
};

const labels: Record<PayoutStatus, string> = {
  ready: "Ready",
  pending: "Pending",
  "on-hold": "On Hold",
};

export function PayoutStatusBadge({ status }: { status: PayoutStatus }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-badge rounded-full px-2.5 py-0.5", classes[status])}>
      <span className={cn("h-1.5 w-1.5 rounded-full", dotClasses[status])} />
      {labels[status]}
    </span>
  );
}
