import type { DashboardSnapshot, DateRangeKey } from "./data";

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
