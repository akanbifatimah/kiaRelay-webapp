import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Card } from "../../../components/Card";
import { DataTable } from "../../../components/DataTable";
import { Pagination } from "../../../components/Pagination";
import { ExportMenuButton } from "../../../components/ExportMenuButton";
import { useTableState } from "../../../hooks/useTableState";
import { industryLabels, type Industry } from "../customerPerformanceData";
import { summarizeCohort, type CustomerAccount } from "../customerPerformance";
import { DIRECTORY_SORTERS, directoryColumns, directoryExportColumns, directoryExportFooter, directoryTotalsCells } from "./customerDirectoryColumns";
import { TotalsRow } from "./TotalsRow";

interface CustomerDirectoryCardProps {
  accounts: CustomerAccount[];
  rangeText: string;
  onOpenAccount: (account: CustomerAccount) => void;
}

export function CustomerDirectoryCard({ accounts, rangeText, onOpenAccount }: CustomerDirectoryCardProps) {
  const [search, setSearch] = useState("");
  const [industry, setIndustry] = useState<Industry | "all">("all");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return accounts.filter(
      (account) =>
        (industry === "all" || account.industry === industry) &&
        (!query || [account.name, account.id, industryLabels[account.industry]].some((value) => value.toLowerCase().includes(query))),
    );
  }, [accounts, search, industry]);
  const summary = useMemo(() => summarizeCohort(filtered), [filtered]);
  const table = useTableState({ rows: filtered, sorters: DIRECTORY_SORTERS, initialSort: { key: "spend", direction: "desc" }, initialPageSize: 8 });

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-text">Customer Accounts Directory</h2>
          <span className="rounded-full bg-bg px-2.5 py-0.5 text-xs text-text-muted">{accounts.length.toLocaleString()} Accounts</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex min-w-56 flex-1 items-center gap-2 rounded-lg border border-border bg-bg px-3 py-2 lg:w-72 lg:flex-none">
            <Search className="h-4 w-4 text-text-muted" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Filter by customer, company, account ID..."
              className="w-full bg-transparent text-sm text-text placeholder:text-text-muted focus:outline-none"
            />
          </div>
          <select
            aria-label="Industry"
            value={industry}
            onChange={(event) => setIndustry(event.target.value as Industry | "all")}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text"
          >
            <option value="all">All Industries</option>
            {Object.entries(industryLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <ExportMenuButton
            label="Export accounts directory"
            getExport={() => ({
              title: "Customer Accounts Directory",
              subtitle: `${rangeText}${industry === "all" ? "" : ` · ${industryLabels[industry]}`}${search ? ` · "${search}"` : ""}`,
              columns: directoryExportColumns,
              rows: table.sorted,
              footer: directoryExportFooter(summary),
            })}
          />
        </div>
      </div>
      {filtered.length === 0 ? (
        <p className="py-10 text-center text-sm text-text-muted">No accounts match the current filters.</p>
      ) : (
        <DataTable
          columns={directoryColumns}
          rows={table.pageRows}
          rowKey={(row) => row.id}
          sort={table.sort}
          onSortChange={table.onSortChange}
          onRowClick={onOpenAccount}
          footer={<TotalsRow tone="muted" cells={directoryTotalsCells(summary)} />}
        />
      )}
      <Pagination {...table.pagination} itemLabel="accounts" pageSizeOptions={[8, 15, 25, 50]} />
    </Card>
  );
}
