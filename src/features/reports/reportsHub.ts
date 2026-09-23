import { drivers } from "../drivers/driverRoster";
import { revenueLedger } from "./revenueLedger";
import { addDays, DEFAULT_RANGE, isoDate, rangeBounds, startOfDay } from "./reportRange";
import { buildTrend, filterLedger, type TrendPoint } from "./revenueAggregates";
import { REGIONS } from "./regions";
import type { RevenueSegment } from "./segments";

// Reports hub (KPI Dashboards) figures — every one derived from the same
// sources the detailed reports use (revenue ledger, driver roster, regions),
// so a hub tile always agrees with the report it links to.

export interface HubKpis {
  dailyRevenue: number;
  onTimeRate: number;
  activeDrivers: number;
  fleetUtilization: number;
}

export function buildHubKpis(): HubKpis {
  const last7 = filterLedger(revenueLedger, rangeBounds({ ...DEFAULT_RANGE, key: "7d" }));
  const deliveries = REGIONS.reduce((sum, region) => sum + region.deliveries, 0);
  const active = drivers.filter((driver) => driver.status !== "offline" && driver.status !== "suspended");
  const working = active.filter((driver) => driver.status === "in-transit" || driver.status === "delivered");
  return {
    dailyRevenue: last7.reduce((sum, entry) => sum + entry.gross, 0) / 7,
    onTimeRate: REGIONS.reduce((sum, region) => sum + region.onTimeRate * region.deliveries, 0) / deliveries,
    activeDrivers: active.length,
    fleetUtilization: active.length === 0 ? 0 : (working.length / active.length) * 100,
  };
}

/** Last 30 days, daily, gross vs net recognized. */
export function hubRevenueTrend(): TrendPoint[] {
  return buildTrend(filterLedger(revenueLedger, rangeBounds({ ...DEFAULT_RANGE, key: "30d" })), "day");
}

export interface DailyVolume {
  label: string;
  deliveries: number;
  isPeak: boolean;
}

/** Completed deliveries per day from the ledger's order counts, optionally one segment (tier). */
export function dailyDeliveryVolume(days: number, segment: RevenueSegment | "all"): DailyVolume[] {
  const today = startOfDay(new Date());
  const points = Array.from({ length: days }, (_, i) => {
    const date = addDays(today, -(days - 1 - i));
    const iso = isoDate(date);
    const deliveries = revenueLedger
      .filter((entry) => entry.date === iso && (segment === "all" || entry.segment === segment))
      .reduce((sum, entry) => sum + entry.orders, 0);
    const label = days <= 7 ? date.toLocaleDateString("en-US", { weekday: "short" }) : date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    return { label, deliveries, isPeak: false };
  });
  const peak = points.reduce((best, point) => (point.deliveries > best.deliveries ? point : best), points[0]);
  if (peak) peak.isPeak = true;
  return points;
}
