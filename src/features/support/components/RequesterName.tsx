import { Link } from "react-router-dom";
import { requesterHref } from "../tickets";
import type { SupportTicket } from "../types";

// Requester names in ticket tables link to that driver's/customer's Support
// View when the ticket is tied to a real record; otherwise plain text. Stops
// propagation so clicking the name doesn't also fire the row's own click.
export function RequesterName({ ticket, className }: { ticket: SupportTicket; className?: string }) {
  const href = requesterHref(ticket);
  if (!href) return <span className={className}>{ticket.customer}</span>;
  return (
    <Link to={href} onClick={(event) => event.stopPropagation()} className={`${className ?? ""} hover:text-primary hover:underline`}>
      {ticket.customer}
    </Link>
  );
}
