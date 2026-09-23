import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useClaims } from "../support/claims";
import { ReportPageHeader } from "./components/ReportPageHeader";
import { ReportRangeTabs } from "./components/ReportRangeTabs";
import { ReportStatCard } from "./components/ReportStatCard";
import { ClaimsVolumeCard } from "./components/ClaimsVolumeCard";
import { ClaimCategoryTableCard } from "./components/ClaimCategoryTableCard";
import { DEFAULT_RANGE, previousBounds, rangeBounds, rangeLabel, type ReportRange } from "./reportRange";
import { buildCategoryRows, buildCategoryVolume, claimsInRange, summarizeClaims } from "./claimsAnalytics";
import { formatDeltaPct, formatMoney } from "./formatReport";

// Claims Analytics (2026-09-23) — linked from the Reports hub's Quick Links
// but not in the shared designs, so this is a first-pass design built from
// the same live claims store Claims Management uses: a claim created or
// resolved in Support shows up here in the same session.
export function ClaimsAnalyticsPage() {
  const claims = useClaims();
  const [range, setRange] = useState<ReportRange>(DEFAULT_RANGE);
  const bounds = useMemo(() => rangeBounds(range), [range]);
  const current = useMemo(() => claimsInRange(claims, bounds), [claims, bounds]);
  const summary = useMemo(() => summarizeClaims(current), [current]);
  const previous = useMemo(() => summarizeClaims(claimsInRange(claims, previousBounds(bounds))), [claims, bounds]);
  const volume = useMemo(() => buildCategoryVolume(current, bounds), [current, bounds]);
  const categoryRows = useMemo(() => buildCategoryRows(current), [current]);
  const daysDelta = summary.avgResolutionDays - previous.avgResolutionDays;

  return (
    <div className="flex flex-col gap-6">
      <ReportPageHeader
        title="Claims Analytics"
        statusLabel="Live from Claims"
        subtitle="Dispute volume, claimed value and resolution performance across claim categories."
        actions={
          <>
            <ReportRangeTabs value={range} onChange={setRange} />
            <Link to="/support/claims" className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              Claims Management
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ReportStatCard label="Claims Filed" value={summary.total.toLocaleString()} delta={{ ...formatDeltaPct(summary.total, previous.total), invert: true }} />
        <ReportStatCard label="Claimed Value" value={formatMoney(summary.claimedValue)} delta={{ ...formatDeltaPct(summary.claimedValue, previous.claimedValue), invert: true }} />
        <ReportStatCard
          label="Avg Resolution Time"
          value={summary.avgResolutionDays.toFixed(1)}
          unit="days"
          delta={{
            label: `${daysDelta > 0 ? "+" : ""}${daysDelta.toFixed(1)}d`,
            direction: Math.abs(daysDelta) < 0.05 ? "flat" : daysDelta > 0 ? "up" : "down",
            invert: true,
          }}
        />
        <ReportStatCard
          label="Resolution Rate"
          value={`${summary.resolutionRate.toFixed(1)}%`}
          hint={`${summary.resolved} resolved · ${summary.escalated} escalated`}
          delta={formatDeltaPct(summary.resolutionRate, previous.resolutionRate)}
        />
      </div>

      {current.length === 0 ? (
        <p className="rounded-lg bg-surface py-16 text-center text-sm text-text-muted">No claims were filed in {rangeLabel(range)}.</p>
      ) : (
        <>
          <ClaimsVolumeCard data={volume} bucketLabel={bounds.days <= 31 ? "Daily" : "Weekly"} />
          <ClaimCategoryTableCard rows={categoryRows} summary={summary} rangeText={rangeLabel(range)} />
        </>
      )}
    </div>
  );
}
