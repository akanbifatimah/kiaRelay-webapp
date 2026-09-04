import type { Accent, StatDelta } from "../../components/StatTile";

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

// TODO: replace with GET /api/dashboard?range=<key> once the reporting API exists.
export const dashboardByRange: Record<Exclude<DateRangeKey, "custom">, DashboardSnapshot> = {
  today: {
    stats: [
      { label: "Daily Revenue", value: "$24,500", accent: "primary", delta: { kind: "up", value: "8.2%" } },
      { label: "Active Deliveries", value: "342", accent: "neutral" },
      { label: "Total Revenue", value: "$584,120", accent: "neutral", delta: { kind: "down" } },
      { label: "Active Drivers", value: "487", accent: "success", delta: { kind: "increase", value: "12" } },
      { label: "Avg Response", value: "4.2m", accent: "primary", delta: { kind: "down", value: "0.8m" } },
    ],
    revenueTrend: [
      { label: "9am", revenue: 1200 },
      { label: "11am", revenue: 2400 },
      { label: "1pm", revenue: 4100 },
      { label: "3pm", revenue: 5200 },
      { label: "5pm", revenue: 4300 },
      { label: "7pm", revenue: 3100 },
    ],
    deliveryVolume: [
      { label: "9am", orders: 38 },
      { label: "11am", orders: 64 },
      { label: "1pm", orders: 92 },
      { label: "3pm", orders: 110, highlighted: true },
      { label: "5pm", orders: 87 },
      { label: "7pm", orders: 51 },
    ],
  },
  "7d": {
    stats: [
      { label: "Daily Revenue", value: "$168,400", accent: "primary", delta: { kind: "up", value: "5.4%" } },
      { label: "Active Deliveries", value: "2,150", accent: "neutral" },
      { label: "Total Revenue", value: "$584,120", accent: "neutral", delta: { kind: "down" } },
      { label: "Active Drivers", value: "512", accent: "success", delta: { kind: "increase", value: "8" } },
      { label: "Avg Response", value: "4.5m", accent: "primary", delta: { kind: "down", value: "0.3m" } },
    ],
    revenueTrend: [
      { label: "Mon", revenue: 12000 },
      { label: "Tue", revenue: 15500 },
      { label: "Wed", revenue: 14000 },
      { label: "Thu", revenue: 21000 },
      { label: "Fri", revenue: 24500 },
      { label: "Sat", revenue: 18000 },
      { label: "Sun", revenue: 13500 },
    ],
    deliveryVolume: [
      { label: "Mon", orders: 210 },
      { label: "Tue", orders: 180 },
      { label: "Wed", orders: 240 },
      { label: "Thu", orders: 300 },
      { label: "Fri", orders: 380, highlighted: true },
      { label: "Sat", orders: 150 },
      { label: "Sun", orders: 90 },
    ],
  },
  "30d": {
    stats: [
      { label: "Daily Revenue", value: "$712,900", accent: "primary", delta: { kind: "up", value: "12.1%" } },
      { label: "Active Deliveries", value: "8,940", accent: "neutral" },
      { label: "Total Revenue", value: "$584,120", accent: "neutral", delta: { kind: "down" } },
      { label: "Active Drivers", value: "540", accent: "success", delta: { kind: "increase", value: "24" } },
      { label: "Avg Response", value: "4.8m", accent: "primary", delta: { kind: "up", value: "0.4m" } },
    ],
    revenueTrend: [
      { label: "Week 1", revenue: 98000 },
      { label: "Week 2", revenue: 112000 },
      { label: "Week 3", revenue: 105000 },
      { label: "Week 4", revenue: 130000 },
    ],
    deliveryVolume: [
      { label: "Week 1", orders: 1450 },
      { label: "Week 2", orders: 1620 },
      { label: "Week 3", orders: 1380 },
      { label: "Week 4", orders: 1950, highlighted: true },
    ],
  },
};

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

// TODO: replace with the real reporting API; not yet range-scoped.
export const topCustomers: TopCustomer[] = [
  { name: "Amazon Logistics", orders: 1245, revenue: "$45,200" },
  { name: "Walmart Dist.", orders: 840, revenue: "$32,150" },
  { name: "Home Depot", orders: 654, revenue: "$28,900" },
  { name: "Target Corp", orders: 512, revenue: "$19,400" },
];

export const topDrivers: TopDriver[] = [
  { name: "John Doe", deliveries: 142, rating: 4.9 },
  { name: "Sarah Jenkins", deliveries: 130, rating: 4.9 },
  { name: "Mike Ross", deliveries: 125, rating: 4.8 },
  { name: "Emily Wong", deliveries: 110, rating: 4.8 },
];
