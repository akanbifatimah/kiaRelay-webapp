import { Link, useLocation } from "react-router-dom";
import { Clock, MessagesSquare, UserRound } from "lucide-react";
import { Card } from "../../../components/Card";
import { cn } from "../../../lib/cn";
import { formatMinutesAgo } from "../formatTicketTime";
import { ticketDetailHref } from "../tickets";
import { categoryLabels, priorityLabels, type SupportTicket, type TicketPriority } from "../types";

const priorityClasses: Record<TicketPriority, string> = {
  critical: "bg-tag-danger-bg text-tag-danger-fg",
  high: "bg-tag-danger-bg text-tag-danger-fg",
  medium: "bg-tag-overnight-bg text-tag-overnight-fg",
  low: "bg-tag-standard-bg text-tag-standard-fg",
};

interface RequesterTicketsCardProps {
  tickets: SupportTicket[];
  allHref: string;
  /** "driver" = category chip + summary (Driver Support View); "customer" =
   * compact ID/priority/subject rows (Customer Support View). */
  variant: "driver" | "customer";
  backLabel: string;
}

export function RequesterTicketsCard({ tickets, allHref, variant, backLabel }: RequesterTicketsCardProps) {
  const { pathname } = useLocation();
  const linkState = { from: pathname, fromLabel: backLabel };

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-base font-semibold text-text">
          {variant === "driver" && <MessagesSquare className="h-4 w-4" />}
          Open Tickets{variant === "driver" && ` (${tickets.length})`}
        </h2>
        <Link to={allHref} className="text-xs font-semibold text-primary hover:underline">
          View All
        </Link>
      </div>
      {tickets.length === 0 && <p className="py-6 text-center text-sm text-text-muted">No open tickets.</p>}
      {tickets.map((ticket) => (
        <Link
          key={ticket.id}
          to={ticketDetailHref(ticket)}
          state={linkState}
          className="flex flex-col gap-1.5 rounded-lg border border-border p-3 hover:border-primary/40 hover:bg-bg"
        >
          {variant === "driver" ? (
            <>
              <div className="flex items-start justify-between gap-2">
                <p className="flex items-center gap-2 font-semibold text-text">
                  <span className={cn("text-label rounded px-1.5 py-0.5 uppercase", ticket.category === "maintenance" ? "bg-warning text-white" : "bg-sidebar text-white")}>
                    {categoryLabels[ticket.category]}
                  </span>
                  {ticket.subject}
                </p>
                <span className="whitespace-nowrap text-xs text-text-muted">{ticket.id}</span>
              </div>
              {ticket.requester?.summary && <p className="line-clamp-1 text-sm text-text-muted">{ticket.requester.summary}</p>}
              <p className="flex items-center gap-4 text-xs text-text-muted">
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {formatMinutesAgo(ticket.createdMinutesAgo)}
                </span>
                {ticket.requester?.handler && (
                  <span className="flex items-center gap-1">
                    <UserRound className="h-3.5 w-3.5" />
                    {ticket.requester.handler}
                  </span>
                )}
              </p>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-text-muted">{ticket.id}</span>
                <span className={cn("rounded px-1.5 py-0.5 text-xs font-medium", priorityClasses[ticket.priority])}>{priorityLabels[ticket.priority]}</span>
              </div>
              <p className="font-semibold text-text">{ticket.subject}</p>
              <p className="text-xs text-text-muted">
                Updated {formatMinutesAgo(ticket.lastActivityMinutesAgo)} by {ticket.requester?.handler ?? "Support"}
              </p>
            </>
          )}
        </Link>
      ))}
    </Card>
  );
}
