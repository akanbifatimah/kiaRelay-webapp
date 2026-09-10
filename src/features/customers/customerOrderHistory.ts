import type { DeliveryType } from "../../components/TagChip";
import type { OrderStatus } from "../../components/StatusBadge";
import type { CustomerDetail } from "./customerDetails";

export interface CustomerOrderRecord {
  id: string;
  date: string;
  deliveryType: DeliveryType;
  status: OrderStatus;
  paymentMethod: string;
  amount: string;
}

const paymentMethods = ["Visa •••• 4242", "Kia Wallet", "PayPal", "Chase ACH"];
const deliveryTypes: DeliveryType[] = ["express", "standard", "overnight", "freight"];
const statuses: OrderStatus[] = ["delivered", "in-transit", "delivered", "cancelled", "delivered"];

function daysAgoDate(n: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - n);
  return date;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// TODO: replace with GET /customers/:id/orders once the Customer Management
// API exists. Seeds the first rows from the profile's own recentOrders so
// the two views agree, then pads out to `count` with generated rows dated
// relative to today (not a fixed year) so the Date Range filter has
// something real to filter against.
export function buildCustomerOrderHistory(detail: CustomerDetail, count = 42): CustomerOrderRecord[] {
  const seeded: CustomerOrderRecord[] = detail.recentOrders.map((order, i) => ({
    id: order.id,
    date: order.date,
    deliveryType: deliveryTypes[i % deliveryTypes.length],
    status: order.status,
    paymentMethod: paymentMethods[i % paymentMethods.length],
    amount: order.amount,
  }));

  const generated: CustomerOrderRecord[] = Array.from({ length: Math.max(0, count - seeded.length) }, (_, i) => ({
    id: `#KR-${97000 - i * 13}`,
    date: formatDate(daysAgoDate(i * 4)),
    deliveryType: deliveryTypes[(i + 1) % deliveryTypes.length],
    status: statuses[i % statuses.length],
    paymentMethod: paymentMethods[(i + 2) % paymentMethods.length],
    amount: `$${(40 + ((i * 17) % 200)).toFixed(2)}`,
  }));

  return [...seeded, ...generated];
}
