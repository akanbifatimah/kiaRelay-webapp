import type { DeliveryType } from "../../components/TagChip";
import type { OrderStatus } from "../../components/StatusBadge";
import { toAdminOrder } from "../business/deliveries/adminBridge";
import { getDeliveries } from "../business/deliveries/deliveriesStore";

export interface Order {
  id: string;
  /** Set for KiaRelay Business/customer-portal orders (Customer Management id). */
  customerId?: string;
  customer: string;
  plan?: string;
  industry: string;
  type: DeliveryType;
  pickup: string;
  dropoff: string;
  driver: string;
  /** Set once an admin assigns a roster driver (Reassign Driver / Assign Ride). */
  driverId?: string;
  driverVehicle?: string;
  price: string;
  status: OrderStatus;
  date: string;
}

// Acme Refinery (KR-77410-JW) isn't generated here any more (2026-09-30):
// its orders come from the customer delivery store (business/deliveries), so
// the KiaRelay Business portal and admin show the same orders.
const customers: { name: string; industry: string; plan?: string }[] = [
  { name: "Citgo Petroleum", industry: "Refinery", plan: "Enterprise Plan" },
  { name: "Vertex Energy", industry: "Energy", plan: "Standard Plan" },
  { name: "Exxon Mobil", industry: "Refinery" },
  { name: "Chevron", industry: "Refinery" },
  { name: "Shell", industry: "Petrochemical" },
  { name: "Shell Oil Co.", industry: "Petrochemical" },
  { name: "Valero", industry: "Refinery", plan: "Enterprise Plan" },
  { name: "Phillips 66", industry: "Petrochemical" },
  { name: "Marathon Petroleum", industry: "Refinery", plan: "Standard Plan" },
  { name: "ConocoPhillips", industry: "Energy" },
];

const routes: [string, string][] = [
  ["Port of Houston", "West Terminal B"],
  ["Laredo Hub", "San Antonio Depot"],
  ["Deer Park", "Galveston"],
  ["Richmond", "California"],
  ["Perris", "Netherlands"],
  ["Baton Rouge", "Mobile AL"],
  ["Beaumont", "Lake Charles"],
  ["Corpus Christi", "Victoria"],
];

const drivers = ["Mike T.", "Sarah L.", "David K.", "Michael L.", "Elena R.", "James O.", "Priya N.", "Carlos V."];
const types: DeliveryType[] = ["express", "freight", "overnight", "standard", "healthcare"];
const statuses: OrderStatus[] = ["delivered", "in-transit", "pending", "cancelled"];

function daysAgo(n: number): string {
  const date = new Date();
  date.setDate(date.getDate() - n);
  return date.toISOString().slice(0, 10);
}

function buildOrders(count: number): Order[] {
  return Array.from({ length: count }, (_, i) => {
    const customer = customers[i % customers.length];
    const [pickup, dropoff] = routes[i % routes.length];
    return {
      id: `#ORD-${2801 + i}`,
      customer: customer.name,
      plan: customer.plan,
      industry: customer.industry,
      type: types[i % types.length],
      pickup,
      dropoff,
      driver: drivers[i % drivers.length],
      price: `$${(180 + ((i * 13) % 90)).toFixed(2)}`,
      status: statuses[i % statuses.length],
      date: daysAgo(i),
    };
  });
}

// TODO: replace with the real Order Monitoring API once it exists (paginated,
// filterable by status/industry/date range, searchable by id/customer).
export const generatedOrders: Order[] = buildOrders(34);

/** Every order at load time: customer deliveries (Acme's history) first.
 * Live views use useOrders() in ordersStore, which tracks new bookings. */
export const orders: Order[] = [...getDeliveries().map((delivery) => toAdminOrder(delivery)), ...generatedOrders];
