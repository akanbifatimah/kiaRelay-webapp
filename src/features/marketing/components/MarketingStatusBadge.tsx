import { cn } from "../../../lib/cn";
import type { MarketingEmailStatus } from "../data";

// Feature-local, following StatusBadge.tsx's own Record-map pattern rather
// than extending it — that component is hardcoded to OrderStatus.
const dotClasses: Record<MarketingEmailStatus, string> = {
  sent: "bg-success",
  draft: "bg-text-muted",
  scheduled: "bg-info",
  sending: "bg-warning",
  failed: "bg-danger",
};

const textClasses: Record<MarketingEmailStatus, string> = {
  sent: "text-success",
  draft: "text-text-muted",
  scheduled: "text-info",
  sending: "text-warning",
  failed: "text-danger",
};

const labels: Record<MarketingEmailStatus, string> = {
  sent: "Sent",
  draft: "Draft",
  scheduled: "Scheduled",
  sending: "Sending",
  failed: "Failed",
};

interface MarketingStatusBadgeProps {
  status: MarketingEmailStatus;
}

export function MarketingStatusBadge({ status }: MarketingStatusBadgeProps) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-sm font-medium", textClasses[status])}>
      <span className={cn("h-1.5 w-1.5 rounded-full", dotClasses[status], status === "sending" && "animate-pulse")} />
      {labels[status]}
    </span>
  );
}
