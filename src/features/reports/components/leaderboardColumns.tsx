import { Star } from "lucide-react";
import type { Column } from "../../../components/DataTable";
import type { ExportColumn } from "../../../lib/exportTable";
import { cn } from "../../../lib/cn";
import { formatMoney, formatPct, otdTone } from "../formatReport";
import type { DriverReportRow, LeaderboardTotals } from "../driverPerformanceReport";
import type { TotalsCell } from "./TotalsRow";
import { IncidentBadge, RankBadge } from "./LeaderboardBadges";

export type LeaderboardSortKey =
  | "rank" | "name" | "rating" | "onTimeRate" | "acceptanceRate" | "cancelRate" | "delivered" | "revenue" | "responseMin" | "incidents" | "demurrage";

export const LEADERBOARD_SORTERS: Record<LeaderboardSortKey, (row: DriverReportRow) => string | number> = {
  rank: (row) => row.rank,
  name: (row) => row.name,
  rating: (row) => row.rating,
  onTimeRate: (row) => row.onTimeRate,
  acceptanceRate: (row) => row.acceptanceRate,
  cancelRate: (row) => row.cancelRate,
  delivered: (row) => row.delivered,
  revenue: (row) => row.revenue,
  responseMin: (row) => row.responseMin,
  incidents: (row) => row.incidents,
  demurrage: (row) => row.demurrage,
};

const mono = "whitespace-nowrap font-mono tabular-nums";

export const leaderboardColumns: Column<DriverReportRow>[] = [
  { header: "Rank", sortKey: "rank", accessor: (row) => <RankBadge rank={row.rank} /> },
  {
    header: "Driver",
    sortKey: "name",
    accessor: (row) => (
      <div className="whitespace-nowrap">
        <p className="font-semibold text-text">{row.name}</p>
        <p className="text-xs text-text-muted">
          {row.vehicle} • {row.zoneName}
        </p>
      </div>
    ),
  },
  {
    header: "Rating",
    sortKey: "rating",
    align: "right",
    accessor: (row) => (
      <span className={cn(mono, "inline-flex items-center gap-1 font-semibold")}>
        <Star className={cn("h-3.5 w-3.5", row.rating >= 4.5 ? "fill-warning text-warning" : "fill-danger text-danger")} />
        {row.rating.toFixed(2)}
      </span>
    ),
  },
  { header: "On-Time %", sortKey: "onTimeRate", align: "right", accessor: (row) => <span className={cn(mono, "font-semibold", otdTone(row.onTimeRate))}>{formatPct(row.onTimeRate)}</span> },
  { header: "Acceptance %", sortKey: "acceptanceRate", align: "right", accessor: (row) => <span className={mono}>{formatPct(row.acceptanceRate)}</span> },
  { header: "Cancel %", sortKey: "cancelRate", align: "right", accessor: (row) => <span className={cn(mono, row.cancelRate > 5 ? "text-danger" : "text-text-muted")}>{formatPct(row.cancelRate)}</span> },
  { header: "Delivered", sortKey: "delivered", align: "right", accessor: (row) => <span className={cn(mono, "font-semibold")}>{row.delivered.toLocaleString()}</span> },
  { header: "Revenue", sortKey: "revenue", align: "right", accessor: (row) => <span className={cn(mono, "font-semibold")}>{formatMoney(row.revenue)}</span> },
  { header: "Response", sortKey: "responseMin", align: "right", accessor: (row) => <span className={cn(mono, row.responseMin > 10 ? "text-danger" : "text-text-muted")}>{row.responseMin.toFixed(1)}m</span> },
  { header: "Incidents", sortKey: "incidents", align: "right", accessor: (row) => <IncidentBadge count={row.incidents} /> },
  { header: "Demurrage", sortKey: "demurrage", align: "right", accessor: (row) => <span className={cn(mono, "text-text-muted")}>{formatMoney(row.demurrage)}</span> },
];

export const leaderboardExportColumns: ExportColumn<DriverReportRow>[] = [
  { header: "Rank", value: (row) => row.rank },
  { header: "Driver ID", value: (row) => row.id },
  { header: "Driver", value: (row) => row.name },
  { header: "Vehicle", value: (row) => row.vehicle },
  { header: "Zone", value: (row) => row.zoneName },
  { header: "Rating", value: (row) => row.rating.toFixed(2), align: "right" },
  { header: "On-Time %", value: (row) => row.onTimeRate.toFixed(1), align: "right" },
  { header: "Acceptance %", value: (row) => row.acceptanceRate.toFixed(1), align: "right" },
  { header: "Cancel %", value: (row) => row.cancelRate.toFixed(1), align: "right" },
  { header: "Delivered", value: (row) => row.delivered, align: "right" },
  { header: "Revenue", value: (row) => row.revenue, align: "right" },
  { header: "Response (min)", value: (row) => row.responseMin.toFixed(1), align: "right" },
  { header: "Incidents", value: (row) => row.incidents, align: "right" },
  { header: "Demurrage", value: (row) => row.demurrage, align: "right" },
];

export function leaderboardTotalsCells(t: LeaderboardTotals): TotalsCell[] {
  const right = (content: string, className?: string): TotalsCell => ({ content, align: "right", className });
  return [
    { content: "" },
    { content: <span className="font-sans text-xs uppercase tracking-wide text-sidebar-fg">{t.drivers} Drivers · Fleet Avg</span> },
    right(""),
    right(formatPct(t.onTimeRate), "text-success"),
    right(formatPct(t.acceptanceRate)),
    right(formatPct(t.cancelRate)),
    right(t.delivered.toLocaleString()),
    right(formatMoney(t.revenue), "text-primary"),
    right(`${t.responseMin.toFixed(1)}m`),
    right(`${t.incidents} Total`),
    right(formatMoney(t.demurrage)),
  ];
}

export function leaderboardExportFooter(t: LeaderboardTotals): (string | number)[] {
  return ["", "", `${t.drivers} drivers`, "", "", "", t.onTimeRate.toFixed(1), t.acceptanceRate.toFixed(1), t.cancelRate.toFixed(1), t.delivered, t.revenue, t.responseMin.toFixed(1), t.incidents, t.demurrage];
}
