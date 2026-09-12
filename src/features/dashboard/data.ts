import type { Accent, StatDelta } from "../../components/StatTile";
import { customers } from "../customers/data";

export interface RevenuePoint {
  label: string;
  revenue: number;
}

export interface VolumePoint {
  label: string;
  orders: number;
  highlighted?: boolean;
}

export interface TopCustomer {
  id: string;
  accountType: "individual" | "company";
  name: string;
  orders: number;
  revenue: string;
}

export interface TopDriver {
  name: string;
  deliveries: number;
  rating: number;
}

export interface StatDatum {
  label: string;
  value: string;
  accent: Accent;
  delta?: StatDelta;
}

export type DateRangeKey = "today" | "7d" | "30d" | "custom";

export interface CustomRange {
  from: string;
  to: string;
}

export function getDefaultCustomRange(): CustomRange {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - 6);
  const format = (date: Date) => date.toISOString().slice(0, 10);
  return { from: format(from), to: format(to) };
}

export interface DashboardSnapshot {
  stats: StatDatum[];
  revenueTrend: RevenuePoint[];
  deliveryVolume: VolumePoint[];
}

function seededRandom(seed: string): () => number {
  let state = 0;
  for (let i = 0; i < seed.length; i += 1) state = (state * 31 + seed.charCodeAt(i)) | 0;
  return () => {
    state = (state * 1664525 + 1013904223) | 0;
    return ((state >>> 0) % 1000) / 1000;
  };
}

// TODO: replace with GET /api/dashboard?from=<from>&to=<to> once the
// reporting API exists. Values here are deterministically derived from the
// picked range (seeded by from+to), not real data — they exist so the
// Custom picker has something plausible to show, and so a real API response
// with this exact shape is a drop-in replacement.
export function buildCustomSnapshot(from: string, to: string): DashboardSnapshot {
  const start = new Date(from);
  const end = new Date(to);
  const dayCount = Math.max(1, Math.round((end.getTime() - start.getTime()) / 86_400_000) + 1);
  const bucketCount = Math.min(7, dayCount);
  const rand = seededRandom(`${from}_${to}`);

  const revenueTrend: RevenuePoint[] = Array.from({ length: bucketCount }, (_, i) => {
    const offset = bucketCount > 1 ? Math.round((i * (dayCount - 1)) / (bucketCount - 1)) : 0;
    const bucketDate = new Date(start.getTime() + offset * 86_400_000);
    return {
      label: bucketDate.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      revenue: Math.round(8000 + rand() * 20000),
    };
  });

  const deliveryVolume: VolumePoint[] = revenueTrend.map((point, i) => ({
    label: point.label,
    orders: Math.round(80 + rand() * 300),
    highlighted: i === revenueTrend.length - 1,
  }));

  const totalRevenue = revenueTrend.reduce((sum, point) => sum + point.revenue, 0);
  const totalOrders = deliveryVolume.reduce((sum, point) => sum + point.orders, 0);

  return {
    stats: [
      {
        label: "Daily Revenue",
        value: `$${Math.round(totalRevenue / dayCount).toLocaleString()}`,
        accent: "primary",
        delta: { kind: "up", value: `${(rand() * 15).toFixed(1)}%` },
      },
      { label: "Active Deliveries", value: totalOrders.toLocaleString(), accent: "neutral" },
      {
        label: "Total Revenue",
        value: `$${totalRevenue.toLocaleString()}`,
        accent: "neutral",
        delta: { kind: "down" },
      },
      {
        label: "Active Drivers",
        value: `${Math.round(450 + rand() * 150)}`,
        accent: "success",
        delta: { kind: "increase", value: `${Math.round(rand() * 30)}` },
      },
      {
        label: "Avg Response",
        value: `${(3.5 + rand() * 2).toFixed(1)}m`,
        accent: "primary",
        delta: { kind: rand() > 0.5 ? "up" : "down", value: `${rand().toFixed(1)}m` },
      },
    ],
    revenueTrend,
    deliveryVolume,
  };
}

// TODO: replace with the real reporting API; not yet range-scoped. Derived
// from the same mock `customers` dataset the Customers module uses (sorted
// by order volume) rather than a disconnected set of fictional company
// names, so each row is a real, clickable profile — not just a label.
export const topCustomers: TopCustomer[] = [...customers]
  .sort((a, b) => b.orders - a.orders)
  .slice(0, 4)
  .map((customer) => ({
    id: customer.id,
    accountType: customer.accountType,
    name: customer.name,
    orders: customer.orders,
    revenue: `$${Math.round(customer.orders * 37.5).toLocaleString("en-US")}`,
  }));

export const topDrivers: TopDriver[] = [
  { name: "John Doe", deliveries: 142, rating: 4.9 },
  { name: "Sarah Jenkins", deliveries: 130, rating: 4.9 },
  { name: "Mike Ross", deliveries: 125, rating: 4.8 },
  { name: "Emily Wong", deliveries: 110, rating: 4.8 },
];
