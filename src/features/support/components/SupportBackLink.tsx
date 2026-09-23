import { Link, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface BackState {
  from?: string;
  fromLabel?: string;
}

// Ticket/claim detail pages are reachable from both Unassigned and My
// Tickets, so the back link follows the list the user actually came from
// (passed as router state by each table's navigate call), falling back to
// My Tickets for a direct link or refresh.
export function SupportBackLink() {
  const state = (useLocation().state ?? {}) as BackState;
  return (
    <Link to={state.from ?? "/support/my-tickets"} className="flex w-fit items-center gap-1.5 text-sm text-text-muted hover:text-text">
      <ArrowLeft className="h-3.5 w-3.5" />
      Back to {state.fromLabel ?? "My Tickets"}
    </Link>
  );
}
