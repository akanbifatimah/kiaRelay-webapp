import { useNavigate } from "react-router-dom";
import { DataTable, type Column, type SortState } from "../../../components/DataTable";
import { formatMinutesAgo } from "../formatTicketTime";
import { ticketDetailHref } from "../tickets";
import { categoryLabels, type SupportTicket } from "../types";
import { PriorityBadge } from "./PriorityBadge";
import { SlaStatusBadge } from "./SlaStatusBadge";
import { RequesterName } from "./RequesterName";

interface UnassignedTicketsTableProps {
  rows: SupportTicket[];
  sort: SortState;
  onSortChange: (key: string) => void;
  onAssign: (ticket: SupportTicket) => void;
}

// Assign is a visible-text button, not a DropdownMenu — the screenshot shows
// it inline on every row since it's the one action this queue exists for.
// The row itself opens the ticket; Assign stops propagation so it doesn't
// navigate away at the same time.
export function UnassignedTicketsTable({ rows, sort, onSortChange, onAssign }: UnassignedTicketsTableProps) {
  const navigate = useNavigate();

  const columns: Column<SupportTicket>[] = [
    { header: "ID", sortKey: "id", accessor: (row) => <span className="whitespace-nowrap font-medium">#{row.id}</span> },
    {
      header: "Subject & Customer",
      sortKey: "subject",
      accessor: (row) => (
        <div>
          <p className="font-semibold text-text">{row.subject}</p>
          <RequesterName ticket={row} className="text-xs text-text-muted" />
        </div>
      ),
    },
    { header: "Category", sortKey: "category", accessor: (row) => categoryLabels[row.category] },
    { header: "Priority", sortKey: "priority", accessor: (row) => <PriorityBadge priority={row.priority} /> },
    {
      header: "Created",
      sortKey: "created",
      accessor: (row) => <span className="whitespace-nowrap text-text-muted">{formatMinutesAgo(row.createdMinutesAgo)}</span>,
    },
    { header: "SLA Status", sortKey: "sla", accessor: (row) => <SlaStatusBadge sla={row.sla} minutesLeft={row.slaMinutesLeft} /> },
    {
      header: "Actions",
      align: "right",
      accessor: (row) => (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onAssign(row);
          }}
          className="rounded-md bg-sidebar px-3 py-1 text-xs font-semibold text-white hover:opacity-90"
        >
          Assign
        </button>
      ),
    },
  ];

  if (rows.length === 0) {
    return <p className="py-10 text-center text-sm text-text-muted">No unassigned tickets match the current filters.</p>;
  }

  return (
    <DataTable
      columns={columns}
      rows={rows}
      rowKey={(row) => row.id}
      sort={sort}
      onSortChange={onSortChange}
      onRowClick={(row) => navigate(ticketDetailHref(row), { state: { from: "/support/unassigned", fromLabel: "Unassigned Tickets" } })}
    />
  );
}
