import { drivers, type DriverStatus } from "../drivers/driverRoster";
import { hashSeed, seededRandom } from "../../lib/seededRandom";
import { REGIONS } from "./regions";
import type { RangeBounds } from "./reportRange";

export interface DriverReportRow {
  id: string;
  name: string;
  vehicle: string;
  vehicleType: string;
  status: DriverStatus;
  zoneId: string;
  zoneName: string;
  rating: number;
  onTimeRate: number;
  acceptanceRate: number;
  cancelRate: number;
  delivered: number;
  revenue: number;
  /** Median minutes from dispatch offer to accept. */
  responseMin: number;
  incidents: number;
  demurrage: number;
  /** Fleet-wide rank by composite score (1 = best), stable under filtering. */
  rank: number;
}

/** Per-delivery revenue by vehicle class — bigger vehicles haul pricier loads. */
const RATE_BY_TYPE: Record<string, number> = { "Cargo Van": 205, "Sprinter Van": 240, "Box Truck": 385 };

// Composite used for the leaderboard rank: reliability-heavy, with
// cancellations, incidents and slow responses pulling a driver down.
function score(row: Omit<DriverReportRow, "rank">): number {
  return row.rating * 8 + row.onTimeRate * 0.45 + row.acceptanceRate * 0.2 - row.cancelRate * 2.5 - row.incidents * 1.5 - row.responseMin * 0.4;
}

// Built on the real driver roster (driverRoster.ts) — the same drivers,
// ratings and on-time rates the Drivers module shows — with the
// leaderboard-only metrics derived deterministically per driver and scaled
// to the selected range. Lifetime `deliveries` ≈ 12 months of work.
// TODO: replace with GET /reports/drivers?from&to once the Reporting API
// exists.
export function driverReportRows(bounds: RangeBounds): DriverReportRow[] {
  const rows = drivers.map((driver, index) => {
    const next = seededRandom(hashSeed(driver.id) + bounds.days * 13);
    const zone = REGIONS[index % REGIONS.length];
    const suspended = driver.status === "suspended";
    const delivered = Math.round((driver.deliveries / 365) * bounds.days * (0.85 + next() * 0.3) * (suspended ? 0.2 : 1));
    const reliability = (driver.onTimeRate - 85) / 15; // ~0 (weak) .. ~1 (strong)
    const incidents = Math.round(Math.max(0, (1 - reliability) * 5 * next() * Math.min(1, bounds.days / 30) + (suspended ? 2 : 0)));
    return {
      id: driver.id,
      name: driver.name,
      vehicle: driver.vehicle,
      vehicleType: driver.vehicleType,
      status: driver.status,
      zoneId: zone.id,
      zoneName: zone.name,
      rating: driver.rating,
      onTimeRate: driver.onTimeRate,
      acceptanceRate: Math.round((84 + reliability * 10 + next() * 5) * 10) / 10,
      cancelRate: Math.round(Math.max(0.2, (1 - reliability) * 7 + next() * 1.5) * 10) / 10,
      delivered,
      revenue: Math.round(delivered * (RATE_BY_TYPE[driver.vehicleType] ?? 220) * (0.9 + next() * 0.2)),
      responseMin: Math.round((2.5 + (1 - reliability) * 9 + next() * 3) * 10) / 10,
      incidents,
      demurrage: Math.round(delivered * (4 + next() * 9) + incidents * 180),
    };
  });
  const ranked = [...rows].sort((a, b) => score(b) - score(a));
  return rows.map((row) => ({ ...row, rank: ranked.indexOf(row) + 1 }));
}

export interface LeaderboardTotals {
  drivers: number;
  onTimeRate: number;
  acceptanceRate: number;
  cancelRate: number;
  delivered: number;
  revenue: number;
  responseMin: number;
  incidents: number;
  demurrage: number;
}

/** Rates are delivery-weighted averages; counts and money are sums. */
export function leaderboardTotals(rows: DriverReportRow[]): LeaderboardTotals {
  const delivered = rows.reduce((sum, row) => sum + row.delivered, 0);
  const weighted = (pick: (row: DriverReportRow) => number) =>
    delivered === 0 ? 0 : rows.reduce((sum, row) => sum + pick(row) * row.delivered, 0) / delivered;
  return {
    drivers: rows.length,
    onTimeRate: weighted((row) => row.onTimeRate),
    acceptanceRate: weighted((row) => row.acceptanceRate),
    cancelRate: weighted((row) => row.cancelRate),
    delivered,
    revenue: rows.reduce((sum, row) => sum + row.revenue, 0),
    responseMin: weighted((row) => row.responseMin),
    incidents: rows.reduce((sum, row) => sum + row.incidents, 0),
    demurrage: rows.reduce((sum, row) => sum + row.demurrage, 0),
  };
}
