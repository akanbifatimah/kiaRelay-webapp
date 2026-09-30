import type { OrderStatus } from "../../components/StatusBadge";
import type { TimelineStep } from "../../components/Timeline";
import type { LatLng } from "./components/OrderRouteMap";
import type { Order } from "./data";
import { toOrderDetail } from "../business/deliveries/adminBridge";
import { findDelivery } from "../business/deliveries/deliveriesStore";

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
// Customer deliveries (incl. the Figma reference record #ORD-2800, now an
// Acme Refinery delivery — 2026-09-30) are derived from the delivery the
// customer booked; other orders use the thin generic record below.
export function getOrderDetail(order: Order): OrderDetail {
  const delivery = findDelivery(order.id);
  if (delivery) return { ...toOrderDetail(delivery), route: mockRoute(order) };
  return {
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
  };
}
