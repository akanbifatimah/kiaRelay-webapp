import { Download } from "lucide-react";
import { Button } from "../../../components/Button";
import type { DeliveryType } from "../../../components/TagChip";
import type { OrderStatus } from "../../../components/StatusBadge";
import type { CustomerOrderFilters, DateRangePreset } from "../filterCustomerOrders";

interface CustomerOrderFilterBarProps {
  filters: CustomerOrderFilters;
  onChange: (filters: CustomerOrderFilters) => void;
  onExport: () => void;
}

export function CustomerOrderFilterBar({ filters, onChange, onExport }: CustomerOrderFilterBarProps) {
  function update<K extends keyof CustomerOrderFilters>(key: K, value: CustomerOrderFilters[K]) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        value={filters.dateRange}
        onChange={(event) => update("dateRange", event.target.value as DateRangePreset)}
        className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text"
      >
        <option value="all">Date Range</option>
        <option value="30d">Last 30 Days</option>
        <option value="90d">Last 90 Days</option>
        <option value="year">Last Year</option>
      </select>
      <select
        value={filters.deliveryType}
        onChange={(event) => update("deliveryType", event.target.value as DeliveryType | "all")}
        className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text"
      >
        <option value="all">All Delivery Types</option>
        <option value="express">Express</option>
        <option value="standard">Standard</option>
        <option value="overnight">Overnight</option>
        <option value="freight">Freight</option>
      </select>
      <select
        value={filters.status}
        onChange={(event) => update("status", event.target.value as OrderStatus | "all")}
        className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text"
      >
        <option value="all">All Statuses</option>
        <option value="delivered">Delivered</option>
        <option value="in-transit">In Transit</option>
        <option value="cancelled">Cancelled</option>
      </select>
      <div className="flex items-center gap-1">
        <input
          type="number"
          value={filters.minAmount}
          onChange={(event) => update("minAmount", event.target.value)}
          placeholder="$ Min"
          className="w-20 rounded-lg border border-border bg-surface px-2 py-2 text-sm text-text"
        />
        <span className="text-text-muted">–</span>
        <input
          type="number"
          value={filters.maxAmount}
          onChange={(event) => update("maxAmount", event.target.value)}
          placeholder="$ Max"
          className="w-20 rounded-lg border border-border bg-surface px-2 py-2 text-sm text-text"
        />
      </div>
      <Button type="button" variant="secondary" onClick={onExport}>
        <Download className="h-4 w-4" />
        Export CSV
      </Button>
    </div>
  );
}
