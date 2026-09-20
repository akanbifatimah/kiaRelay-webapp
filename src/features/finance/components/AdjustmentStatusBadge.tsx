import { cn } from "../../../lib/cn";
import type { AdjustmentStatus } from "../adjustments";

const classes: Record<AdjustmentStatus, string> = {
  pending: "bg-tag-warning-bg text-tag-warning-fg",
  processed: "bg-tag-healthcare-bg text-tag-healthcare-fg",
  failed: "bg-tag-danger-bg text-tag-danger-fg",
};

const labels: Record<AdjustmentStatus, string> = {
  pending: "Pending",
  processed: "Processed",
  failed: "Failed",
};

export function AdjustmentStatusBadge({ status }: { status: AdjustmentStatus }) {
  return <span className={cn("text-badge rounded-full px-2.5 py-0.5", classes[status])}>{labels[status]}</span>;
}
