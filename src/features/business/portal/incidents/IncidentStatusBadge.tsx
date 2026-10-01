import { CircleAlert, CircleCheck, Clock, Send, type LucideIcon } from "lucide-react";
import { cn } from "../../../../lib/cn";
import { INCIDENT_STATUS_LABELS } from "../../deliveries/incidents";
import type { IncidentStatus } from "../../deliveries/incidentTypes";

const TONES: Record<IncidentStatus, { cls: string; icon: LucideIcon }> = {
  "action-required": { cls: "border-danger/30 bg-danger/10 text-danger", icon: CircleAlert },
  "under-review": { cls: "border-warning/30 bg-warning/10 text-warning", icon: Clock },
  submitted: { cls: "border-border bg-bg text-sidebar", icon: Send },
  resolved: { cls: "border-success/30 bg-success/10 text-success", icon: CircleCheck },
};

export function IncidentStatusBadge({ status }: { status: IncidentStatus }) {
  const { cls, icon: Icon } = TONES[status];
  return (
    <span className={cn("inline-flex items-center gap-1 whitespace-nowrap rounded-md border px-2 py-0.5 text-xs font-semibold", cls)}>
      <Icon className="h-3 w-3" />
      {INCIDENT_STATUS_LABELS[status]}
    </span>
  );
}
