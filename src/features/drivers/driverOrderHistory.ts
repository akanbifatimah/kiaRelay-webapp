import type { DeliveryType } from "../../components/TagChip";
import type { OrderStatus } from "../../components/StatusBadge";
import type { DriverDetail } from "./driverDetails";

export interface DriverOrderRecord {
  id: string;
  date: string;
  deliveryType: DeliveryType;
  status: OrderStatus;
  amount: string;
}

const deliveryTypes: DeliveryType[] = ["express", "standard", "overnight", "freight"];
const statuses: OrderStatus[] = ["delivered", "delivered", "in-transit", "delivered", "cancelled"];

function daysAgoDate(n: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - n);
  return date;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// TODO: replace with GET /drivers/:id/orders once the Driver Management API
// exists. Seeds the first rows from the profile's own recentOrders (same
// approach as customerOrderHistory.ts) so both views agree.
export function buildDriverOrderHistory(detail: DriverDetail, count = 30): DriverOrderRecord[] {
  const seeded: DriverOrderRecord[] = detail.recentOrders.map((order, i) => ({
    id: order.id,
    date: formatDate(daysAgoDate(i)),
    deliveryType: deliveryTypes[i % deliveryTypes.length],
    status: order.status,
    amount: order.amount,
  }));

  const generated: DriverOrderRecord[] = Array.from({ length: Math.max(0, count - seeded.length) }, (_, i) => ({
    id: `#ORD-${9800 - i * 3}`,
    date: formatDate(daysAgoDate(i * 3 + 3)),
    deliveryType: deliveryTypes[(i + 1) % deliveryTypes.length],
    status: statuses[i % statuses.length],
    amount: `$${(28 + ((i * 13) % 90)).toFixed(2)}`,
  }));

  return [...seeded, ...generated];
}
