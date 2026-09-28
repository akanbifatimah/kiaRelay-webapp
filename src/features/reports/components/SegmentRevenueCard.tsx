import { useState } from "react";
import { Card } from "../../../components/Card";
import { cn } from "../../../lib/cn";
import { formatMoney, formatMoneyExact } from "../formatReport";
import { segmentMeta, type RevenueSegment } from "../segments";
import type { SegmentBreakdown } from "../revenueAggregates";
import { ChartToolbar } from "./ChartToolbar";

interface SegmentRevenueCardProps {
  segments: SegmentBreakdown[];
  rangeText: string;
  active: RevenueSegment | "all";
  /** Clicking a segment filters the ledger below (again clears it). */
  onSelect: (segment: RevenueSegment) => void;
}

type AccountFilter = "all" | "business" | "individual";
type SortKey = "gross" | "accessorials" | "name";

// Per-chart filters (TC-10, 2026-09-28): account type (KiaRelay Business
// segments vs individual) and sort order, plus a CSV/PDF export of the
// rows shown. Shares stay relative to all revenue in the range.
export function SegmentRevenueCard({ segments, rangeText, active, onSelect }: SegmentRevenueCardProps) {
  const [accounts, setAccounts] = useState<AccountFilter>("all");
  const [sortBy, setSortBy] = useState<SortKey>("gross");
  const total = segments.reduce((sum, segment) => sum + segment.gross, 0);
  const visible = segments
    .filter((s) => accounts === "all" || (accounts === "individual" ? s.key === "individual" : s.key !== "individual"))
    .sort((a, b) => (sortBy === "name" ? segmentMeta(a.key).label.localeCompare(segmentMeta(b.key).label) : sortBy === "accessorials" ? b.accessorials - a.accessorials : b.gross - a.gross));

  return (
    <Card className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-text">Revenue by Industrial Segment</h2>
          <p className="text-xs text-text-muted">Distribution across commercial accounts with accessorials breakdown</p>
        </div>
        <ChartToolbar
          exportLabel="Export segment revenue"
          filters={[
            { label: "Accounts", value: accounts, onChange: (v) => setAccounts(v as AccountFilter), options: [{ value: "all", label: "All Accounts" }, { value: "business", label: "KiaRelay Business" }, { value: "individual", label: "Individuals" }] },
            { label: "Sort by", value: sortBy, onChange: (v) => setSortBy(v as SortKey), options: [{ value: "gross", label: "Sort: Gross" }, { value: "accessorials", label: "Sort: Accessorials" }, { value: "name", label: "Sort: Name" }] },
          ]}
          getExport={() => ({
            title: "Revenue by Industrial Segment",
            subtitle: rangeText,
            columns: [
              { header: "Segment", value: (s) => segmentMeta(s.key).label },
              { header: "Base Haul", value: (s) => formatMoneyExact(s.base), align: "right" },
              { header: "Accessorials & Demurrage", value: (s) => formatMoneyExact(s.accessorials), align: "right" },
              { header: "Gross", value: (s) => formatMoneyExact(s.gross), align: "right" },
              { header: "Share", value: (s) => `${s.share.toFixed(1)}%`, align: "right" },
            ],
            rows: visible,
          })}
        />
      </div>
      <div className="flex flex-wrap items-center gap-4 text-xs text-text">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-sidebar" />
          Base Haul Freight
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-primary" />
          Accessorials &amp; Demurrage
        </span>
      </div>
      <div className="flex flex-col gap-4">
        {visible.map((segment) => {
          const meta = segmentMeta(segment.key);
          const Icon = meta.icon;
          const isDimmed = active !== "all" && active !== segment.key;
          return (
            <button
              key={segment.key}
              type="button"
              onClick={() => onSelect(segment.key)}
              aria-pressed={active === segment.key}
              className={cn("flex flex-col gap-1.5 rounded-md text-left transition-opacity", isDimmed && "opacity-40 hover:opacity-70")}
            >
              <div className="flex flex-wrap items-center gap-2">
                <Icon className="h-4 w-4 text-text" />
                <span className="text-sm font-semibold text-text">{meta.label}</span>
                <span className="rounded bg-bg px-1.5 py-0.5 font-mono text-[10px] text-text-muted">{meta.tag}</span>
                <span className="ml-auto font-mono text-sm font-semibold tabular-nums text-text">{formatMoney(segment.gross)}</span>
                <span className="w-12 text-right font-mono text-xs tabular-nums text-text-muted">{segment.share.toFixed(1)}%</span>
              </div>
              <div className="flex h-5 w-full overflow-hidden rounded-sm bg-bg">
                <span className="h-full bg-sidebar" style={{ width: `${total === 0 ? 0 : (segment.base / total) * 100}%` }} />
                <span className="h-full bg-primary" style={{ width: `${total === 0 ? 0 : (segment.accessorials / total) * 100}%` }} />
              </div>
            </button>
          );
        })}
      </div>
    </Card>
  );
}
