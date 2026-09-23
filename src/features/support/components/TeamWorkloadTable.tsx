import { Avatar } from "../../../components/Avatar";
import { DataTable, type Column, type SortState } from "../../../components/DataTable";
import { cn } from "../../../lib/cn";
import type { SupportAgent } from "../types";
import { AgentStatusBadge } from "./AgentStatusBadge";

type CountTone = "neutral" | "warning" | "danger";

const toneClasses: Record<CountTone, string> = {
  neutral: "bg-tag-standard-bg text-tag-standard-fg",
  warning: "bg-tag-warning-bg text-tag-warning-fg",
  danger: "bg-tag-danger-bg text-tag-danger-fg",
};

// At Risk/Breached only take their warning/danger color when non-zero —
// a "0" in red would read as an alarm that isn't there.
function CountChip({ value, tone }: { value: number; tone: CountTone }) {
  return (
    <span className={cn("inline-flex min-w-7 justify-center rounded px-1.5 py-0.5 text-xs font-semibold", toneClasses[value === 0 ? "neutral" : tone])}>
      {value}
    </span>
  );
}

interface TeamWorkloadTableProps {
  rows: SupportAgent[];
  sort: SortState;
  onSortChange: (key: string) => void;
}

export function TeamWorkloadTable({ rows, sort, onSortChange }: TeamWorkloadTableProps) {
  const columns: Column<SupportAgent>[] = [
    {
      header: "Agent",
      sortKey: "name",
      accessor: (row) => (
        <div className="flex items-center gap-2 whitespace-nowrap">
          <Avatar name={row.name} src={row.avatar} size="sm" />
          <div>
            <p className="font-medium text-text">{row.name}</p>
            <p className="text-xs text-text-muted">{row.team}</p>
          </div>
        </div>
      ),
    },
    { header: "Open Tickets", sortKey: "openTickets", accessor: (row) => <CountChip value={row.openTickets} tone="neutral" /> },
    { header: "At Risk", sortKey: "slaAtRisk", accessor: (row) => <CountChip value={row.slaAtRisk} tone="warning" /> },
    { header: "Breached", sortKey: "breached", accessor: (row) => <CountChip value={row.breached} tone="danger" /> },
    { header: "Resolved Today", sortKey: "resolvedToday", accessor: (row) => row.resolvedToday },
    { header: "Status", sortKey: "availability", accessor: (row) => <AgentStatusBadge availability={row.availability} /> },
  ];

  if (rows.length === 0) {
    return <p className="py-10 text-center text-sm text-text-muted">No agents match the current filters.</p>;
  }

  return <DataTable columns={columns} rows={rows} rowKey={(row) => row.id} sort={sort} onSortChange={onSortChange} />;
}
