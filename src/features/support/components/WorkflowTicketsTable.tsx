import { ArrowDownLeft, ArrowUpRight, Flag, Wrench } from "lucide-react";
import { Avatar } from "../../../components/Avatar";
import { DataTable, type Column, type SortState } from "../../../components/DataTable";
import { DropdownMenu, type DropdownMenuItem } from "../../../components/DropdownMenu";
import { getAgent } from "../agents";
import { formatMinutesAgo } from "../formatTicketTime";
import { categoryLabels, type SupportTicket } from "../types";
import { PriorityBadge } from "./PriorityBadge";
import { StageBadge } from "./StageBadge";
import { RequesterName } from "./RequesterName";

interface WorkflowTicketsTableProps {
  rows: SupportTicket[];
  sort: SortState;
  onSortChange: (key: string) => void;
  actionsFor: (ticket: SupportTicket) => DropdownMenuItem[];
  onRowClick: (ticket: SupportTicket) => void;
}

/** Flags that tell a lead what needs them (TC-16). */
function Flags({ ticket }: { ticket: SupportTicket }) {
  return (
    <div className="mt-1 flex flex-wrap gap-1">
      {ticket.escalationRequest && (
        <span className="text-badge-base inline-flex items-center gap-1 rounded-full bg-tag-danger-bg px-2 py-0.5 text-tag-danger-fg">
          <Flag className="h-3 w-3" />
          Escalation requested
        </span>
      )}
      {ticket.queue === "technical" && ticket.escalation && (
        <span className="text-badge-base inline-flex items-center gap-1 rounded-full bg-tag-overnight-bg px-2 py-0.5 text-tag-overnight-fg">
          <ArrowUpRight className="h-3 w-3" />
          Escalated by {ticket.escalation.by}
        </span>
      )}
      {ticket.queue !== "technical" && ticket.techResolution && ticket.stage !== "closed" && (
        <span className="text-badge-base inline-flex items-center gap-1 rounded-full bg-tag-healthcare-bg px-2 py-0.5 text-tag-healthcare-fg">
          <ArrowDownLeft className="h-3 w-3" />
          Fixed by Technical: notify customer
        </span>
      )}
      {ticket.internal && (
        <span className="text-badge-base inline-flex items-center gap-1 rounded-full bg-tag-standard-bg px-2 py-0.5 text-tag-standard-fg">
          <Wrench className="h-3 w-3" />
          Internal issue
        </span>
      )}
    </div>
  );
}

export function WorkflowTicketsTable({ rows, sort, onSortChange, actionsFor, onRowClick }: WorkflowTicketsTableProps) {
  const columns: Column<SupportTicket>[] = [
    {
      header: "Ticket",
      sortKey: "id",
      accessor: (row) => (
        <div className="max-w-72">
          <p className="whitespace-nowrap text-xs text-text-muted">
            #{row.id} · {categoryLabels[row.category]}
          </p>
          <p className="truncate font-medium text-text">{row.subject}</p>
          <Flags ticket={row} />
        </div>
      ),
    },
    { header: "Requester", accessor: (row) => <RequesterName ticket={row} /> },
    { header: "Priority", sortKey: "priority", accessor: (row) => <PriorityBadge priority={row.priority} /> },
    {
      header: "Assignee",
      accessor: (row) => {
        const agent = getAgent(row.assigneeId);
        return agent ? (
          <span className="flex items-center gap-2 whitespace-nowrap">
            <Avatar name={agent.name} src={agent.avatar} size="sm" />
            {agent.name}
          </span>
        ) : (
          <span className="text-text-muted">Unassigned</span>
        );
      },
    },
    { header: "Stage", accessor: (row) => <StageBadge stage={row.stage} /> },
    { header: "Updated", sortKey: "lastActivity", accessor: (row) => <span className="whitespace-nowrap text-text-muted">{formatMinutesAgo(row.lastActivityMinutesAgo || 1)}</span> },
    { header: "Actions", align: "right", accessor: (row) => <DropdownMenu ariaLabel={`Actions for #${row.id}`} items={actionsFor(row)} /> },
  ];

  return <DataTable columns={columns} rows={rows} rowKey={(row) => row.id} sort={sort} onSortChange={onSortChange} onRowClick={onRowClick} />;
}
