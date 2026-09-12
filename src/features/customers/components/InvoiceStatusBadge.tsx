import { cn } from "../../../lib/cn";
import type { InvoiceStatus } from "../companyInvoices";

const classes: Record<InvoiceStatus, string> = {
  paid: "bg-tag-healthcare-bg text-tag-healthcare-fg",
  overdue: "bg-tag-danger-bg text-tag-danger-fg",
  pending: "bg-tag-warning-bg text-tag-warning-fg",
};

const labels: Record<InvoiceStatus, string> = {
  paid: "Paid",
  overdue: "Overdue",
  pending: "Pending",
};

export function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
  return <span className={cn("text-badge rounded-full px-2.5 py-0.5", classes[status])}>{labels[status]}</span>;
}
