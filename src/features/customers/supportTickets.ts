import type { CustomerDetail } from "./customerDetails";

export type TicketStatus = "open" | "in-progress" | "resolved" | "closed";
export type TicketPriority = "low" | "medium" | "high" | "urgent";

export interface SupportTicket {
  id: string;
  subject: string;
  status: TicketStatus;
  priority: TicketPriority;
  created: string;
  lastUpdate: string;
  agent: string;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  actor: string;
  timestamp: string;
  details: string;
}

const subjects = [
  "Delayed delivery inquiry",
  "Billing discrepancy on invoice",
  "Unable to update payment method",
  "Driver behavior complaint",
  "Refund status follow-up",
];
const statuses: TicketStatus[] = ["open", "in-progress", "resolved", "closed"];
const priorities: TicketPriority[] = ["low", "medium", "high", "urgent"];
const agents = ["Devon Price", "Alicia Moore", "Ryan Osei", "Unassigned"];

// TODO: replace with GET /customers/:id/tickets once the Support module
// API exists. Seeded deterministically from the customer id so a given
// profile always shows the same mock tickets across renders.
export function buildSupportTickets(detail: CustomerDetail, count = 6): SupportTicket[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `TCK-${detail.id.slice(-4)}${100 + i}`,
    subject: subjects[i % subjects.length],
    status: statuses[i % statuses.length],
    priority: priorities[(i + 1) % priorities.length],
    created: `${(i % 28) + 1} days ago`,
    lastUpdate: `${(i % 5) + 1} hours ago`,
    agent: agents[i % agents.length],
  }));
}

const actions = [
  "Suspended account",
  "Updated credit terms",
  "Reset password",
  "Approved ID verification",
  "Added payment method",
];
const actors = ["Admin: Fatimah A.", "Admin: Devon Price", "System"];

// TODO: replace with GET /customers/:id/audit-log once the Security &
// Audit module API exists (PRD §9 — audit log of state-changing admin
// actions).
export function buildAuditLog(detail: CustomerDetail, count = 6): AuditLogEntry[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `AUD-${detail.id.slice(-4)}${200 + i}`,
    action: actions[i % actions.length],
    actor: actors[i % actors.length],
    timestamp: `${(i % 28) + 1} days ago`,
    details: `Applied to ${detail.name}'s account.`,
  }));
}
