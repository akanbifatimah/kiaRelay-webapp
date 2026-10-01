import type { ClaimInvestigation } from "../../support/claimInvestigation";
import { appendTicketMessage, nowTime, type TicketMessage } from "../../support/ticketMessages";
import { updateTicket } from "../../support/tickets";
import type { SupportTicket } from "../../support/types";
import { attachIncident } from "./deliveryActions";
import { formatWhen } from "./display";
import { EVENT_LABELS, nextIncidentId } from "./incidents";
import { getIncidents, upsertIncident } from "./incidentsStore";
import type { DeliveryPhoto } from "./deliveryTypes";
import type { IncidentReport, IncidentStatus } from "./incidentTypes";
import { openAdminRecords } from "./incidentAdmin";

// Portal incident reports (2026-10-01). Status, "What we need" and the
// timeline are read from the admin ticket (and claim) the report opened, so
// what an agent does in Support is what the customer sees.

export type IncidentInput = Pick<IncidentReport, "orderId" | "category" | "categoryOther" | "description" | "urgency" | "photos" | "claimAmount">;

export function fileIncident(customerId: string, companyName: string, input: IncidentInput): IncidentReport {
  const now = new Date().toISOString();
  const draft: IncidentReport = { ...input, id: nextIncidentId(getIncidents()), customerId, createdAt: now, events: [{ kind: "reported", at: now, note: "" }, { kind: "received", at: now, note: "" }], responses: [] };
  const incident = { ...draft, ...openAdminRecords(draft, companyName) };
  upsertIncident(incident);
  if (incident.orderId) attachIncident(incident.orderId, incident.id);
  return incident;
}

/** "Add Information": a customer reply on the ticket, which goes back to the agent. */
export function addIncidentInfo(incident: IncidentReport, text: string, photos: DeliveryPhoto[], author: string): void {
  const now = new Date().toISOString();
  if (incident.ticketId) {
    const body = [text.trim(), photos.length ? `(${photos.length} photo${photos.length === 1 ? "" : "s"} attached: ${photos.map((p) => p.name).join(", ")})` : ""].filter(Boolean).join(" ");
    appendTicketMessage(incident.ticketId, { kind: "customer", author: `${author} (Customer)`, time: nowTime(), body });
    updateTicket(incident.ticketId, { status: "awaiting-internal", lastActivityMinutesAgo: 0 });
  }
  upsertIncident({ ...incident, responses: [...incident.responses, { text: text.trim(), photos, at: now }], events: [...incident.events, { kind: "info-added", at: now, note: "" }] });
}

export interface TimelineEntry {
  label: string;
  time: string;
  note?: string;
  alert?: boolean;
}

export interface IncidentView {
  status: IncidentStatus;
  /** "What we need" while action is required. */
  request?: string;
  /** Newest first. */
  timeline: TimelineEntry[];
}

export function incidentView(incident: IncidentReport, ticket: SupportTicket | undefined, thread: TicketMessage[], claim: ClaimInvestigation | undefined): IncidentView {
  const agentMessages = thread.filter((m) => m.kind === "agent");
  const resolved = ticket?.status === "resolved" || claim?.status === "resolved";
  const status: IncidentStatus = resolved
    ? "resolved"
    : ticket?.status === "awaiting-customer"
      ? "action-required"
      : ticket?.status === "awaiting-internal" || ticket?.assigneeId || claim?.status === "in-review" || claim?.status === "escalated"
        ? "under-review"
        : "submitted";
  const timeline: TimelineEntry[] = [
    { label: EVENT_LABELS.reported, time: formatWhen(incident.createdAt) },
    { label: EVENT_LABELS.received, time: formatWhen(incident.createdAt) },
    ...thread.slice(1).map((m) => (m.kind === "agent" ? { label: "Update from Operations", time: m.time, note: m.body } : { label: EVENT_LABELS["info-added"], time: m.time })),
  ];
  if (status === "under-review" && !agentMessages.length) timeline.push({ label: EVENT_LABELS["under-review"], time: "Now" });
  if (status === "action-required") timeline.push({ label: EVENT_LABELS["action-required"], time: agentMessages[agentMessages.length - 1]?.time ?? "", alert: true });
  if (resolved) timeline.push({ label: EVENT_LABELS.resolved, time: claim?.status === "resolved" ? "Claim resolved" : "Ticket resolved" });
  return { status, request: status === "action-required" ? agentMessages[agentMessages.length - 1]?.body : undefined, timeline: timeline.reverse() };
}
