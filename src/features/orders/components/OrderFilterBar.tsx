import { Search, Download } from "lucide-react";
import { Button } from "../../../components/Button";
import type { OrderStatus } from "../../../components/StatusBadge";
import type { DateFilter } from "../filterOrders";

const statusOptions: { value: OrderStatus | "all"; label: string }[] = [
  { value: "all", label: "Status: All" },
  { value: "delivered", label: "Delivered" },
  { value: "in-transit", label: "In Transit" },
  { value: "pending", label: "Pending" },
  { value: "cancelled", label: "Cancelled" },
];

const dateOptions: { value: DateFilter; label: string }[] = [
  { value: "all", label: "Date Range" },
  { value: "today", label: "Today" },
  { value: "7d", label: "Last 7 Days" },
  { value: "30d", label: "Last 30 Days" },
];

interface OrderFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: OrderStatus | "all";
  onStatusChange: (value: OrderStatus | "all") => void;
  dateFilter: DateFilter;
  onDateFilterChange: (value: DateFilter) => void;
  industry: string;
  onIndustryChange: (value: string) => void;
  industries: string[];
  onExport: () => void;
}

export function OrderFilterBar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  dateFilter,
  onDateFilterChange,
  industry,
  onIndustryChange,
  industries,
  onExport,
}: OrderFilterBarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 sm:max-w-xs">
        <Search className="h-4 w-4 shrink-0 text-text-muted" />
        <input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Filter by ID, Customer..."
          className="w-full min-w-0 bg-transparent text-sm text-text placeholder:text-text-muted focus:outline-none"
        />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={status}
          onChange={(event) => onStatusChange(event.target.value as OrderStatus | "all")}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <select
          value={dateFilter}
          onChange={(event) => onDateFilterChange(event.target.value as DateFilter)}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text"
        >
          {dateOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <select
          value={industry}
          onChange={(event) => onIndustryChange(event.target.value)}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text"
        >
          <option value="all">All Industries</option>
          {industries.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <Button type="button" variant="secondary" onClick={onExport}>
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>
    </div>
  );
}
