import { cn } from "../../../lib/cn";
import type { TransactionStatus } from "../driverPayouts";

const classes: Record<TransactionStatus, string> = {
  completed: "bg-tag-healthcare-bg text-tag-healthcare-fg",
  processing: "bg-tag-warning-bg text-tag-warning-fg",
  settled: "bg-tag-info-bg text-tag-info-fg",
};

const labels: Record<TransactionStatus, string> = {
  completed: "Completed",
  processing: "Processing",
  settled: "Settled",
};

export function TransactionStatusBadge({ status }: { status: TransactionStatus }) {
  return <span className={cn("text-badge rounded-full px-2.5 py-0.5", classes[status])}>{labels[status]}</span>;
}
