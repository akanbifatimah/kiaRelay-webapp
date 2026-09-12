import { cn } from "../../../lib/cn";
import type { RecentOrder } from "../customerDetails";

const activeStatuses = new Set(["in-transit", "pending"]);

const statusClasses: Record<string, string> = {
  "in-transit": "text-warning",
  pending: "text-info",
};

const statusLabels: Record<string, string> = {
  "in-transit": "In Transit",
  pending: "Pending",
};

export function AffectedOrdersList({ orders }: { orders: RecentOrder[] }) {
  const affectedOrders = orders.filter((order) => activeStatuses.has(order.status));

  if (affectedOrders.length === 0) return null;

  return (
    <div className="rounded-lg border border-border">
      <p className="text-label border-b border-border bg-bg px-3 py-2 text-text-muted">
        Active Orders Affected ({affectedOrders.length})
      </p>
      <div className="flex flex-col divide-y divide-border">
        {affectedOrders.map((order) => (
          <div key={order.id} className="flex items-center justify-between px-3 py-2 text-sm">
            <span className="font-medium text-text">{order.id}</span>
            <span className="text-text-muted">{order.route ?? order.date}</span>
            <span className={cn("text-xs font-semibold", statusClasses[order.status])}>
              {statusLabels[order.status]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
