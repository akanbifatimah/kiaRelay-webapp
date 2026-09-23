import type { SlaStatus, SupportTicket, TicketCategory, TicketPriority } from "./types";

export interface TicketFilters {
  priority: TicketPriority | "all";
  category: TicketCategory | "all";
  sla: SlaStatus | "all";
}

export const EMPTY_TICKET_FILTERS: TicketFilters = { priority: "all", category: "all", sla: "all" };

export function filterTickets(tickets: SupportTicket[], filters: TicketFilters): SupportTicket[] {
  return tickets.filter(
    (ticket) =>
      (filters.priority === "all" || ticket.priority === filters.priority) &&
      (filters.category === "all" || ticket.category === filters.category) &&
      (filters.sla === "all" || ticket.sla === filters.sla),
  );
}

export function countActiveFilters(filters: TicketFilters): number {
  return Object.values(filters).filter((value) => value !== "all").length;
}
