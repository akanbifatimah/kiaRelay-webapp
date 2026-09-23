import type { SlaStatus, SupportTicket, TicketPriority } from "./types";

export type TicketSortKey = "id" | "subject" | "customer" | "category" | "priority" | "created" | "sla" | "lastActivity";
export type SortDirection = "asc" | "desc";

const priorityRank: Record<TicketPriority, number> = { critical: 0, high: 1, medium: 2, low: 3 };
const slaRank: Record<SlaStatus, number> = { breached: 0, "at-risk": 1, pending: 2, open: 3, healthy: 4, resolved: 5 };

// "created"/"lastActivity" sort by age, so ascending = newest first — the
// same order a human reads "5 mins ago, 10 mins ago, 1 hr ago".
function compare(a: SupportTicket, b: SupportTicket, key: TicketSortKey): number {
  switch (key) {
    case "priority":
      return priorityRank[a.priority] - priorityRank[b.priority];
    case "sla":
      return slaRank[a.sla] - slaRank[b.sla] || a.slaMinutesLeft - b.slaMinutesLeft;
    case "created":
      return a.createdMinutesAgo - b.createdMinutesAgo;
    case "lastActivity":
      return a.lastActivityMinutesAgo - b.lastActivityMinutesAgo;
    default:
      return a[key].localeCompare(b[key]);
  }
}

export function sortTickets(tickets: SupportTicket[], key: TicketSortKey, direction: SortDirection): SupportTicket[] {
  const sign = direction === "asc" ? 1 : -1;
  return [...tickets].sort((a, b) => compare(a, b, key) * sign);
}
