import { Avatar } from "../../../components/Avatar";
import { DropdownMenu } from "../../../components/DropdownMenu";
import { cn } from "../../../lib/cn";
import type { SupportTicket, TicketPriority, TicketStatus } from "../supportTickets";

const statusClasses: Record<TicketStatus, string> = {
  open: "bg-tag-info-bg text-tag-info-fg",
  "in-progress": "bg-tag-warning-bg text-tag-warning-fg",
  resolved: "bg-success/10 text-success",
  closed: "bg-tag-standard-bg text-tag-standard-fg",
};

const statusLabels: Record<TicketStatus, string> = {
  open: "Open",
  "in-progress": "In Progress",
  resolved: "Resolved",
  closed: "Closed",
};

const priorityClasses: Record<TicketPriority, string> = {
  low: "text-text-muted",
  medium: "text-info",
  high: "text-warning",
  critical: "text-danger",
};

const priorityLabels: Record<TicketPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
};

interface SupportTicketTableProps {
  tickets: SupportTicket[];
  onResolve: (ticket: SupportTicket) => void;
}

export function SupportTicketTable({ tickets, onResolve }: SupportTicketTableProps) {
  if (tickets.length === 0) {
    return <p className="py-6 text-center text-sm text-text-muted">No tickets match the current filter.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="text-label text-text-muted">
            <th className="pb-2 font-medium">Ticket ID</th>
            <th className="pb-2 font-medium">Subject</th>
            <th className="pb-2 font-medium">Status</th>
            <th className="pb-2 font-medium">Priority</th>
            <th className="pb-2 font-medium">Created</th>
            <th className="pb-2 font-medium">Last Update</th>
            <th className="pb-2 font-medium">Agent</th>
            <th className="pb-2 font-medium" />
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket.id} className="border-t border-border">
              <td className="py-2 font-medium text-text">{ticket.id}</td>
              <td className="py-2 text-text">{ticket.subject}</td>
              <td className="py-2">
                <span className={cn("text-badge rounded-full px-2 py-0.5", statusClasses[ticket.status])}>
                  {statusLabels[ticket.status]}
                </span>
              </td>
              <td className={cn("py-2 font-medium", priorityClasses[ticket.priority])}>
                {priorityLabels[ticket.priority]}
              </td>
              <td className="py-2 text-text-muted">
                <div>{ticket.createdDate}</div>
                <div className="text-xs">{ticket.createdTime}</div>
              </td>
              <td className="py-2 text-text-muted">{ticket.lastUpdate}</td>
              <td className="py-2 text-text-muted">
                <div className="flex items-center gap-2">
                  <Avatar name={ticket.agent} size="sm" />
                  {ticket.agent}
                </div>
              </td>
              <td className="py-2 text-right">
                <DropdownMenu
                  ariaLabel={`Actions for ${ticket.id}`}
                  items={
                    ticket.status === "resolved" || ticket.status === "closed"
                      ? []
                      : [{ label: "Mark as Resolved", onClick: () => onResolve(ticket) }]
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
