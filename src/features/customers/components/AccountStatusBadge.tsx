import { cn } from "../../../lib/cn";
import type { CustomerStatus } from "../data";

const classes: Record<CustomerStatus, string> = {
  active: "bg-tag-healthcare-bg text-tag-healthcare-fg",
  suspended: "bg-tag-danger-bg text-tag-danger-fg",
};

const labels: Record<CustomerStatus, string> = {
  active: "Active",
  suspended: "Suspended",
};

export function AccountStatusBadge({ status }: { status: CustomerStatus }) {
  return (
    <span className={cn("text-badge rounded-full px-2.5 py-0.5", classes[status])}>{labels[status]}</span>
  );
}
