import { useMemo } from "react";
import { FileText, Download } from "lucide-react";
import { Card } from "../../../components/Card";
import { DataTable } from "../../../components/DataTable";
import { Pagination } from "../../../components/Pagination";
import { useToast } from "../../../components/toast/ToastContext";
import { exportRowsToCsv, printRowsAsPdf, type TableExport } from "../../../lib/exportTable";
import { useTableState } from "../../../hooks/useTableState";
import { sumLedger } from "../revenueAggregates";
import { SEGMENTS, type RevenueSegment } from "../segments";
import type { LedgerEntry } from "../revenueLedger";
import { LEDGER_SORTERS, ledgerColumns, ledgerExportColumns, ledgerExportFooter, ledgerTotalsCells } from "./ledgerColumns";
import { TotalsRow } from "./TotalsRow";
import { ReportScheduleForm } from "./ReportScheduleForm";

interface RevenueLedgerCardProps {
  /** Already filtered by range + segment. */
  entries: LedgerEntry[];
  rangeText: string;
  segment: RevenueSegment | "all";
  onSegmentChange: (segment: RevenueSegment | "all") => void;
}

export function RevenueLedgerCard({ entries, rangeText, segment, onSegmentChange }: RevenueLedgerCardProps) {
  const { showToast } = useToast();
  const table = useTableState({ rows: entries, sorters: LEDGER_SORTERS, initialSort: { key: "date", direction: "desc" }, initialPageSize: 10 });
  const totals = useMemo(() => sumLedger(entries), [entries]);

  function buildExport(): TableExport<LedgerEntry> {
    const segmentText = segment === "all" ? "All segments" : SEGMENTS.find((s) => s.key === segment)?.label;
    return {
      title: "Detailed Revenue Breakdown & Ledger",
      subtitle: `${rangeText} · ${segmentText}`,
      columns: ledgerExportColumns,
      rows: table.sorted,
      footer: ledgerExportFooter(totals, entries.length),
    };
  }

  function exportAs(format: "csv" | "pdf") {
    if (entries.length === 0) return showToast("error", "No ledger rows in this range — nothing to export.");
    if (format === "csv") {
      exportRowsToCsv(buildExport());
      showToast("success", `Exported ${entries.length} ledger rows to CSV.`);
    } else if (!printRowsAsPdf(buildExport())) {
      showToast("error", "Your browser blocked the report window — allow pop-ups to export PDF.");
    }
  }

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold text-text">Detailed Revenue Breakdown &amp; Ledger</h2>
        <div className="flex flex-wrap items-center gap-2">
          <select
            aria-label="Segment"
            value={segment}
            onChange={(event) => onSegmentChange(event.target.value as RevenueSegment | "all")}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text"
          >
            <option value="all">All Segments</option>
            {SEGMENTS.map((s) => (
              <option key={s.key} value={s.key}>
                {s.shortLabel}
              </option>
            ))}
          </select>
          <button type="button" onClick={() => exportAs("csv")} className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-text hover:bg-bg">
            <Download className="h-4 w-4" />
            Export CSV
          </button>
          <button type="button" onClick={() => exportAs("pdf")} className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-text hover:bg-bg">
            <FileText className="h-4 w-4" />
            Export PDF
          </button>
        </div>
      </div>
      {entries.length === 0 ? (
        <p className="py-10 text-center text-sm text-text-muted">No ledger cycles in this range.</p>
      ) : (
        <DataTable
          columns={ledgerColumns}
          rows={table.pageRows}
          rowKey={(row) => row.id}
          sort={table.sort}
          onSortChange={table.onSortChange}
          footer={<TotalsRow cells={ledgerTotalsCells(totals, entries.length)} />}
        />
      )}
      <Pagination {...table.pagination} itemLabel="entries" />
      <ReportScheduleForm reportId="revenue" reportName="Revenue Report" />
    </Card>
  );
}
