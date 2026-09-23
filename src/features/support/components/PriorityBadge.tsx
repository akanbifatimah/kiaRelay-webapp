import { AlertCircle, ChevronUp, Equal, ChevronDown } from "lucide-react";
import { cn } from "../../../lib/cn";
import { priorityLabels, type TicketPriority } from "../types";

const icons = { critical: AlertCircle, high: ChevronUp, medium: Equal, low: ChevronDown };

const pillClasses: Record<TicketPriority, string> = {
  critical: "border-danger/30 bg-tag-danger-bg text-tag-danger-fg",
  high: "border-warning/30 bg-tag-warning-bg text-tag-warning-fg",
  medium: "border-border bg-tag-standard-bg text-tag-standard-fg",
  low: "border-border bg-tag-standard-bg text-tag-standard-fg",
};

const textClasses: Record<TicketPriority, string> = {
  critical: "text-danger",
  high: "text-warning",
  medium: "text-text-muted",
  low: "text-text-muted",
};

interface PriorityBadgeProps {
  priority: TicketPriority;
  /** "pill" = Unassigned Tickets' bordered chip; "text" = My Tickets' bare
   * icon + colored label. Two distinct treatments in the designs. */
  variant?: "pill" | "text";
}

export function PriorityBadge({ priority, variant = "pill" }: PriorityBadgeProps) {
  const Icon = icons[priority];
  if (variant === "text") {
    return (
      <span className={cn("inline-flex items-center gap-1 whitespace-nowrap text-sm font-medium", textClasses[priority])}>
        <Icon className="h-3.5 w-3.5" />
        {priorityLabels[priority]}
      </span>
    );
  }
  return (
    <span className={cn("inline-flex items-center gap-1 whitespace-nowrap rounded border px-1.5 py-0.5 text-xs font-medium", pillClasses[priority])}>
      <Icon className="h-3 w-3" />
      {priorityLabels[priority]}
    </span>
  );
}
