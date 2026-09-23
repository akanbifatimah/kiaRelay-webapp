import { useMemo, useState } from "react";
import { Card } from "../../components/Card";
import { cn } from "../../lib/cn";
import { ReportPageHeader } from "./components/ReportPageHeader";
import { ReportRangeTabs } from "./components/ReportRangeTabs";
import { ReportStatCard } from "./components/ReportStatCard";
import { RevenueTrendCard } from "./components/RevenueTrendCard";
import { SegmentRevenueCard } from "./components/SegmentRevenueCard";
import { RevenueLedgerCard } from "./components/RevenueLedgerCard";
import { DEFAULT_RANGE, previousBounds, rangeBounds, rangeLabel, type ReportRange } from "./reportRange";
import { revenueLedger } from "./revenueLedger";
import { buildSegmentBreakdown, buildTrend, filterLedger, GROUPINGS, sumLedger, type RevenueGrouping } from "./revenueAggregates";
import { formatDeltaPct, formatMoney, formatMoneyExact } from "./formatReport";
import type { RevenueSegment } from "./segments";

// Sensible bucket for each range, applied when the range changes (the user
// can still override it) — 30 daily points beat 1 lonely monthly one.
const AUTO_GROUPING: Record<ReportRange["key"], RevenueGrouping> = {
  today: "day",
  "7d": "day",
  "30d": "day",
  "90d": "week",
  ytd: "month",
  custom: "day",
};

export function RevenueReportsPage() {
  const [range, setRange] = useState<ReportRange>(DEFAULT_RANGE);
  const [grouping, setGrouping] = useState<RevenueGrouping>(AUTO_GROUPING[DEFAULT_RANGE.key]);
  const [segment, setSegment] = useState<RevenueSegment | "all">("all");

  const bounds = useMemo(() => rangeBounds(range), [range]);
  const inRange = useMemo(() => filterLedger(revenueLedger, bounds), [bounds]);
  const ledgerRows = useMemo(() => (segment === "all" ? inRange : inRange.filter((entry) => entry.segment === segment)), [inRange, segment]);
  const totals = useMemo(() => sumLedger(ledgerRows), [ledgerRows]);
  const previous = useMemo(() => sumLedger(filterLedger(revenueLedger, previousBounds(bounds), segment)), [bounds, segment]);
  const trend = useMemo(() => buildTrend(ledgerRows, grouping), [ledgerRows, grouping]);
  const segments = useMemo(() => buildSegmentBreakdown(inRange), [inRange]);

  function handleRangeChange(next: ReportRange) {
    setRange(next);
    if (next.key !== range.key) setGrouping(AUTO_GROUPING[next.key]);
  }

  return (
    <div className="flex flex-col gap-6">
      <ReportPageHeader
        title="Revenue Reports"
        statusLabel="Ledger Synchronized"
        subtitle="Comprehensive revenue recognition, fee attribution, and operational margin reporting across all logistics verticals."
      />

      <Card className="flex flex-col gap-3 p-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <span className="text-label text-text-muted">Group:</span>
          <div className="flex items-center gap-0.5 rounded-lg bg-bg p-1">
            {GROUPINGS.map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => setGrouping(option.key)}
                className={cn(
                  "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                  grouping === option.key ? "bg-surface text-text shadow-sm" : "text-text-muted hover:text-text",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        <ReportRangeTabs value={range} onChange={handleRangeChange} />
        <span className="text-xs text-text-muted md:text-right">{rangeLabel(range)}</span>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        <ReportStatCard label="Total Gross" value={formatMoney(totals.gross)} delta={formatDeltaPct(totals.gross, previous.gross)} />
        <ReportStatCard
          label="Avg Order Value"
          value={formatMoneyExact(totals.avgOrderValue)}
          delta={formatDeltaPct(totals.avgOrderValue, previous.avgOrderValue)}
        />
        <ReportStatCard label="Total Net" value={formatMoney(totals.net)} delta={formatDeltaPct(totals.net, previous.net)} />
      </div>

      <RevenueTrendCard data={trend} />
      <SegmentRevenueCard segments={segments} active={segment} onSelect={(key) => setSegment((prev) => (prev === key ? "all" : key))} />
      <RevenueLedgerCard entries={ledgerRows} rangeText={rangeLabel(range)} segment={segment} onSegmentChange={setSegment} />
    </div>
  );
}
