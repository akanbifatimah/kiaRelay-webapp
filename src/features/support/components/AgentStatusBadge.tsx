import { cn } from "../../../lib/cn";
import { availabilityLabels } from "../teamWorkload";
import type { AgentAvailability } from "../types";

const classes: Record<AgentAvailability, string> = {
  online: "bg-success/10 text-success",
  "high-load": "bg-tag-warning-bg text-tag-warning-fg",
  away: "bg-tag-standard-bg text-tag-standard-fg",
  offline: "bg-tag-standard-bg text-text-muted",
};

const dotClasses: Record<AgentAvailability, string> = {
  online: "bg-success",
  "high-load": "bg-warning",
  away: "bg-text-muted",
  offline: "bg-border",
};

export function AgentStatusBadge({ availability }: { availability: AgentAvailability }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium", classes[availability])}>
      <span className={cn("h-1.5 w-1.5 rounded-full", dotClasses[availability])} />
      {availabilityLabels[availability]}
    </span>
  );
}
