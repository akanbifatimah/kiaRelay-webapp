import { createStore, useStore } from "../../lib/createStore";
import { seedTickets } from "./ticketSeeds";
import { CURRENT_AGENT_ID } from "./agents";
import { nowTime, setTicketMessages } from "./ticketMessages";
import type { SupportTicket, TicketCategory, TicketPriority, TicketRequester } from "./types";

// Session-wide ticket list (see lib/createStore.ts) shared by Unassigned,
// My Tickets, the workspace, and the Driver/Customer Support Views.
export const ticketsStore = createStore<SupportTicket[]>(seedTickets);

export const useTickets = () => useStore(ticketsStore);

export function updateTicket(id: string, changes: Partial<SupportTicket>): void {
  ticketsStore.set((prev) => prev.map((ticket) => (ticket.id === id ? { ...ticket, ...changes } : ticket)));
}

export function addTicket(ticket: SupportTicket): void {
  ticketsStore.set((prev) => [ticket, ...prev]);
}

export function nextTicketId(): string {
  const highest = ticketsStore.get().reduce((max, ticket) => {
    const match = ticket.id.match(/^TKT-(\d+)$/);
    return match ? Math.max(max, Number(match[1])) : max;
  }, 9000);
  return `TKT-${highest + 1}`;
}

export interface NewTicketInput {
  subject: string;
  customer: string;
  category: TicketCategory;
  priority: TicketPriority;
  /** Becomes the ticket's first message, attributed to the customer. */
  description?: string;
}

/** Shared by My Tickets' and the Customer Support View's "New/Create
 * Ticket" — new tickets are always assigned to the agent who logged them.
 * TODO: POST /support/tickets once the API exists. */
export function createTicket(values: NewTicketInput, requester?: TicketRequester): SupportTicket {
  const ticket: SupportTicket = {
    id: nextTicketId(),
    subject: values.subject.trim(),
    customer: values.customer.trim(),
    category: values.category,
    priority: values.priority,
    status: "open",
    sla: "healthy",
    slaMinutesLeft: values.priority === "critical" ? 60 : 480,
    createdMinutesAgo: 0,
    lastActivityMinutesAgo: 0,
    assigneeId: CURRENT_AGENT_ID,
    requester,
  };
  addTicket(ticket);
  const description = values.description?.trim();
  if (description) {
    setTicketMessages(ticket.id, [{ id: "m1", kind: "customer", author: `${ticket.customer} (Customer)`, time: nowTime(), body: description }]);
  }
  return ticket;
}

export function findTicket(id: string | undefined): SupportTicket | undefined {
  return ticketsStore.get().find((ticket) => ticket.id === id);
}

export function findTicketByClaim(claimId: string | undefined): SupportTicket | undefined {
  return ticketsStore.get().find((ticket) => ticket.claimId === claimId);
}

/** Claims tickets open the investigation screen; every other ticket opens the
 * conversation workspace (confirmed with the user, 2026-09-23). */
export function ticketDetailHref(ticket: SupportTicket): string {
  return ticket.claimId ? `/support/claims/${ticket.claimId}` : `/support/tickets/${ticket.id}`;
}

/** Where a ticket's requester name links — the matching Support View. */
export function requesterHref(ticket: SupportTicket): string | undefined {
  if (!ticket.requester) return undefined;
  return ticket.requester.kind === "driver" ? `/support/drivers/${ticket.requester.id}` : `/support/customers/${ticket.requester.id}`;
}
