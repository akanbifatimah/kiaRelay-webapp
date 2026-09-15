import { cn } from "../../../lib/cn";
import type { DocumentStatus } from "../complianceDocuments";

const classes: Record<DocumentStatus, string> = {
  approved: "bg-tag-healthcare-bg text-tag-healthcare-fg",
  pending: "bg-tag-warning-bg text-tag-warning-fg",
};

const labels: Record<DocumentStatus, string> = {
  approved: "Approved",
  pending: "Pending",
};

export function DocumentStatusBadge({ status }: { status: DocumentStatus }) {
  return <span className={cn("text-badge rounded-full px-2.5 py-0.5", classes[status])}>{labels[status]}</span>;
}
