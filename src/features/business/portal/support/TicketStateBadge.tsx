import { cn } from "../../../../lib/cn";
import { TICKET_STATE_LABELS, type CustomerTicketState } from "../../deliveries/supportTickets";

const TONES: Record<CustomerTicketState, string> = {
  waiting: "bg-bg text-sidebar",
  "in-progress": "bg-info/10 text-info",
  technical: "bg-info/10 text-info",
  "reply-needed": "bg-danger/10 text-danger",
  resolved: "bg-success/10 text-success",
  closed: "bg-bg text-text-muted",
};

export function TicketStateBadge({ state }: { state: CustomerTicketState }) {
  return <span className={cn("whitespace-nowrap rounded-md px-2 py-0.5 text-xs font-semibold", TONES[state])}>{TICKET_STATE_LABELS[state]}</span>;
}
