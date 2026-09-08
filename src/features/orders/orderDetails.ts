import type { OrderStatus } from "../../components/StatusBadge";
import type { TimelineStep } from "../../components/Timeline";
import type { LatLng } from "./components/OrderRouteMap";
import type { Order } from "./data";

export interface OrderDetail {
  id: string;
  status: OrderStatus;
  customer: string;
  accountNumber: string;
  verified: boolean;
  phone: string;
  dimensions: string;
  weightLbs: number;
  tags: string[];
  pickupAddress: [street: string, cityStateZip: string];
  dropoffAddress: [street: string, cityStateZip: string];
  route?: { pickup: LatLng; dropoff: LatLng; current?: LatLng };
  driverName: string;
  driverVehicle: string;
  driverRating: number;
  timeline: TimelineStep[];
  payment: { label: string; amount: string }[];
  totalPaid: string;
  invoiceNote: string;
}

const HOUSTON: LatLng = { lat: 29.7604, lng: -95.3698 };

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) hash = (hash * 31 + value.charCodeAt(i)) | 0;
  return Math.abs(hash);
}

// TODO: replace with the backend's geocoded pickup/dropoff coordinates and
// live GPS once they exist. These are deterministic mock offsets around
// Houston (matching Dispatch's setting) keyed by order id — not geocoded
// from each order's actual address text — purely so every order's map
// renders a readable zoomed-in city view. Since it's all mock data anyway,
// every order gets a route rather than only the hand-authored example.
function mockRoute(order: Order): NonNullable<OrderDetail["route"]> {
  const seed = hashString(order.id);
  const offset = (bits: number, spread: number) => (((seed >> bits) % 100) / 100 - 0.5) * spread;
  const pickup = { lat: HOUSTON.lat + offset(0, 0.06), lng: HOUSTON.lng + offset(4, 0.06) };
  const dropoff = { lat: HOUSTON.lat + offset(8, 0.06), lng: HOUSTON.lng + offset(12, 0.06) };
  const current =
    order.status === "in-transit"
      ? { lat: (pickup.lat + dropoff.lat) / 2, lng: (pickup.lng + dropoff.lng) / 2 }
      : undefined;
  return { pickup, dropoff, current };
}

// TODO: replace with GET /orders/:id once the Order Monitoring API exists.
// Only the first generated row (#ORD-2800, Acme Refinery — buildOrders()
// in data.ts starts its id counter at 2800, not 2847, so that's the actual
// id that exists in the table) has hand-authored detail matching the Figma
// reference. getOrderDetail() below derives a plausible record (including a
// mock route — see mockRoute()) for every other row so the whole table
// stays clickable and every order shows a map.
const orderDetails: Record<string, OrderDetail> = {
  "#ORD-2800": {
    id: "#ORD-2800",
    status: "in-transit",
    customer: "Acme Refinery",
    accountNumber: "#KR-9921-A",
    verified: true,
    phone: "+1 (555) 012-3456",
    dimensions: "24 x 18 x 12 in",
    weightLbs: 45,
    tags: ["Fragile", "Temp Controlled (2°C - 8°C)"],
    pickupAddress: ["800 Main St, Suite 400", "Houston, TX 77002"],
    dropoffAddress: ["1200 Port Blvd, Gate 3", "Mobile, AL 36602"],
    route: {
      pickup: { lat: 29.7604, lng: -95.3698 },
      dropoff: { lat: 29.775, lng: -95.39 },
      current: { lat: 29.768, lng: -95.38 },
    },
    driverName: "Mike Thompson",
    driverVehicle: "Van #482",
    driverRating: 4.8,
    timeline: [
      { label: "Order Placed", timestamp: "Jul 24, 08:32 AM · By Customer Portal", status: "done" },
      { label: "Assigned to Mike T.", timestamp: "Jul 24, 09:15 AM · Auto-dispatched", status: "done" },
      {
        label: "Picked up",
        timestamp: "Jul 24, 11:45 AM · Verified at Houston Terminal",
        status: "active",
        badge: "Photo",
      },
      { label: "In transit", timestamp: "Expected arrival: Jul 25, 04:00 PM", status: "pending" },
    ],
    payment: [
      { label: "Base Rate", amount: "$95.00" },
      { label: "Express Surcharge (25%)", amount: "$23.75" },
      { label: "Fuel Adjustment", amount: "$5.75" },
    ],
    totalPaid: "$124.50",
    invoiceNote: "Invoice #INV-9283-A processed via Corporate Account",
  },
};

export function getOrderDetail(order: Order): OrderDetail {
  return (
    orderDetails[order.id] ?? {
      id: order.id,
      status: order.status,
      customer: order.customer,
      accountNumber: "—",
      verified: true,
      phone: "+1 (555) 000-0000",
      dimensions: "—",
      weightLbs: 0,
      tags: [],
      pickupAddress: [order.pickup, ""],
      dropoffAddress: [order.dropoff, ""],
      route: mockRoute(order),
      driverName: order.driver,
      driverVehicle: "—",
      driverRating: 0,
      timeline: [{ label: "Order Placed", status: "done" }],
      payment: [{ label: "Total", amount: order.price }],
      totalPaid: order.price,
      invoiceNote: "",
    }
  );
}
