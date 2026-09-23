import { ListFilter } from "lucide-react";
import { Card } from "../../../components/Card";
import { categoryLabels, priorityLabels, slaLabels } from "../types";
import type { TicketFilters } from "../filterTickets";

interface TicketFilterBarProps {
  filters: TicketFilters;
  onChange: (filters: TicketFilters) => void;
  /** My Tickets' popover has no SLA filter — Unassigned's bar does. */
  showSla?: boolean;
  layout?: "bar" | "stacked";
}

const selectClasses = "rounded-lg border border-border bg-surface px-3 py-1.5 text-sm text-text";

function options(labels: Record<string, string>) {
  return Object.entries(labels).map(([value, label]) => (
    <option key={value} value={value}>
      {label}
    </option>
  ));
}

export function TicketFilterSelects({ filters, onChange, showSla = true }: Omit<TicketFilterBarProps, "layout">) {
  return (
    <>
      <select
        aria-label="Priority"
        value={filters.priority}
        onChange={(event) => onChange({ ...filters, priority: event.target.value as TicketFilters["priority"] })}
        className={selectClasses}
      >
        <option value="all">Priority: All</option>
        {options(priorityLabels)}
      </select>
      <select
        aria-label="Category"
        value={filters.category}
        onChange={(event) => onChange({ ...filters, category: event.target.value as TicketFilters["category"] })}
        className={selectClasses}
      >
        <option value="all">Category: All</option>
        {options(categoryLabels)}
      </select>
      {showSla && (
        <select
          aria-label="SLA Status"
          value={filters.sla}
          onChange={(event) => onChange({ ...filters, sla: event.target.value as TicketFilters["sla"] })}
          className={selectClasses}
        >
          <option value="all">SLA Status: All</option>
          {options(slaLabels)}
        </select>
      )}
    </>
  );
}

export function TicketFilterBar(props: TicketFilterBarProps) {
  return (
    <Card className="flex flex-wrap items-center gap-2 py-3">
      <span className="mr-1 flex items-center gap-1.5 text-sm text-text-muted">
        <ListFilter className="h-4 w-4" />
        Filters:
      </span>
      <TicketFilterSelects {...props} />
    </Card>
  );
}
