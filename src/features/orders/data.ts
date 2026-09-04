import type { DeliveryType } from "../../components/TagChip";
import type { OrderStatus } from "../../components/StatusBadge";

export interface Order {
  id: string;
  customer: string;
  industry: string;
  type: DeliveryType;
  pickup: string;
  dropoff: string;
  driver: string;
  price: string;
  status: OrderStatus;
  date: string;
}

const customers = [
  { name: "Acme Refinery", industry: "Refinery" },
  { name: "Vertex Energy", industry: "Energy" },
  { name: "Exxon Mobil", industry: "Refinery" },
  { name: "Chevron", industry: "Refinery" },
  { name: "Shell", industry: "Petrochemical" },
  { name: "Shell Oil Co.", industry: "Petrochemical" },
  { name: "Valero", industry: "Refinery" },
  { name: "Phillips 66", industry: "Petrochemical" },
  { name: "Marathon Petroleum", industry: "Refinery" },
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
      id: `#ORD-${2800 + i}`,
      customer: customer.name,
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
export const orders: Order[] = buildOrders(34);
