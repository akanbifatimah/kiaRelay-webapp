// Customer support tickets (2026-10-01). A customer's view of the admin
// Support module's ticket (kiaRelay-webapp features/support: SupportTicket,
// TicketMessage) — same status / stage / queue values, internal notes never
// included. Mirrored in kiarelay-customer-mobile/src/types/supportTicket.ts.
import type { DeliveryPhoto } from "./deliveryTypes";

export type TicketStatus = "open" | "awaiting-customer" | "awaiting-internal" | "resolved";
export type TicketStage = "new" | "in-progress" | "resolved" | "closed";
export type TicketQueue = "customer" | "technical";
export type TicketPriority = "critical" | "high" | "medium" | "low";
export type TicketCategory = "compliance" | "technical" | "billing" | "finance" | "support" | "marketing" | "account" | "delivery" | "claims" | "infrastructure" | "access" | "routing" | "maintenance";

export interface CustomerTicketMessage {
  id: string;
  from: "customer" | "agent";
  /** "Dana R." for staff; the customer's name for their own messages. */
  author: string;
  body: string;
  at: string;
  /** Web: admin threads keep a display time ("4:15 PM") rather than a timestamp. */
  timeLabel?: string;
  photos?: DeliveryPhoto[];
}

/** App mock only: a staff action scheduled for later (the app can't reach
 * admin). TODO: remove once tickets come from the Support API. */
export interface TicketChange {
  at: string;
  status?: TicketStatus;
  stage?: TicketStage;
  queue?: TicketQueue;
  assigneeName?: string;
}

export interface CustomerTicket {
  /** "TKT-9214", the admin ticket id. */
  id: string;
  customerId: string;
  subject: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  stage: TicketStage;
  queue: TicketQueue;
  /** The staff member handling it, once assigned. */
  assigneeName?: string;
  createdAt: string;
  /** Related delivery ("#ORD-2800"), if any. */
  orderId?: string;
  /** Set when the ticket was opened by an incident report. */
  incidentId?: string;
  messages: CustomerTicketMessage[];
  changes?: TicketChange[];
}
