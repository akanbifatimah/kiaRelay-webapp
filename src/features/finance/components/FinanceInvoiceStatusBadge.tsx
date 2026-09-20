import { cn } from "../../../lib/cn";
import type { FinanceInvoiceStatus } from "../companyInvoicesOverview";

const classes: Record<FinanceInvoiceStatus, string> = {
  paid: "bg-tag-healthcare-bg text-tag-healthcare-fg",
  overdue: "bg-tag-danger-bg text-tag-danger-fg",
  sent: "bg-tag-info-bg text-tag-info-fg",
};

const labels: Record<FinanceInvoiceStatus, string> = {
  paid: "Paid",
  overdue: "Overdue",
  sent: "Sent",
};

export function FinanceInvoiceStatusBadge({ status }: { status: FinanceInvoiceStatus }) {
  return <span className={cn("text-badge rounded-full px-2.5 py-0.5", classes[status])}>{labels[status]}</span>;
}
