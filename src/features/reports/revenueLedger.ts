import { seededRandom } from "../../lib/seededRandom";
import { addDays, isoDate, startOfDay } from "./reportRange";
import { SEGMENTS, type RevenueSegment } from "./segments";

export interface LedgerEntry {
  id: string;
  /** YYYY-MM-DD — one settlement cycle per segment per day. */
  date: string;
  segment: RevenueSegment;
  gross: number;
  refunds: number;
  net: number;
  demurrage: number;
  surge: number;
  fuel: number;
  tolls: number;
  orders: number;
  /** Surge well above that segment's norm — highlighted orange in the ledger. */
  surgeSpike: boolean;
}

/** Days of history generated — covers YTD plus a full prior period for deltas. */
const HISTORY_DAYS = 800;
// Calibrated so 30-day gross (~$1.8M) matches Customer Performance's cohort
// spend — the same money seen per-segment vs per-account.
const BASE_DAILY_GROSS = 74_000;
const AVG_ORDER_VALUE: Record<RevenueSegment, number> = {
  "oil-gas": 540,
  construction: 400,
  healthcare: 250,
  commercial: 190,
  individual: 58,
};

const round2 = (value: number) => Math.round(value * 100) / 100;

// Deterministic mock ledger (2026-09-23): revenue grows ~25%/yr toward today,
// dips on weekends, and carries a slow seasonal wave, so every range/grouping
// on Revenue Reports has a believable shape. Dates are relative to today,
// like every other mock-date generator in this codebase, so "Last 30 days"
// always returns rows.
// TODO: replace with GET /reports/revenue/ledger?from&to once the Reporting
// API exists — the tiles, trend, segments and table all derive from these
// rows, so only this generator needs to change.
function buildLedger(): LedgerEntry[] {
  const next = seededRandom(9127);
  const today = startOfDay(new Date());
  const entries: LedgerEntry[] = [];
  for (let daysAgo = HISTORY_DAYS - 1; daysAgo >= 0; daysAgo -= 1) {
    const date = addDays(today, -daysAgo);
    const growth = 1 - 0.25 * (daysAgo / 365);
    const weekday = date.getDay() === 0 || date.getDay() === 6 ? 0.55 : 1.08;
    const seasonal = 1 + 0.12 * Math.sin((date.getMonth() / 12) * Math.PI * 2);
    const dayTotal = BASE_DAILY_GROSS * growth * weekday * seasonal;
    SEGMENTS.forEach((segment) => {
      const gross = round2(dayTotal * segment.weight * (0.72 + next() * 0.56));
      const accessorials = gross * segment.accessorialShare * (0.7 + next() * 0.6);
      const surgeSpike = next() < 0.08 ? 2.2 : 1;
      const refunds = next() < segment.refundRate ? round2(gross * (0.004 + next() * 0.018)) : 0;
      entries.push({
        id: `${isoDate(date)}-${segment.key}`,
        date: isoDate(date),
        segment: segment.key,
        gross,
        refunds,
        net: round2(gross - refunds),
        demurrage: round2(accessorials * 0.36),
        surge: round2(accessorials * 0.22 * surgeSpike),
        fuel: round2(accessorials * 0.32),
        tolls: round2(accessorials * 0.1),
        orders: Math.max(1, Math.round(gross / AVG_ORDER_VALUE[segment.key])),
        surgeSpike: surgeSpike > 1,
      });
    });
  }
  return entries;
}

export const revenueLedger: LedgerEntry[] = buildLedger();
