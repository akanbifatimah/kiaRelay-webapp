import type { SupportTicket } from "./types";

const hoursAgoIso = (hours: number) => new Date(Date.now() - hours * 3_600_000).toISOString();

type Base = Pick<SupportTicket, "id" | "subject" | "customer" | "category" | "priority">;

function ticket(base: Base, rest: Partial<SupportTicket>): SupportTicket {
  return {
    ...base,
    status: "open",
    sla: "healthy",
    slaMinutesLeft: 240,
    createdMinutesAgo: 180,
    lastActivityMinutesAgo: 30,
    ...rest,
  };
}

// Support Department workflow seeds (TC-16, 2026-09-28), so every step of
// Workflows A and B has something on screen for the four new dev logins:
// staff work, an escalation request, each Technical stage, and one ticket
// sent back to Lead Support to notify the customer.
// TODO: replace with GET /support/tickets?queue=… once the API exists.
export const workflowSeeds: SupportTicket[] = [
  // Workflow A — Customer Support
  ticket({ id: "TKT-9101", subject: "Delivery marked complete but not received", customer: "Harbor Retail Group", category: "delivery", priority: "high" }, { assigneeId: "usr-support-staff", stage: "in-progress", sla: "at-risk", slaMinutesLeft: 40 }),
  ticket({ id: "TKT-9102", subject: "Change pickup window for recurring order", customer: "Summit Freight", category: "account", priority: "low" }, { assigneeId: "usr-support-staff", stage: "new", createdMinutesAgo: 20 }),
  ticket(
    { id: "TKT-9103", subject: "Tracking page shows blank map", customer: "Sarah Jenkins", category: "technical", priority: "medium" },
    { assigneeId: "usr-support-staff", stage: "in-progress", escalationRequest: { by: "Daniel Reyes", reason: "Reproduced on two browsers; looks like a map API error, not an account issue.", at: hoursAgoIso(1) } },
  ),
  ticket({ id: "TKT-9104", subject: "Refund confirmation email never arrived", customer: "Jennifer Walsh", category: "billing", priority: "medium" }, { assigneeId: "usr-support-staff-2", stage: "resolved", status: "resolved", sla: "resolved" }),
  ticket(
    { id: "TKT-9105", subject: "Invoice PDF download returns an error", customer: "Acme Refinery LLC", category: "technical", priority: "high" },
    {
      stage: "resolved",
      status: "resolved",
      sla: "resolved",
      assigneeId: "usr-support-staff",
      techResolution: { by: "Victor Hale", note: "PDF service timed out on invoices over 50 lines; timeout raised and export re-queued.", at: hoursAgoIso(2) },
      escalation: { by: "Grace Okoro", reason: "Customer blocked from paying; reproducible.", at: hoursAgoIso(20), fromAssigneeId: "usr-support-staff" },
      requester: { kind: "customer", id: "KR-77410-JW" },
    },
  ),
  // Workflow B — Technical Support
  ticket(
    { id: "TKT-9201", subject: "Driver app crashes when uploading POD photo", customer: "Internal — Driver Ops", category: "technical", priority: "critical" },
    { queue: "technical", stage: "new", sla: "at-risk", slaMinutesLeft: 25, escalation: { by: "Grace Okoro", reason: "Three drivers reported it this morning; blocks proof of delivery.", at: hoursAgoIso(1) } },
  ),
  ticket({ id: "TKT-9202", subject: "Webhook retries flooding partner endpoint", customer: "Internal — Platform", category: "infrastructure", priority: "high" }, { queue: "technical", stage: "in-progress", assigneeId: "usr-tech-staff", internal: true }),
  ticket({ id: "TKT-9203", subject: "Password reset link expires too early", customer: "Internal — Platform", category: "access", priority: "medium" }, { queue: "technical", stage: "resolved", assigneeId: "usr-tech-staff-2", internal: true, status: "resolved", sla: "resolved" }),
  ticket(
    { id: "TKT-9204", subject: "ETA not updating on customer tracking link", customer: "Cyberdyne Systems", category: "technical", priority: "high" },
    { queue: "technical", stage: "resolved", assigneeId: "usr-tech-staff", status: "resolved", sla: "resolved", escalation: { by: "Grace Okoro", reason: "Customer-facing ETA frozen for 2 hours.", at: hoursAgoIso(6) } },
  ),
];
