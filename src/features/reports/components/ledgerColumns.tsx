import type { Column } from "../../../components/DataTable";
import type { ExportColumn } from "../../../lib/exportTable";
import { cn } from "../../../lib/cn";
import { formatMoneyExact } from "../formatReport";
import { segmentMeta } from "../segments";
import type { LedgerEntry } from "../revenueLedger";
import type { RevenueTotals } from "../revenueAggregates";
import type { TotalsCell } from "./TotalsRow";

export type LedgerSortKey = "date" | "segment" | "gross" | "refunds" | "net" | "demurrage" | "surge" | "fuel" | "tolls";

export const LEDGER_SORTERS: Record<LedgerSortKey, (row: LedgerEntry) => string | number> = {
  date: (row) => row.date,
  segment: (row) => segmentMeta(row.segment).shortLabel,
  gross: (row) => row.gross,
  refunds: (row) => row.refunds,
  net: (row) => row.net,
  demurrage: (row) => row.demurrage,
  surge: (row) => row.surge,
  fuel: (row) => row.fuel,
  tolls: (row) => row.tolls,
};

// Intl renders -0 as "-$0.00" — refunds of zero must show as "$0.00".
const negate = (value: number) => (value === 0 ? 0 : -value);

const money = (value: number, className?: string) => (
  <span className={cn("whitespace-nowrap font-mono tabular-nums", className)}>{formatMoneyExact(value)}</span>
);

export const ledgerColumns: Column<LedgerEntry>[] = [
  { header: "Date", sortKey: "date", accessor: (row) => <span className="whitespace-nowrap font-mono text-xs text-text-muted">{row.date}</span> },
  {
    header: "Segment",
    sortKey: "segment",
    accessor: (row) => (
      <span className="flex items-center gap-2 whitespace-nowrap font-medium">
        <span className="h-1.5 w-1.5 rounded-full bg-sidebar" />
        {segmentMeta(row.segment).shortLabel}
      </span>
    ),
  },
  { header: "Gross Revenue", sortKey: "gross", align: "right", accessor: (row) => money(row.gross) },
  {
    header: "Refunds",
    sortKey: "refunds",
    align: "right",
    accessor: (row) => money(negate(row.refunds), row.refunds > 0 ? "text-danger" : "text-text-muted"),
  },
  { header: "Net Revenue", sortKey: "net", align: "right", accessor: (row) => money(row.net, "font-semibold") },
  { header: "Demurrage", sortKey: "demurrage", align: "right", accessor: (row) => money(row.demurrage, "text-text-muted") },
  { header: "Surge", sortKey: "surge", align: "right", accessor: (row) => money(row.surge, row.surgeSpike ? "text-primary" : "text-text-muted") },
  { header: "Fuel Surch.", sortKey: "fuel", align: "right", accessor: (row) => money(row.fuel, "text-text-muted") },
  { header: "Tolls", sortKey: "tolls", align: "right", accessor: (row) => money(row.tolls, "text-text-muted") },
];

export const ledgerExportColumns: ExportColumn<LedgerEntry>[] = [
  { header: "Date", value: (row) => row.date },
  { header: "Segment", value: (row) => segmentMeta(row.segment).shortLabel },
  { header: "Gross Revenue", value: (row) => row.gross.toFixed(2), align: "right" },
  { header: "Refunds", value: (row) => (-row.refunds).toFixed(2), align: "right" },
  { header: "Net Revenue", value: (row) => row.net.toFixed(2), align: "right" },
  { header: "Demurrage", value: (row) => row.demurrage.toFixed(2), align: "right" },
  { header: "Surge", value: (row) => row.surge.toFixed(2), align: "right" },
  { header: "Fuel Surcharge", value: (row) => row.fuel.toFixed(2), align: "right" },
  { header: "Tolls", value: (row) => row.tolls.toFixed(2), align: "right" },
];

export function ledgerTotalsCells(totals: RevenueTotals, cycles: number): TotalsCell[] {
  const right = (value: number, className?: string): TotalsCell => ({ content: formatMoneyExact(value), align: "right", className });
  return [
    { content: <span className="font-sans text-xs uppercase tracking-wide text-sidebar-fg">Total Filtered</span> },
    { content: <span className="font-sans text-xs text-primary">{cycles.toLocaleString()} Cycles Aggregated</span> },
    right(totals.gross),
    right(negate(totals.refunds)),
    right(totals.net, "text-primary"),
    right(totals.demurrage),
    right(totals.surge),
    right(totals.fuel),
    right(totals.tolls),
  ];
}

export function ledgerExportFooter(totals: RevenueTotals, cycles: number): string[] {
  return [
    "TOTAL FILTERED",
    `${cycles} cycles aggregated`,
    ...[totals.gross, -totals.refunds, totals.net, totals.demurrage, totals.surge, totals.fuel, totals.tolls].map((value) => value.toFixed(2)),
  ];
}
