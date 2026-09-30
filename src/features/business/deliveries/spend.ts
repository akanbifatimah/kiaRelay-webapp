import { eventTime, stageOf } from "./deliverySim";
import { orderTotal } from "./invoices";
import type { DeliveryOrder } from "./deliveryTypes";

// Usage & Spend (2026-09-30), derived from the account's own orders; same
// math as the customer app's src/lib/spend.ts. Cancelled orders don't count.
// TODO: GET /customers/:id/spend once reporting has an API.

export interface MonthSpend {
  key: string;
  label: string;
  total: number;
  count: number;
}

const billedAt = (order: DeliveryOrder) => new Date(eventTime(order, "delivered") ?? order.createdAt);

function billable(orders: DeliveryOrder[], now: number) {
  return orders.filter((order) => stageOf(order, now) !== "cancelled");
}

/** The last `months` calendar months, oldest first. */
export function spendByMonth(orders: DeliveryOrder[], now = Date.now(), months = 6): MonthSpend[] {
  const current = new Date(now);
  const buckets: MonthSpend[] = Array.from({ length: months }, (_, i) => {
    const d = new Date(current.getFullYear(), current.getMonth() - (months - 1 - i), 1);
    return { key: `${d.getFullYear()}-${d.getMonth()}`, label: d.toLocaleDateString("en-US", { month: "short" }), total: 0, count: 0 };
  });
  for (const order of billable(orders, now)) {
    const d = billedAt(order);
    const bucket = buckets.find((b) => b.key === `${d.getFullYear()}-${d.getMonth()}`);
    if (bucket) {
      bucket.total += orderTotal(order);
      bucket.count += 1;
    }
  }
  return buckets;
}

/** Spend per branch (Business), largest first. */
export function spendByBranch(orders: DeliveryOrder[], now = Date.now()): { branch: string; total: number; count: number }[] {
  const map = new Map<string, { total: number; count: number }>();
  for (const order of billable(orders, now)) {
    const key = order.branch || "Unassigned";
    const entry = map.get(key) ?? { total: 0, count: 0 };
    map.set(key, { total: entry.total + orderTotal(order), count: entry.count + 1 });
  }
  return [...map.entries()].map(([branch, v]) => ({ branch, ...v })).sort((a, b) => b.total - a.total);
}
