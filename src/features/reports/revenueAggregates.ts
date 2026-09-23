import { isWithin, parseIsoDate, type RangeBounds } from "./reportRange";
import { SEGMENTS, type RevenueSegment } from "./segments";
import type { LedgerEntry } from "./revenueLedger";

export type RevenueGrouping = "day" | "week" | "month" | "quarter" | "year";

export const GROUPINGS: { key: RevenueGrouping; label: string }[] = [
  { key: "day", label: "Day" },
  { key: "week", label: "Wk" },
  { key: "month", label: "Mo" },
  { key: "quarter", label: "Qtr" },
  { key: "year", label: "Yr" },
];

export interface RevenueTotals {
  gross: number;
  refunds: number;
  net: number;
  demurrage: number;
  surge: number;
  fuel: number;
  tolls: number;
  orders: number;
  avgOrderValue: number;
}

export function filterLedger(entries: LedgerEntry[], bounds: RangeBounds, segment: RevenueSegment | "all" = "all"): LedgerEntry[] {
  return entries.filter((entry) => isWithin(entry.date, bounds) && (segment === "all" || entry.segment === segment));
}

export function sumLedger(entries: LedgerEntry[]): RevenueTotals {
  const totals = entries.reduce(
    (acc, entry) => ({
      gross: acc.gross + entry.gross,
      refunds: acc.refunds + entry.refunds,
      net: acc.net + entry.net,
      demurrage: acc.demurrage + entry.demurrage,
      surge: acc.surge + entry.surge,
      fuel: acc.fuel + entry.fuel,
      tolls: acc.tolls + entry.tolls,
      orders: acc.orders + entry.orders,
    }),
    { gross: 0, refunds: 0, net: 0, demurrage: 0, surge: 0, fuel: 0, tolls: 0, orders: 0 },
  );
  return { ...totals, avgOrderValue: totals.orders === 0 ? 0 : totals.gross / totals.orders };
}

export interface TrendPoint {
  key: string;
  /** Axis tick. */
  label: string;
  /** Tooltip heading. */
  fullLabel: string;
  gross: number;
  net: number;
  demurrage: number;
  isPeak: boolean;
}

function bucketOf(dateIso: string, grouping: RevenueGrouping): { key: string; label: string; fullLabel: string } {
  const date = parseIsoDate(dateIso);
  const long = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const short = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "2-digit" });
  switch (grouping) {
    case "day":
      return { key: dateIso, label: short(date), fullLabel: long(date) };
    case "week": {
      const monday = new Date(date);
      monday.setDate(date.getDate() - ((date.getDay() + 6) % 7));
      return { key: monday.toDateString(), label: short(monday), fullLabel: `Week of ${long(monday)}` };
    }
    case "month": {
      const label = date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
      return { key: dateIso.slice(0, 7), label, fullLabel: date.toLocaleDateString("en-US", { month: "long", year: "numeric" }) };
    }
    case "quarter": {
      const label = `Q${Math.floor(date.getMonth() / 3) + 1} ${date.getFullYear()}`;
      return { key: label, label, fullLabel: label };
    }
    default:
      return { key: String(date.getFullYear()), label: String(date.getFullYear()), fullLabel: String(date.getFullYear()) };
  }
}

/** Entries must already be range-filtered; buckets come out oldest first. */
export function buildTrend(entries: LedgerEntry[], grouping: RevenueGrouping): TrendPoint[] {
  const buckets = new Map<string, TrendPoint>();
  [...entries]
    .sort((a, b) => a.date.localeCompare(b.date))
    .forEach((entry) => {
      const bucket = bucketOf(entry.date, grouping);
      const point = buckets.get(bucket.key) ?? { ...bucket, gross: 0, net: 0, demurrage: 0, isPeak: false };
      point.gross += entry.gross;
      point.net += entry.net;
      point.demurrage += entry.demurrage;
      buckets.set(bucket.key, point);
    });
  const points = [...buckets.values()];
  const peak = points.reduce<TrendPoint | undefined>((best, point) => (!best || point.gross > best.gross ? point : best), undefined);
  if (peak && points.length > 1) peak.isPeak = true;
  return points;
}

export interface SegmentBreakdown {
  key: RevenueSegment;
  gross: number;
  base: number;
  accessorials: number;
  share: number;
}

export function buildSegmentBreakdown(entries: LedgerEntry[]): SegmentBreakdown[] {
  const total = entries.reduce((sum, entry) => sum + entry.gross, 0);
  return SEGMENTS.map((segment) => {
    const rows = entries.filter((entry) => entry.segment === segment.key);
    const { gross, demurrage, surge, fuel, tolls } = sumLedger(rows);
    const accessorials = demurrage + surge + fuel + tolls;
    return { key: segment.key, gross, base: gross - accessorials, accessorials, share: total === 0 ? 0 : (gross / total) * 100 };
  }).sort((a, b) => b.gross - a.gross);
}
