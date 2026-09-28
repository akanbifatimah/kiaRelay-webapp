import { addTicket, findTicket, nextTicketId, updateTicket } from "./tickets";
import { appendTicketMessage, messagesStore, nowTime } from "./ticketMessages";
import { getTicketWorkspace } from "./ticketWorkspace";
import { getAgent } from "./agents";
import type { SupportTicket, TicketCategory, TicketPriority } from "./types";

// Support Department workflow transitions (TC-16, 2026-09-28).
//   A (Customer): New → assigned → In Progress → Resolved → Lead closes
//     (+ customer notified), or → Escalate to Tech.
//   B (Technical): New → Lead Tech assigns w/ priority → In Progress →
//     Resolved → Lead Tech verifies & closes → back to Lead Support, who
//     notifies the customer and closes.
// Who may call what is decided by supportRoles.ts; every step leaves an
// internal note on the ticket's thread as its audit trail.
// TODO: each function maps to a PATCH/POST on /support/tickets once the API exists.

const now = () => new Date().toISOString();

function note(ticketId: string, author: string, body: string, kind: "internal" | "agent" = "internal") {
  const ticket = findTicket(ticketId);
  // Seed the thread from the workspace first, so the note doesn't replace it.
  const base = messagesStore.get()[ticketId] ?? (ticket ? getTicketWorkspace(ticket).messages : []);
  appendTicketMessage(ticketId, { kind, author, time: nowTime(), body }, base);
}

export function assignTicket(ticket: SupportTicket, assigneeId: string, actor: string, priority?: TicketPriority, instructions?: string) {
  const name = getAgent(assigneeId)?.name ?? "agent";
  updateTicket(ticket.id, { assigneeId, ...(priority && { priority }), stage: ticket.stage === "resolved" ? "in-progress" : ticket.stage ?? "new", lastActivityMinutesAgo: 0 });
  note(ticket.id, actor, `Assigned to ${name}${priority ? ` · priority ${priority}` : ""}${instructions ? ` — ${instructions}` : ""}`);
}

export function startWork(ticket: SupportTicket, actor: string) {
  updateTicket(ticket.id, { stage: "in-progress", status: "open", lastActivityMinutesAgo: 0 });
  note(ticket.id, actor, "Started work — ticket is In Progress.");
}

/** Staff mark their work done. Customer tickets then await Lead Support's
 * close; technical ones await Lead Technical's verification. */
export function markResolved(ticket: SupportTicket, actor: string, resolution: string) {
  updateTicket(ticket.id, { stage: "resolved", status: "resolved", sla: "resolved", lastActivityMinutesAgo: 0 });
  note(ticket.id, actor, `Marked resolved${ticket.queue === "technical" ? " for Lead verification" : ""}: ${resolution}`);
}

export function requestEscalation(ticket: SupportTicket, actor: string, reason: string) {
  updateTicket(ticket.id, { escalationRequest: { by: actor, reason, at: now() } });
  note(ticket.id, actor, `Requested escalation to Technical Support: ${reason}`);
}

export function declineEscalation(ticket: SupportTicket, actor: string, reason: string) {
  updateTicket(ticket.id, { escalationRequest: undefined });
  note(ticket.id, actor, `Escalation request declined: ${reason}`);
}

export function escalateToTech(ticket: SupportTicket, actor: string, reason: string) {
  updateTicket(ticket.id, {
    queue: "technical",
    stage: "new",
    status: "awaiting-internal",
    assigneeId: undefined,
    escalationRequest: undefined,
    escalation: { by: actor, reason, at: now(), fromAssigneeId: ticket.assigneeId },
    lastActivityMinutesAgo: 0,
  });
  note(ticket.id, actor, `Escalated to Technical Support: ${reason}`);
}

/** Lead Technical sends a resolution back to the engineer instead of closing it. */
export function reopenTechnical(ticket: SupportTicket, actor: string, reason: string) {
  updateTicket(ticket.id, { stage: "in-progress", status: "awaiting-internal", sla: "healthy" });
  note(ticket.id, actor, `Verification failed, reopened: ${reason}`);
}

/** Lead Technical verifies and closes. Escalated tickets go back to Lead
 * Support to notify the customer; internal issues just close. */
export function verifyAndCloseTechnical(ticket: SupportTicket, actor: string, resolution: string) {
  if (ticket.internal || !ticket.escalation) {
    updateTicket(ticket.id, { stage: "closed", status: "resolved", sla: "resolved", techResolution: { by: actor, note: resolution, at: now() } });
    note(ticket.id, actor, `Verified and closed: ${resolution}`);
    return;
  }
  updateTicket(ticket.id, {
    queue: "customer",
    stage: "resolved",
    status: "resolved",
    sla: "resolved",
    assigneeId: ticket.escalation.fromAssigneeId,
    techResolution: { by: actor, note: resolution, at: now() },
  });
  note(ticket.id, actor, `Technical fix verified: ${resolution}. Returned to Lead Support to notify the customer.`);
}

/** Lead Support closes a resolved customer ticket, optionally notifying the customer. */
export function closeCustomerTicket(ticket: SupportTicket, actor: string, notifyMessage?: string) {
  updateTicket(ticket.id, { stage: "closed", status: "resolved", sla: "resolved", ...(notifyMessage && { customerNotifiedAt: now() }) });
  if (notifyMessage) note(ticket.id, `${actor} (Support)`, notifyMessage, "agent");
  note(ticket.id, actor, notifyMessage ? "Closed; customer notified." : "Closed without notifying the customer.");
}

export interface TechIssueInput {
  subject: string;
  category: TicketCategory;
  priority: TicketPriority;
  description: string;
  assigneeId?: string;
}

/** Lead Technical creates a technical issue by hand (Workflow B, step 1). */
export function createTechIssue(input: TechIssueInput, actor: string): SupportTicket {
  const ticket: SupportTicket = {
    id: nextTicketId(),
    subject: input.subject.trim(),
    customer: "Internal — Technical",
    category: input.category,
    priority: input.priority,
    status: "awaiting-internal",
    sla: "healthy",
    slaMinutesLeft: input.priority === "critical" ? 60 : 480,
    createdMinutesAgo: 0,
    lastActivityMinutesAgo: 0,
    assigneeId: input.assigneeId,
    queue: "technical",
    stage: "new",
    internal: true,
  };
  addTicket(ticket);
  note(ticket.id, actor, `Technical issue created: ${input.description.trim()}`);
  if (input.assigneeId) note(ticket.id, actor, `Assigned to ${getAgent(input.assigneeId)?.name ?? "engineer"} · priority ${input.priority}`);
  return ticket;
}
