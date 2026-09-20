import { cn } from "../../../lib/cn";
import type { PayoutRegisterStatus } from "../driverPayoutsOverview";

const classes: Record<PayoutRegisterStatus, string> = {
  pending: "bg-tag-warning-bg text-tag-warning-fg",
  paid: "bg-tag-healthcare-bg text-tag-healthcare-fg",
  processed: "bg-tag-info-bg text-tag-info-fg",
  failed: "bg-tag-danger-bg text-tag-danger-fg",
};

const labels: Record<PayoutRegisterStatus, string> = {
  pending: "Pending",
  paid: "Paid",
  processed: "Processed",
  failed: "Failed",
};

export function PayoutRegisterStatusBadge({ status }: { status: PayoutRegisterStatus }) {
  return <span className={cn("text-badge rounded-full px-2.5 py-0.5", classes[status])}>{labels[status]}</span>;
}
