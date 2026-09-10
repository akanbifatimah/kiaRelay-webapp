import { cn } from "../../../lib/cn";
import type { OnboardingStatus } from "../data";

const classes: Record<OnboardingStatus, string> = {
  pending: "bg-tag-warning-bg text-tag-warning-fg",
  approved: "bg-tag-healthcare-bg text-tag-healthcare-fg",
  rejected: "bg-tag-danger-bg text-tag-danger-fg",
};

const labels: Record<OnboardingStatus, string> = {
  pending: "Pending Review",
  approved: "Approved",
  rejected: "Rejected",
};

export function OnboardingStatusBadge({ status }: { status: OnboardingStatus }) {
  return <span className={cn("text-badge rounded-full px-2.5 py-0.5", classes[status])}>{labels[status]}</span>;
}
