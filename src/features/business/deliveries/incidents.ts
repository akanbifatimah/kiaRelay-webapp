import type { IncidentEvent, IncidentEventKind, IncidentReport, IncidentStatus } from "./incidentTypes";

// Incident report logic (2026-10-01), same as the customer app's
// src/lib/incidents.ts. Status is the latest event that has happened.

export const INCIDENT_CATEGORIES = ["Package Damage", "Missing Items", "Late Delivery", "Wrong Address Details", "Driver Conduct", "Billing Issue", "Other"];

/** Categories that open a claim (they carry a claimed amount). */
export const CLAIM_CATEGORIES = ["Package Damage", "Missing Items"];
export const isClaimCategory = (category: string) => CLAIM_CATEGORIES.includes(category);

export const INCIDENT_STATUS_LABELS: Record<IncidentStatus, string> = {
  submitted: "Submitted",
  "under-review": "Under Review",
  "action-required": "Action Required",
  resolved: "Resolved",
};

export const EVENT_LABELS: Record<IncidentEventKind, string> = {
  reported: "Incident reported",
  received: "Incident received",
  "under-review": "Under review by Operations",
  "action-required": "Action required from you",
  "info-added": "You added information",
  resolved: "Resolved",
};

const STATUS: Record<IncidentEventKind, IncidentStatus> = {
  reported: "submitted",
  received: "submitted",
  "under-review": "under-review",
  "action-required": "action-required",
  "info-added": "under-review",
  resolved: "resolved",
};

export const incidentTitle = (i: Pick<IncidentReport, "category" | "categoryOther">) => (i.category === "Other" && i.categoryOther ? i.categoryOther : i.category);

export function pastIncidentEvents(incident: Pick<IncidentReport, "events">, now = Date.now()): IncidentEvent[] {
  return incident.events.filter((e) => Date.parse(e.at) <= now).sort((a, b) => Date.parse(a.at) - Date.parse(b.at));
}

export function incidentStatus(incident: Pick<IncidentReport, "events">, now = Date.now()): IncidentStatus {
  const past = pastIncidentEvents(incident, now);
  return STATUS[past[past.length - 1]?.kind ?? "reported"];
}

/** "What we need": the open request, while action is required. */
export function openRequest(incident: Pick<IncidentReport, "events">, now = Date.now()): string | undefined {
  if (incidentStatus(incident, now) !== "action-required") return undefined;
  return [...pastIncidentEvents(incident, now)].reverse().find((e) => e.kind === "action-required")?.note;
}

export function nextIncidentId(existing: { id: string }[]): string {
  return `IR-${Math.max(10482, ...existing.map((i) => Number(i.id.replace(/\D/g, "")) || 0)) + 1}`;
}

const SEC = 1000;
const at = (ms: number) => new Date(ms).toISOString();

const REQUESTS: Record<string, string> = {
  "Package Damage": "KiaRelay Operations needs an additional photo showing the condition of the inner packaging to process the damage claim.",
  "Missing Items": "Please add a photo of your packing list or bill of lading so we can trace the missing items.",
};

/** Mock Operations handling for the app (no backend to answer):
 * received → under review → a request (claims) or a resolution.
 * TODO: statuses come from the Support API once it exists. */
export function mockHandling(now: number, category: string): IncidentEvent[] {
  const events: IncidentEvent[] = [
    { kind: "received", at: at(now + 2 * SEC), note: "" },
    { kind: "under-review", at: at(now + 45 * SEC), note: "" },
  ];
  if (REQUESTS[category]) return [...events, { kind: "action-required", at: at(now + 120 * SEC), note: REQUESTS[category] }];
  return [...events, { kind: "resolved", at: at(now + 180 * SEC), note: "Operations reviewed your report and followed up with the driver and dispatch." }];
}

/** After "Add Information": back under review, then resolved (mock). */
export function mockFollowUp(now: number, business: boolean): IncidentEvent[] {
  return [
    { kind: "info-added", at: at(now), note: "" },
    { kind: "under-review", at: at(now + 5 * SEC), note: "" },
    { kind: "resolved", at: at(now + 120 * SEC), note: business ? "Claim approved — a credit will appear on your next invoice." : "Claim approved — a refund is on its way to your card." },
  ];
}
