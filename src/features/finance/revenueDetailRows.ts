import { revenueFilterOptions } from "./revenueDetail";

export interface RevenueDetailRow {
  id: string;
  period: string;
  rawDate: Date;
  deliveries: number;
  gross: number;
  payouts: number;
  adjustments: number;
  fees: number;
  net: number;
  segment: string;
  deliveryType: string;
  region: string;
  vertical: string;
}

function daysAgoDate(n: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - n);
  return date;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

const handAuthored: Omit<RevenueDetailRow, "id" | "period" | "rawDate" | "net" | "segment" | "deliveryType" | "region" | "vertical">[] = [
  { deliveries: 1430, gross: 142500, payouts: 71250, adjustments: -1240, fees: 8550 },
  { deliveries: 1280, gross: 126400, payouts: 64200, adjustments: -850, fees: 7700 },
  { deliveries: 1510, gross: 153000, payouts: 76500, adjustments: -2300, fees: 8640 },
  { deliveries: 1100, gross: 110200, payouts: 55330, adjustments: -400, fees: 6610 },
  { deliveries: 1340, gross: 154800, payouts: 87400, adjustments: -1700, fees: 8030 },
];

// Real (non-"All X") values for each filter dimension, sliced off the front
// of revenueFilterOptions' own arrays so the two stay in sync.
const realSegments = revenueFilterOptions.segments.slice(1);
const realDeliveryTypes = revenueFilterOptions.deliveryTypes.slice(1);
const realRegions = revenueFilterOptions.regions.slice(1);
const realVerticals = revenueFilterOptions.verticals.slice(1);

function buildRow(
  offset: number,
  base: Omit<RevenueDetailRow, "id" | "period" | "rawDate" | "net" | "segment" | "deliveryType" | "region" | "vertical">,
): RevenueDetailRow {
  const net = base.gross - base.payouts + base.adjustments - base.fees;
  const rawDate = daysAgoDate(offset);
  return {
    id: `rev-${offset}`,
    period: formatDate(rawDate),
    rawDate,
    net,
    segment: realSegments[offset % realSegments.length],
    deliveryType: realDeliveryTypes[offset % realDeliveryTypes.length],
    region: realRegions[offset % realRegions.length],
    vertical: realVerticals[offset % realVerticals.length],
    ...base,
  };
}

function buildFillerRows(count: number): RevenueDetailRow[] {
  return Array.from({ length: count }, (_, i) => {
    const gross = 90000 + ((i * 5137) % 70000);
    const payouts = Math.round(gross * 0.5);
    const fees = Math.round(gross * 0.055);
    const adjustments = -(300 + ((i * 211) % 2200));
    return buildRow(5 + i, { deliveries: 900 + ((i * 37) % 700), gross, payouts, adjustments, fees });
  });
}

export const revenueDetailRows: RevenueDetailRow[] = [
  ...handAuthored.map((row, i) => buildRow(i, row)),
  ...buildFillerRows(25),
];

export interface RevenueDetailFilters {
  dateRange: string;
  segment: string;
  deliveryType: string;
  region: string;
  vertical: string;
}

function matchesDateRange(rawDate: Date, dateRange: string): boolean {
  if (dateRange === "This Year") return rawDate.getFullYear() === new Date().getFullYear();
  const days = { "Last 7 Days": 7, "Last 30 Days": 30, "Last 90 Days": 90 }[dateRange];
  if (!days) return true;
  const diffDays = (Date.now() - rawDate.getTime()) / 86400000;
  return diffDays <= days;
}

// Wires up RevenueFilterBar's 5 selects (previously fully disconnected from
// this table) to real filtering, applied before the section's own
// search-substring filter and pagination.
export function filterRevenueDetailRows(rows: RevenueDetailRow[], filters: RevenueDetailFilters): RevenueDetailRow[] {
  return rows.filter((row) => {
    if (!matchesDateRange(row.rawDate, filters.dateRange)) return false;
    if (filters.segment !== "All Segments" && row.segment !== filters.segment) return false;
    if (filters.deliveryType !== "All Types" && row.deliveryType !== filters.deliveryType) return false;
    if (filters.region !== "Global" && row.region !== filters.region) return false;
    if (filters.vertical !== "All Verticals" && row.vertical !== filters.vertical) return false;
    return true;
  });
}

export function exportRevenueDetailsToCsv(rows: RevenueDetailRow[], filename = "revenue-details.csv"): void {
  const headers = ["Period", "Deliveries", "Gross Rev", "Driver Payouts", "Adjustments", "Platform Fees", "Net Rev"];
  const csvRows = rows.map((r) => [r.period, r.deliveries, r.gross.toFixed(2), r.payouts.toFixed(2), r.adjustments.toFixed(2), r.fees.toFixed(2), r.net.toFixed(2)]);
  const csv = [headers, ...csvRows].map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
