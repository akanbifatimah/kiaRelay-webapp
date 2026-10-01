// Incident report shapes (2026-10-01), adapted for customers from the
// Incident Reports designs. Mirrored field-for-field in
// kiarelay-customer-mobile/src/types/incident.ts.
import type { DeliveryPhoto } from "./deliveryTypes";

export type IncidentStatus = "submitted" | "under-review" | "action-required" | "resolved";
export type IncidentUrgency = "normal" | "urgent";
export type IncidentEventKind = "reported" | "received" | "under-review" | "action-required" | "info-added" | "resolved";

/** Timeline entry. Future-dated events are the app mock's schedule. */
export interface IncidentEvent {
  kind: IncidentEventKind;
  at: string;
  /** For "action-required": what Operations needs ("What we need"). */
  note: string;
}

/** The customer's "Add Information" answer. */
export interface IncidentResponse {
  text: string;
  photos: DeliveryPhoto[];
  at: string;
}

export interface IncidentReport {
  /** "IR-10482". */
  id: string;
  customerId: string;
  /** "#ORD-2800", or "" when it isn't about one delivery. */
  orderId: string;
  category: string;
  /** Filled only when category is "Other". */
  categoryOther: string;
  description: string;
  urgency: IncidentUrgency;
  photos: DeliveryPhoto[];
  /** Value claimed for damage / missing items; 0 otherwise. */
  claimAmount: number;
  createdAt: string;
  events: IncidentEvent[];
  responses: IncidentResponse[];
  /** Web: the admin support ticket (and claim) it opened. */
  ticketId?: string;
  claimId?: string;
}
