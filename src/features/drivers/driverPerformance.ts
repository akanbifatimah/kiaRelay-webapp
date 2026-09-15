import type { DeliveryType } from "../../components/TagChip";
import { drivers, type DriverRecord } from "./driverRoster";

export interface PerformanceStat {
  label: string;
  value: string;
  deltaLabel: string;
  sparkline: number[];
}

// TODO: replace with GET /drivers/performance once the Reporting &
// Analytics API exists — flavor numbers/series, not derived from the roster.
export const performanceStats: PerformanceStat[] = [
  { label: "Average Rating", value: "4.7", deltaLabel: "+0.2", sparkline: [4.3, 4.4, 4.4, 4.5, 4.6, 4.6, 4.7, 4.7] },
  {
    label: "Total Deliveries",
    value: "3,247",
    deltaLabel: "+12%",
    sparkline: [2400, 2550, 2700, 2820, 2950, 3080, 3180, 3247],
  },
  {
    label: "Avg On-Time Rate",
    value: "94%",
    deltaLabel: "+2%",
    sparkline: [90, 91, 91, 92, 93, 93, 94, 94],
  },
  {
    label: "Avg Acceptance Rate",
    value: "91%",
    deltaLabel: "+5%",
    sparkline: [95, 94, 93, 92, 92, 91, 91, 91],
  },
];

export interface DeliveryVolumeCategory {
  type: DeliveryType;
  label: string;
  value: number;
}

export const deliveryVolume: DeliveryVolumeCategory[] = [
  { type: "express", label: "Last Mile Express", value: 1452 },
  { type: "standard", label: "Standard Logistics", value: 982 },
  { type: "healthcare", label: "Medical Cold Chain", value: 512 },
  { type: "freight", label: "Oversized Freight", value: 301 },
];

export interface RatingBucket {
  label: string;
  count: number;
}

export const ratingSpread: RatingBucket[] = [
  { label: "1★", count: 14 },
  { label: "2★", count: 38 },
  { label: "3★", count: 126 },
  { label: "4★", count: 412 },
  { label: "5★", count: 650 },
];

export interface OnTimeTrendPoint {
  label: string;
  actual: number;
  target: number;
}

export const onTimeTrend: OnTimeTrendPoint[] = [
  { label: "Oct 7", actual: 91, target: 95 },
  { label: "Oct 14", actual: 92, target: 95 },
  { label: "Oct 21", actual: 93, target: 95 },
  { label: "Oct 28", actual: 94, target: 95 },
];

// Leaderboard is derived from the real roster (rating desc) rather than a
// separate hand-authored list, so ranks stay consistent with All Drivers.
export const totalRankedDrivers = 1240;

function sortByRatingThenEarnings(list: DriverRecord[]): DriverRecord[] {
  return [...list].sort((a, b) => b.rating - a.rating || b.earnings - a.earnings);
}

export function getTopDrivers(count: number): DriverRecord[] {
  return sortByRatingThenEarnings(drivers).slice(0, count);
}

// Same ranking as getTopDrivers, unsliced — backs FullRankingModal's paginated view.
export function getRankedDrivers(): DriverRecord[] {
  return sortByRatingThenEarnings(drivers);
}
