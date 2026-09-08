import { cn } from "../lib/cn";

export type OrderStatus = "delivered" | "in-transit" | "pending" | "cancelled";

// Confirmed against the Order Monitoring table screenshot (2026-09-08):
// Delivered reads blue, In Transit reads orange, consistently across every
// visible row — the reverse of what was here before.
const dotClasses: Record<OrderStatus, string> = {
  delivered: "bg-info",
  "in-transit": "bg-warning",
  pending: "bg-text-muted",
  cancelled: "bg-danger",
};

const textClasses: Record<OrderStatus, string> = {
  delivered: "text-info",
  "in-transit": "text-warning",
  pending: "text-text-muted",
  cancelled: "text-danger",
};

// Pill variant: confirmed against the Order Detail panel header (2026-09-08)
// — a colored bg/fg pill, not the dot+text treatment tables use.
const pillClasses: Record<OrderStatus, string> = {
  delivered: "bg-tag-info-bg text-tag-info-fg",
  "in-transit": "bg-tag-warning-bg text-tag-warning-fg",
  pending: "bg-tag-standard-bg text-tag-standard-fg",
  cancelled: "bg-tag-danger-bg text-tag-danger-fg",
};

const labels: Record<OrderStatus, string> = {
  delivered: "Delivered",
  "in-transit": "In Transit",
  pending: "Pending",
  cancelled: "Cancelled",
};

interface StatusBadgeProps {
  status: OrderStatus;
  variant?: "dot" | "pill";
}

export function StatusBadge({ status, variant = "dot" }: StatusBadgeProps) {
  if (variant === "pill") {
    return (
      <span className={cn("text-badge rounded-full px-3 py-1", pillClasses[status])}>{labels[status]}</span>
    );
  }

  return (
    <span className={cn("inline-flex items-center gap-1.5 text-sm font-medium", textClasses[status])}>
      <span className={cn("h-1.5 w-1.5 rounded-full", dotClasses[status])} />
      {labels[status]}
    </span>
  );
}
