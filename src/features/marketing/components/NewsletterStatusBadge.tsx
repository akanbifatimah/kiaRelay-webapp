import { RefreshCw } from "lucide-react";
import { cn } from "../../../lib/cn";
import type { NewsletterStatus } from "../newsletters";

// Feature-local, following StatusBadge.tsx's own Record-map pattern — five
// pill states, one more than MarketingStatusBadge's (adds "paused").
const pillClasses: Record<NewsletterStatus, string> = {
  sent: "bg-tag-healthcare-bg text-success",
  scheduled: "bg-tag-overnight-bg text-tag-overnight-fg",
  sending: "bg-tag-info-bg text-info",
  draft: "bg-tag-standard-bg text-text-muted",
  paused: "bg-tag-warning-bg text-warning",
};

const labels: Record<NewsletterStatus, string> = {
  sent: "Sent",
  scheduled: "Scheduled",
  sending: "Sending",
  draft: "Draft",
  paused: "Paused",
};

interface NewsletterStatusBadgeProps {
  status: NewsletterStatus;
}

export function NewsletterStatusBadge({ status }: NewsletterStatusBadgeProps) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium", pillClasses[status])}>
      {status === "sending" && <RefreshCw className="h-3 w-3 animate-spin" />}
      {labels[status]}
    </span>
  );
}
