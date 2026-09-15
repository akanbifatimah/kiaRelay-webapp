import type { OrderStatus } from "../../components/StatusBadge";
import type { TimelineStep } from "../../components/Timeline";
import { drivers } from "./driverRoster";

export interface DriverContact {
  email: string;
  phone: string;
  address: string;
}

export interface DriverVehicleAssignment {
  name: string;
  vin: string;
  plate: string;
  payloadCapacity: string;
}

export interface DriverLicense {
  label: string;
  expiryDate: string;
  daysUntilExpiry: number;
  urgent: boolean;
}

export interface DriverOrderSummary {
  id: string;
  amount: string;
  status: OrderStatus;
  timeLabel: string;
}

export interface DriverDetail {
  id: string;
  name: string;
  lastActiveLabel: string;
  reliabilityPct: number;
  rating: number;
  deliveries: number;
  walletBalance: number;
  contact: DriverContact;
  vehicle: DriverVehicleAssignment;
  license: DriverLicense;
  recentOrders: DriverOrderSummary[];
  activityLog: TimelineStep[];
}

// TODO: replace with GET /drivers/:id once the Driver Management API exists.
// Only Marcus Thorne (DR-08190 — same record as driverRoster.ts's hand-
// authored row) matches the Figma reference; every other driver id falls
// back to buildGenericDetail() below, same pattern as customerDetails.ts.
const handAuthored: Record<string, DriverDetail> = {
  "DR-08190": {
    id: "DR-08190",
    name: "Marcus Thorne",
    lastActiveLabel: "Last active 32m ago",
    reliabilityPct: 84,
    rating: 4.8,
    deliveries: 1247,
    walletBalance: 640.0,
    contact: {
      email: "m.thorne@express-logistics.com",
      phone: "+1 (555) 012-4493",
      address: "2841 Industrial Dr, Ste 400, Columbus OH 43215",
    },
    vehicle: {
      name: "Freightliner M2",
      vin: "1FUJGHDV8CLBP1234",
      plate: "OH-9KR-FR6",
      payloadCapacity: "26,000 lb",
    },
    license: {
      label: "CDL Class A License",
      expiryDate: "Sept 28, 2026",
      daysUntilExpiry: 14,
      urgent: true,
    },
    recentOrders: [
      { id: "#ORD-9921-X", amount: "$42.50", status: "delivered", timeLabel: "2h ago" },
      { id: "#ORD-9918-B", amount: "$38.20", status: "delivered", timeLabel: "Yesterday" },
      { id: "#ORD-9902-C", amount: "$51.00", status: "delivered", timeLabel: "2 days ago" },
    ],
    activityLog: [
      { label: "Order #3921 Delivered", timestamp: "Today at 10:42 AM", status: "done" },
      { label: "Started Trip (Columbus Hub)", timestamp: "Today at 9:15 AM", status: "done" },
      { label: "Driver Logged In", timestamp: "Today at 8:50 AM", status: "done" },
      { label: "Off-Duty Rest Period", timestamp: "Yesterday at 6:00 PM", status: "done" },
    ],
  },
};

// Same "honest but generic" fix already applied to customers' fallback
// (customerDetailsFallback.ts) — an empty list made the card look broken
// rather than just backed by mock data.
function buildGenericRecentOrders(): DriverOrderSummary[] {
  return [
    { id: "#ORD-9700-A", amount: "$36.00", status: "delivered", timeLabel: "1 day ago" },
    { id: "#ORD-9688-B", amount: "$29.50", status: "delivered", timeLabel: "3 days ago" },
    { id: "#ORD-9671-C", amount: "$44.75", status: "delivered", timeLabel: "5 days ago" },
  ];
}

function buildGenericDetail(id: string, name: string): DriverDetail {
  return {
    id,
    name,
    lastActiveLabel: "Last active recently",
    reliabilityPct: 75,
    rating: 4.5,
    deliveries: 0,
    walletBalance: 0,
    contact: { email: "—", phone: "—", address: "—" },
    vehicle: { name: "Unassigned", vin: "—", plate: "—", payloadCapacity: "—" },
    license: { label: "CDL Class A License", expiryDate: "—", daysUntilExpiry: 999, urgent: false },
    recentOrders: buildGenericRecentOrders(),
    activityLog: [{ label: "Driver Logged In", timestamp: "Recently", status: "done" }],
  };
}

export function getDriverDetail(id: string): DriverDetail | null {
  if (handAuthored[id]) return handAuthored[id];
  const roster = drivers.find((d) => d.id === id);
  return roster ? buildGenericDetail(roster.id, roster.name) : null;
}
