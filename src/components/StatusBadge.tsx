import { cn } from "../lib/cn";

export type OrderStatus = "delivered" | "in-transit" | "pending" | "cancelled";

const dotClasses: Record<OrderStatus, string> = {
  delivered: "bg-success",
  "in-transit": "bg-info",
  pending: "bg-warning",
  cancelled: "bg-danger",
};

const labels: Record<OrderStatus, string> = {
  delivered: "Delivered",
  "in-transit": "In Transit",
  pending: "Pending",
  cancelled: "Cancelled",
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-text">
      <span className={cn("h-1.5 w-1.5 rounded-full", dotClasses[status])} />
      {labels[status]}
    </span>
  );
}
