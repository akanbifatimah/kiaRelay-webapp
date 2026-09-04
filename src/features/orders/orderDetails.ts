import type { OrderStatus } from "../../components/StatusBadge";
import type { TimelineStep } from "../../components/Timeline";
import type { Order } from "./data";

export interface OrderDetail {
  id: string;
  status: OrderStatus;
  customer: string;
  verified: boolean;
  phone: string;
  dimensions: string;
  weightLbs: number;
  tags: string[];
  pickupAddress: string;
  dropoffAddress: string;
  driverName: string;
  driverVehicle: string;
  driverRating: number;
  timeline: TimelineStep[];
  payment: { label: string; amount: string }[];
  totalPaid: string;
  invoiceNote: string;
}

// TODO: replace with GET /orders/:id once the Order Monitoring API exists.
// Only #ORD-2847 has hand-authored detail matching the Figma reference;
// getOrderDetail() below derives a plausible record for every other row so
// the whole table stays clickable.
const orderDetails: Record<string, OrderDetail> = {
  "#ORD-2847": {
    id: "#ORD-2847",
    status: "in-transit",
    customer: "Acme Refinery",
    verified: true,
    phone: "+1 (555) 012-3456",
    dimensions: "24 x 18 x 12 in",
    weightLbs: 45,
    tags: ["Fragile", "Temp Controlled (2-8°C)"],
    pickupAddress: "800 Main St, Suite 400, Houston, TX 77003",
    dropoffAddress: "1200 Port Blvd, Gate 3, Mobile, AL 36602",
    driverName: "Mike Thompson",
    driverVehicle: "Van #123",
    driverRating: 4.9,
    timeline: [
      { label: "Order Placed", timestamp: "Jul 24, 08:22 AM · By Customer Portal", status: "done" },
      { label: "Assigned to Mike T.", timestamp: "Jul 24, 09:15 AM · Auto-dispatched", status: "done" },
      { label: "Picked up", timestamp: "Jul 24, 11:45 AM · Verified at Houston Terminal", status: "active" },
      { label: "In transit", timestamp: "Expected arrival Jul 25, 04:00 PM", status: "pending" },
    ],
    payment: [
      { label: "Base Rate", amount: "$95.00" },
      { label: "Express Surcharge (25%)", amount: "$23.75" },
      { label: "Fuel Adjustment", amount: "$5.75" },
    ],
    totalPaid: "$124.50",
    invoiceNote: "Invoice #INV-1023-A processed via Corporate Account",
  },
};

export function getOrderDetail(order: Order): OrderDetail {
  return (
    orderDetails[order.id] ?? {
      id: order.id,
      status: order.status,
      customer: order.customer,
      verified: true,
      phone: "+1 (555) 000-0000",
      dimensions: "—",
      weightLbs: 0,
      tags: [],
      pickupAddress: order.pickup,
      dropoffAddress: order.dropoff,
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
