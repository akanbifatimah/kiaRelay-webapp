import { Link } from "react-router-dom";
import { cn } from "../../../lib/cn";
import type { BillingActivityRecord } from "../billingActivity";

const statusClasses: Record<BillingActivityRecord["status"], string> = {
  paid: "text-success",
  pending: "text-warning",
  failed: "text-danger",
};

const statusLabels: Record<BillingActivityRecord["status"], string> = {
  paid: "Paid",
  pending: "Pending",
  failed: "Failed",
};

interface RecentBillingActivityCardProps {
  activity: BillingActivityRecord[];
  historyHref: string;
  historyLabel?: string;
}

// Individual accounts are pay-as-you-go (no invoices), so this links to
// their order history instead — CompanyInvoicesPage is company-only.
// Caller decides which via `historyHref`/`historyLabel`.
export function RecentBillingActivityCard({
  activity,
  historyHref,
  historyLabel = "View Invoice History",
}: RecentBillingActivityCardProps) {
  if (activity.length === 0) return null;

  return (
    <div className="flex flex-col gap-3 rounded-[var(--radius-card)] border border-border bg-surface p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text">Recent Billing Activity</h3>
        <Link to={historyHref} className="text-sm font-medium text-primary hover:underline">
          {historyLabel}
        </Link>
      </div>
      <div className="flex flex-col divide-y divide-border">
        {activity.map((entry) => (
          <div key={entry.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
            <div>
              <p className="text-sm font-medium text-text">{entry.description}</p>
              <p className="text-xs text-text-muted">Charged to {entry.chargedTo}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-text">{entry.amount}</p>
              <p className={cn("text-xs font-medium", statusClasses[entry.status])}>{statusLabels[entry.status]}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
