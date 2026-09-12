import type { CustomerDetail } from "./customerDetails";

export type TicketStatus = "open" | "in-progress" | "resolved" | "closed";
export type TicketPriority = "low" | "medium" | "high" | "critical";

export interface SupportTicket {
  id: string;
  subject: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdDate: string;
  createdTime: string;
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
const priorities: TicketPriority[] = ["low", "medium", "high", "critical"];
const agents = ["Sarah Chen", "Alex Thompson", "Ryan Osei", "Unassigned"];

function daysAgoDate(n: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - n);
  return date;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
}

// TODO: replace with GET /customers/:id/tickets once the Support module
// API exists. Seeded deterministically from the customer id so a given
// profile always shows the same mock tickets across renders; dates are
// relative to today rather than a fixed year (same fix already applied to
// customerOrderHistory.ts), and recent tickets show a relative "Last
// Update" while older ones show the date, matching the Figma reference.
export function buildSupportTickets(detail: CustomerDetail, count = 6): SupportTicket[] {
  return Array.from({ length: count }, (_, i) => {
    const daysAgo = i * 4 + 1;
    const created = daysAgoDate(daysAgo);
    return {
      id: `#TK-${44000 + Number(detail.id.replace(/\D/g, "").slice(-2) || "0") + i * 37}`,
      subject: subjects[i % subjects.length],
      status: statuses[i % statuses.length],
      priority: priorities[(i + 1) % priorities.length],
      createdDate: formatDate(created),
      createdTime: formatTime(created),
      lastUpdate: daysAgo <= 1 ? `${(i % 5) + 1} mins ago` : formatDate(daysAgoDate(daysAgo - 1)),
      agent: agents[i % agents.length],
    };
  });
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
    timestamp: formatDate(daysAgoDate(i * 6 + 2)),
    details: `Applied to ${detail.name}'s account.`,
  }));
}
