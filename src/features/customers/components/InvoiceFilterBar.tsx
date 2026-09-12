import { ListFilter } from "lucide-react";
import type { InvoiceStatus } from "../companyInvoices";
import { DEFAULT_INVOICE_FILTERS, type InvoiceFilters } from "../filterInvoices";

interface InvoiceFilterBarProps {
  filters: InvoiceFilters;
  branchOptions: string[];
  onChange: (filters: InvoiceFilters) => void;
}

export function InvoiceFilterBar({ filters, branchOptions, onChange }: InvoiceFilterBarProps) {
  function update<K extends keyof InvoiceFilters>(key: K, value: InvoiceFilters[K]) {
    onChange({ ...filters, [key]: value });
  }

  const hasActiveFilters =
    filters.status !== "all" || filters.branch !== "all" || filters.dateFrom !== "" || filters.dateTo !== "";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-text-muted">
        <ListFilter className="h-4 w-4" />
        Filters
      </span>
      <select
        value={filters.status}
        onChange={(event) => update("status", event.target.value as InvoiceStatus | "all")}
        className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text"
      >
        <option value="all">All Statuses</option>
        <option value="paid">Paid</option>
        <option value="overdue">Overdue</option>
        <option value="pending">Pending</option>
      </select>
      <select
        value={filters.branch}
        onChange={(event) => update("branch", event.target.value)}
        className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text"
      >
        <option value="all">All Branches</option>
        {branchOptions.map((branch) => (
          <option key={branch} value={branch}>
            {branch}
          </option>
        ))}
      </select>
      <input
        type="date"
        value={filters.dateFrom}
        onChange={(event) => update("dateFrom", event.target.value)}
        className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text"
      />
      <span className="text-text-muted">–</span>
      <input
        type="date"
        value={filters.dateTo}
        onChange={(event) => update("dateTo", event.target.value)}
        className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text"
      />
      {hasActiveFilters && (
        <button
          type="button"
          onClick={() => onChange(DEFAULT_INVOICE_FILTERS)}
          className="text-sm font-medium text-primary hover:underline"
        >
          Clear All
        </button>
      )}
    </div>
  );
}
