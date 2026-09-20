import { Search, Download } from "lucide-react";
import { Button } from "../../../components/Button";
import type { AdjustmentFilters } from "../adjustments";

interface AdjustmentsFilterBarProps {
  filters: AdjustmentFilters;
  onChange: (filters: AdjustmentFilters) => void;
  onExport: () => void;
}

export function AdjustmentsFilterBar({ filters, onChange, onExport }: AdjustmentsFilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 sm:max-w-xs">
        <Search className="h-4 w-4 shrink-0 text-text-muted" />
        <input
          type="search"
          value={filters.search}
          onChange={(event) => onChange({ ...filters, search: event.target.value })}
          placeholder="ID, Customer, Order…"
          className="w-full min-w-0 bg-transparent text-sm text-text placeholder:text-text-muted focus:outline-none"
        />
      </div>
      <select
        value={filters.type}
        onChange={(event) => onChange({ ...filters, type: event.target.value as AdjustmentFilters["type"] })}
        className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text"
      >
        <option value="all">All Types</option>
        <option value="refund">Refund</option>
        <option value="credit">Credit</option>
      </select>
      <select
        value={filters.status}
        onChange={(event) => onChange({ ...filters, status: event.target.value as AdjustmentFilters["status"] })}
        className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text"
      >
        <option value="all">All Statuses</option>
        <option value="pending">Pending</option>
        <option value="processed">Processed</option>
        <option value="failed">Failed</option>
      </select>
      <Button type="button" variant="secondary" onClick={onExport}>
        <Download className="h-4 w-4" />
        Export CSV
      </Button>
    </div>
  );
}
