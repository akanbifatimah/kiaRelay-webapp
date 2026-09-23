import { useNavigate } from "react-router-dom";
import { Avatar } from "../../../components/Avatar";
import { DataTable, type Column, type SortState } from "../../../components/DataTable";
import { DropdownMenu, type DropdownMenuItem } from "../../../components/DropdownMenu";
import { cn } from "../../../lib/cn";
import { formatMinutesAgo, formatSlaRemaining } from "../formatTicketTime";
import { ticketDetailHref } from "../tickets";
import { categoryLabels, type SupportTicket } from "../types";
import { PriorityBadge } from "./PriorityBadge";
import { TicketStatusBadge } from "./TicketStatusBadge";
import { RequesterName } from "./RequesterName";

interface MyTicketsTableProps {
  rows: SupportTicket[];
  sort: SortState;
  onSortChange: (key: string) => void;
  onReassign: (ticket: SupportTicket) => void;
  onResolve: (ticket: SupportTicket) => void;
  /** Where the detail page's back link returns to — defaults to My Tickets. */
  linkState?: { from: string; fromLabel: string };
}

const MY_TICKETS_STATE = { from: "/support/my-tickets", fromLabel: "My Tickets" };

function SlaCell({ ticket }: { ticket: SupportTicket }) {
  if (ticket.status === "resolved") return <span className="text-text-muted">Met</span>;
  const urgent = ticket.sla === "breached" || ticket.sla === "at-risk";
  return (
    <span
      className={cn(
        "whitespace-nowrap",
        urgent ? "rounded bg-tag-danger-bg px-1.5 py-0.5 text-xs font-semibold text-tag-danger-fg" : "text-text-muted",
      )}
    >
      {formatSlaRemaining(ticket.slaMinutesLeft)}
    </span>
  );
}

export function MyTicketsTable({ rows, sort, onSortChange, onReassign, onResolve, linkState = MY_TICKETS_STATE }: MyTicketsTableProps) {
  const navigate = useNavigate();

  function actionsFor(ticket: SupportTicket): DropdownMenuItem[] {
    const items: DropdownMenuItem[] = [
      { label: "Open Ticket", onClick: () => navigate(ticketDetailHref(ticket), { state: linkState }) },
    ];
    if (ticket.status === "resolved") return items;
    return [
      ...items,
      { label: "Reassign", onClick: () => onReassign(ticket) },
      { label: "Mark as Resolved", onClick: () => onResolve(ticket) },
    ];
  }

  const columns: Column<SupportTicket>[] = [
    {
      header: "Ticket",
      sortKey: "id",
      accessor: (row) => (
        <div className="max-w-56">
          <p className="whitespace-nowrap font-semibold text-text">{row.id}</p>
          <p className="whitespace-normal text-xs text-text-muted">{row.subject}</p>
        </div>
      ),
    },
    {
      header: "Customer",
      sortKey: "customer",
      accessor: (row) => (
        <div className="flex items-center gap-2 whitespace-nowrap">
          <Avatar name={row.customer} size="sm" />
          <RequesterName ticket={row} />
        </div>
      ),
    },
    { header: "Category", sortKey: "category", accessor: (row) => categoryLabels[row.category] },
    { header: "Priority", sortKey: "priority", accessor: (row) => <PriorityBadge priority={row.priority} variant="text" /> },
    { header: "SLA", sortKey: "sla", accessor: (row) => <SlaCell ticket={row} /> },
    {
      header: "Last Activity",
      sortKey: "lastActivity",
      accessor: (row) => <span className="whitespace-nowrap text-text-muted">{formatMinutesAgo(row.lastActivityMinutesAgo)}</span>,
    },
    { header: "Status", accessor: (row) => <TicketStatusBadge status={row.status} /> },
    {
      header: "",
      align: "right",
      accessor: (row) => <DropdownMenu ariaLabel={`Actions for ${row.id}`} items={actionsFor(row)} />,
    },
  ];

  if (rows.length === 0) {
    return <p className="py-10 text-center text-sm text-text-muted">No tickets in this view.</p>;
  }

  return (
    <DataTable
      columns={columns}
      rows={rows}
      rowKey={(row) => row.id}
      sort={sort}
      onSortChange={onSortChange}
      onRowClick={(row) => navigate(ticketDetailHref(row), { state: linkState })}
    />
  );
}
