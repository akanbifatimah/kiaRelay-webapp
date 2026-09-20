import { cn } from "../../../lib/cn";
import type { FinanceTransactionStatus } from "../financeTransactions";

const classes: Record<FinanceTransactionStatus, string> = {
  paid: "bg-tag-healthcare-bg text-tag-healthcare-fg",
  pending: "bg-tag-warning-bg text-tag-warning-fg",
  overdue: "bg-tag-danger-bg text-tag-danger-fg",
};

const labels: Record<FinanceTransactionStatus, string> = {
  paid: "Paid",
  pending: "Pending",
  overdue: "Overdue",
};

export function FinanceTransactionStatusBadge({ status }: { status: FinanceTransactionStatus }) {
  return <span className={cn("text-badge rounded-full px-2.5 py-0.5", classes[status])}>{labels[status]}</span>;
}
