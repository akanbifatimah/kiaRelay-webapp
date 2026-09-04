import { useState } from "react";
import { cn } from "../../../lib/cn";
import { OrderQueueCard } from "./OrderQueueCard";
import type { DeliveryType } from "../../../components/TagChip";
import type { QueuedOrder } from "../data";

type QueueFilter = "all" | Extract<DeliveryType, "express" | "healthcare">;

interface OrderQueueProps {
  orders: QueuedOrder[];
  onAssign: (order: QueuedOrder) => void;
}

const dotClasses: Record<Exclude<QueueFilter, "all">, string> = {
  express: "bg-tag-express-fg",
  healthcare: "bg-tag-healthcare-fg",
};

export function OrderQueue({ orders, onAssign }: OrderQueueProps) {
  const [filter, setFilter] = useState<QueueFilter>("all");
  const filtered = filter === "all" ? orders : orders.filter((order) => order.type === filter);

  const filters: { key: QueueFilter; label: string }[] = [
    { key: "all", label: `All (${orders.length})` },
    { key: "express", label: "Express" },
    { key: "healthcare", label: "Healthcare" },
  ];

  return (
    <div className="flex h-full flex-col gap-3 rounded-[var(--radius-card)] border border-border bg-surface p-4">
      <h2 className="text-sm font-semibold text-text">Order Queue</h2>
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
              filter === f.key
                ? "bg-sidebar text-white"
                : "border border-border bg-surface text-text hover:bg-bg",
            )}
          >
            {f.key !== "all" && filter !== f.key && (
              <span className={cn("h-1.5 w-1.5 rounded-full", dotClasses[f.key])} />
            )}
            {f.label}
          </button>
        ))}
      </div>
      <div className="flex flex-1 flex-col gap-2 overflow-y-auto">
        {filtered.length === 0 ? (
          <p className="py-6 text-center text-sm text-text-muted">No orders match this filter.</p>
        ) : (
          filtered.map((order) => (
            <OrderQueueCard key={order.id} order={order} onAssign={() => onAssign(order)} />
          ))
        )}
      </div>
    </div>
  );
}
