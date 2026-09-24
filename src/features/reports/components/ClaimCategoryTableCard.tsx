import { useNavigate } from "react-router-dom";
import { Card } from "../../../components/Card";
import { DataTable, type Column } from "../../../components/DataTable";
import { ExportMenuButton } from "../../../components/ExportMenuButton";
import type { ExportColumn } from "../../../lib/exportTable";
import { cn } from "../../../lib/cn";
import { useTableState } from "../../../hooks/useTableState";
import { formatMoneyExact, formatPct } from "../formatReport";
import { CATEGORY_FILL, type CategoryRow, type ClaimsSummary } from "../claimsAnalytics";
import { TotalsRow } from "./TotalsRow";

type CategorySortKey = "label" | "total" | "claimedValue" | "avgClaim" | "resolutionRate" | "avgResolutionDays" | "escalated";

const SORTERS: Record<CategorySortKey, (row: CategoryRow) => string | number> = {
  label: (row) => row.label,
  total: (row) => row.total,
  claimedValue: (row) => row.claimedValue,
  avgClaim: (row) => row.avgClaim,
  resolutionRate: (row) => row.resolutionRate,
  avgResolutionDays: (row) => row.avgResolutionDays,
  escalated: (row) => row.escalated,
};

const mono = "whitespace-nowrap font-mono tabular-nums";

const columns: Column<CategoryRow>[] = [
  {
    header: "Category",
    sortKey: "label",
    accessor: (row) => (
      <span className="flex items-center gap-2 whitespace-nowrap font-medium">
        <span className="h-2.5 w-2.5 rounded-sm" style={{ background: CATEGORY_FILL[row.category] }} />
        {row.label}
      </span>
    ),
  },
  { header: "Claims", sortKey: "total", align: "right", accessor: (row) => <span className={cn(mono, "font-semibold")}>{row.total}</span> },
  { header: "Share", align: "right", accessor: (row) => <span className={cn(mono, "text-text-muted")}>{formatPct(row.share)}</span> },
  { header: "Claimed Value", sortKey: "claimedValue", align: "right", accessor: (row) => <span className={cn(mono, "font-semibold")}>{formatMoneyExact(row.claimedValue)}</span> },
  { header: "Avg Claim", sortKey: "avgClaim", align: "right", accessor: (row) => <span className={cn(mono, "text-text-muted")}>{formatMoneyExact(row.avgClaim)}</span> },
  { header: "Resolved %", sortKey: "resolutionRate", align: "right", accessor: (row) => <span className={mono}>{formatPct(row.resolutionRate)}</span> },
  { header: "Avg Days to Resolve", sortKey: "avgResolutionDays", align: "right", accessor: (row) => <span className={mono}>{row.avgResolutionDays.toFixed(1)}</span> },
  { header: "Escalated", sortKey: "escalated", align: "right", accessor: (row) => <span className={cn(mono, row.escalated > 0 && "text-danger")}>{row.escalated}</span> },
];

const exportColumns: ExportColumn<CategoryRow>[] = [
  { header: "Category", value: (row) => row.label },
  { header: "Claims", value: (row) => row.total, align: "right" },
  { header: "Share %", value: (row) => row.share.toFixed(1), align: "right" },
  { header: "Claimed Value", value: (row) => row.claimedValue.toFixed(2), align: "right" },
  { header: "Avg Claim", value: (row) => row.avgClaim.toFixed(2), align: "right" },
  { header: "Resolved %", value: (row) => row.resolutionRate.toFixed(1), align: "right" },
  { header: "Avg Days to Resolve", value: (row) => row.avgResolutionDays.toFixed(1), align: "right" },
  { header: "Escalated", value: (row) => row.escalated, align: "right" },
];

interface ClaimCategoryTableCardProps {
  rows: CategoryRow[];
  summary: ClaimsSummary;
  rangeText: string;
}

export function ClaimCategoryTableCard({ rows, summary, rangeText }: ClaimCategoryTableCardProps) {
  const navigate = useNavigate();
  const table = useTableState({ rows, sorters: SORTERS, initialSort: { key: "total", direction: "desc" } });
  const avgClaim = summary.total === 0 ? 0 : summary.claimedValue / summary.total;

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-text">Category Breakdown</h2>
          <p className="text-xs text-text-muted">Select a category to open its claims in Claims Management</p>
        </div>
        <ExportMenuButton
          label="Export category breakdown"
          getExport={() => ({
            title: "Claims Analytics — Category Breakdown",
            subtitle: rangeText,
            columns: exportColumns,
            rows: table.sorted,
            footer: ["Total", summary.total, "100.0", summary.claimedValue.toFixed(2), avgClaim.toFixed(2), summary.resolutionRate.toFixed(1), summary.avgResolutionDays.toFixed(1), summary.escalated],
          })}
        />
      </div>
      <DataTable
        columns={columns}
        rows={table.sorted}
        rowKey={(row) => row.category}
        sort={table.sort}
        onSortChange={table.onSortChange}
        onRowClick={(row) => navigate(`/support/claims?category=${row.category}`)}
        footer={
          <TotalsRow
            cells={[
              { content: <span className="font-sans">Total</span> },
              { content: summary.total, align: "right" },
              { content: summary.total ? "100.0%" : "0.0%", align: "right" },
              { content: formatMoneyExact(summary.claimedValue), align: "right", className: "text-primary" },
              { content: formatMoneyExact(avgClaim), align: "right" },
              { content: formatPct(summary.resolutionRate), align: "right" },
              { content: summary.avgResolutionDays.toFixed(1), align: "right" },
              { content: summary.escalated, align: "right" },
            ]}
          />
        }
      />
    </Card>
  );
}
