import { cn } from "../../../lib/cn";
import type { PerformanceTone } from "../data";

// "Good / Okay / Poor" performance pill used on the dashboard's Recent
// Emails list and the Email Results area breakdown — reuses the existing
// success/warning/danger tokens rather than inventing new colors (rule 6).
const pillClasses: Record<PerformanceTone, string> = {
  good: "bg-tag-healthcare-bg text-success",
  okay: "bg-tag-warning-bg text-warning",
  poor: "bg-tag-danger-bg text-danger",
};

const labels: Record<PerformanceTone, string> = {
  good: "Good",
  okay: "Okay",
  poor: "Poor",
};

interface MarketingPerformanceBadgeProps {
  tone: PerformanceTone;
}

export function MarketingPerformanceBadge({ tone }: MarketingPerformanceBadgeProps) {
  return <span className={cn("text-badge rounded-full px-3 py-1", pillClasses[tone])}>{labels[tone]}</span>;
}
