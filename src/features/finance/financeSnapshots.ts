import type { FinanceRangeKey, FinanceSnapshot, RevenueSnapshotPoint } from "./data";

// TODO: replace with GET /finance/summary?range=<key> once the reporting API
// exists. "month" is hand-authored to match the Figma reference; the other
// range keys are derived by scaling it (same "flavor numbers" tolerance
// already used elsewhere in this app's mock data, e.g. customerOverviewStats)
// rather than hand-authoring four full, independently-precise datasets.
const monthSnapshot: FinanceSnapshot = {
  stats: [
    { type: "revenue", label: "Gross Revenue", value: 482500, deltaPct: 12.4 },
    { type: "payouts", label: "Driver Payouts", value: 142800, secondaryLabel: "463 drivers paid" },
    { type: "pending", label: "Pending Invoices", value: 84200, secondaryLabel: "24 overdue bills" },
    { type: "refunds", label: "Refunds", value: 6450, deltaPct: -2.1, invertDeltaColor: true, secondaryLabel: "improvement" },
    { type: "fees", label: "Platform Fees", value: 26600, secondaryLabel: "Avg 5.5% commission" },
  ],
  netRevenueTotal: 312450,
  revenueDeltaAmount: 42180,
  revenueDeltaPct: 14.2,
  revenue: {
    daily: [
      { label: "Mon", gross: 62000, net: 40000 },
      { label: "Tue", gross: 58000, net: 37500 },
      { label: "Wed", gross: 71000, net: 46000 },
      { label: "Thu", gross: 84000, net: 54500 },
      { label: "Fri", gross: 96000, net: 62500 },
      { label: "Sat", gross: 74000, net: 48000 },
      { label: "Sun", gross: 37500, net: 24000 },
    ],
    weekly: [
      { label: "Week 1", gross: 108000, net: 70000 },
      { label: "Week 2", gross: 121000, net: 78500 },
      { label: "Week 3", gross: 113500, net: 73500 },
      { label: "Week 4", gross: 140000, net: 90450 },
    ],
    monthly: [
      { label: "Apr", gross: 390000, net: 252000 },
      { label: "May", gross: 412000, net: 267000 },
      { label: "Jun", gross: 398000, net: 258000 },
      { label: "Jul", gross: 431000, net: 279000 },
      { label: "Aug", gross: 455000, net: 295000 },
      { label: "Sep", gross: 482500, net: 312450 },
    ],
  },
  deliveryTypes: [
    { type: "standard", label: "Standard", deliveries: 2420, avgOrder: 42.5, totalBill: 102850 },
    { type: "express", label: "Express", deliveries: 1180, avgOrder: 85.0, totalBill: 100300 },
    { type: "scheduled", label: "Scheduled", deliveries: 3854, avgOrder: 72.5, totalBill: 279350 },
  ],
  segments: [
    { key: "individuals", label: "Individuals", revenue: 164200, volume: 4100, avgOrder: 40.05 },
    { key: "companies", label: "Companies", revenue: 318300, volume: 3350, avgOrder: 95.01 },
  ],
  segmentNote: "Company segments account for 66% of total revenue.",
  settlements: [
    { id: "st-1", label: "Weekly Driver Pool", date: "Sep 25, 2026", amount: 72400 },
    { id: "st-2", label: "TechLogistics Corp", date: "Oct 2, 2026", amount: 5820 },
    { id: "st-3", label: "Platform Maintenance", date: "Oct 5, 2026", amount: 1200 },
  ],
};

function scalePoint(point: RevenueSnapshotPoint, factor: number): RevenueSnapshotPoint {
  return { label: point.label, gross: Math.round(point.gross * factor), net: Math.round(point.net * factor) };
}

function scaleSnapshot(base: FinanceSnapshot, factor: number): FinanceSnapshot {
  return {
    ...base,
    stats: base.stats.map((stat) => ({ ...stat, value: Math.round(stat.value * factor) })),
    netRevenueTotal: Math.round(base.netRevenueTotal * factor),
    revenueDeltaAmount: Math.round(base.revenueDeltaAmount * factor),
    revenue: {
      daily: base.revenue.daily.map((p) => scalePoint(p, factor)),
      weekly: base.revenue.weekly.map((p) => scalePoint(p, factor)),
      monthly: base.revenue.monthly.map((p) => scalePoint(p, factor)),
    },
    deliveryTypes: base.deliveryTypes.map((row) => ({
      ...row,
      deliveries: Math.max(1, Math.round(row.deliveries * factor)),
      totalBill: Math.round(row.totalBill * factor),
    })),
    segments: base.segments.map((segment) => ({
      ...segment,
      revenue: Math.round(segment.revenue * factor),
      volume: Math.max(1, Math.round(segment.volume * factor)),
    })),
    settlements: base.settlements.map((s) => ({ ...s, amount: Math.round(s.amount * factor) })),
  };
}

export const financeByRange: Record<FinanceRangeKey, FinanceSnapshot> = {
  month: monthSnapshot,
  today: scaleSnapshot(monthSnapshot, 1 / 28),
  week: scaleSnapshot(monthSnapshot, 1 / 4),
  quarter: scaleSnapshot(monthSnapshot, 3),
};

function seededRandom(seed: string): () => number {
  let state = 0;
  for (let i = 0; i < seed.length; i += 1) state = (state * 31 + seed.charCodeAt(i)) | 0;
  return () => {
    state = (state * 1664525 + 1013904223) | 0;
    return ((state >>> 0) % 1000) / 1000;
  };
}

// TODO: replace with GET /finance/summary?from=<from>&to=<to>. Same seeded-
// derivation-from-the-picked-range technique as dashboard/data.ts's
// buildCustomSnapshot, scaled off the same base month snapshot above.
export function buildCustomFinanceSnapshot(from: string, to: string): FinanceSnapshot {
  const dayCount = Math.max(
    1,
    Math.round((new Date(to).getTime() - new Date(from).getTime()) / 86_400_000) + 1,
  );
  const rand = seededRandom(`${from}_${to}`);
  const factor = (dayCount / 30) * (0.7 + rand() * 0.6);
  return scaleSnapshot(monthSnapshot, factor);
}
