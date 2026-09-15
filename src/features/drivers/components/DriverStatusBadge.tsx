import { cn } from "../../../lib/cn";
import type { DriverStatus } from "../driverRoster";

// Reuses the app's existing status-color language (StatusBadge's dot variant):
// green=success, orange=warning, blue=info — not new colors invented for this table.
const dotClasses: Record<DriverStatus, string> = {
  online: "bg-success",
  "in-transit": "bg-warning",
  offline: "bg-text-muted",
  delivered: "bg-info",
  suspended: "bg-danger",
};

const textClasses: Record<DriverStatus, string> = {
  online: "text-success",
  "in-transit": "text-warning",
  offline: "text-text-muted",
  delivered: "text-info",
  suspended: "text-danger",
};

const labels: Record<DriverStatus, string> = {
  online: "Online",
  "in-transit": "In Transit",
  offline: "Offline",
  delivered: "Delivered",
  suspended: "Suspended",
};

export function DriverStatusBadge({ status }: { status: DriverStatus }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-sm font-medium", textClasses[status])}>
      <span className={cn("h-1.5 w-1.5 rounded-full", dotClasses[status])} />
      {labels[status]}
    </span>
  );
}
