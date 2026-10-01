import { eventTime, simMinutesUntil, stageOf, tripProgress } from "./deliverySim";
import type { DeliveryOrder } from "./deliveryTypes";
import type { CustomerTicket, TicketCategory } from "./supportTicketTypes";

// Support ticket logic for customers (2026-10-01), same as the customer app's
// src/lib/supportTickets.ts. No AI assistant: every ticket is handled by
// KiaRelay support staff in the admin Support module, and the customer sees
// its admin status in plain words.

export const TICKET_TOPICS: { label: string; category: TicketCategory }[] = [
  { label: "Delivery / tracking", category: "delivery" },
  { label: "Billing", category: "billing" },
  { label: "Account", category: "account" },
  { label: "App or technical issue", category: "technical" },
  { label: "Other", category: "support" },
];

export const topicLabel = (category: TicketCategory) => TICKET_TOPICS.find((t) => t.category === category)?.label ?? (category === "claims" ? "Claim" : "Other");

export type CustomerTicketState = "waiting" | "in-progress" | "technical" | "reply-needed" | "resolved" | "closed";

export const TICKET_STATE_LABELS: Record<CustomerTicketState, string> = {
  waiting: "Waiting for an agent",
  "in-progress": "In progress",
  technical: "With our technical team",
  "reply-needed": "Reply needed",
  resolved: "Resolved",
  closed: "Closed",
};

/** The ticket as of `now`: the app mock's scheduled staff actions applied
 * and future staff messages hidden. Web tickets have no schedule. */
export function ticketAt(ticket: CustomerTicket, now = Date.now()): CustomerTicket {
  const due = (ticket.changes ?? []).filter((c) => Date.parse(c.at) <= now).sort((a, b) => Date.parse(a.at) - Date.parse(b.at));
  const applied = due.reduce<CustomerTicket>((t, c) => ({ ...t, ...(c.status && { status: c.status }), ...(c.stage && { stage: c.stage }), ...(c.queue && { queue: c.queue }), ...(c.assigneeName && { assigneeName: c.assigneeName }) }), ticket);
  return { ...applied, messages: ticket.messages.filter((m) => Date.parse(m.at) <= now) };
}

/** Admin status / stage / queue → what the customer sees. */
export function customerState(ticket: Pick<CustomerTicket, "status" | "stage" | "queue" | "assigneeName">): CustomerTicketState {
  if (ticket.stage === "closed") return "closed";
  if (ticket.status === "resolved") return "resolved";
  if (ticket.status === "awaiting-customer") return "reply-needed";
  if (ticket.queue === "technical") return "technical";
  if (!ticket.assigneeName) return "waiting";
  return "in-progress";
}

export function stateDetail(ticket: CustomerTicket): string {
  const state = customerState(ticket);
  if (state === "in-progress") return `With ${ticket.assigneeName} · KiaRelay Support`;
  if (state === "reply-needed") return `${ticket.assigneeName ?? "Support"} is waiting for your reply`;
  if (state === "resolved") return "Reopen it if anything isn't sorted";
  if (state === "closed") return "Closed by KiaRelay Support — start a new ticket if you need more help";
  if (state === "technical") return "Our technical team is investigating";
  return "A support agent will pick this up shortly";
}

export const isActiveTicket = (ticket: CustomerTicket) => !["resolved", "closed"].includes(customerState(ticket));
export const canReply = (ticket: CustomerTicket) => customerState(ticket) !== "closed";
/** Resolved (not yet closed by Lead Support) tickets can be reopened. */
export const canReopen = (ticket: CustomerTicket) => customerState(ticket) === "resolved";

/** Status line for a delivery shown in a ticket conversation. */
export function orderStatusLine(order: DeliveryOrder, now = Date.now()): { label: string; detail: string; progress: number } {
  const stage = stageOf(order, now);
  const progress = tripProgress(order, now);
  if (stage === "delivered") return { label: "Delivered", detail: `Delivered to ${order.dropoff.address.name || order.dropoff.address.city}.`, progress: 1 };
  if (stage === "cancelled") return { label: "Cancelled", detail: "Cancelled before pickup.", progress: 0 };
  if (stage === "in-transit") return { label: "In Transit", detail: `On the way to ${order.dropoff.address.city}, about ${simMinutesUntil(eventTime(order, "delivered"), now)} minutes out.`, progress };
  if (stage === "at-pickup" || stage === "accepted") return { label: "Driver Assigned", detail: `${order.driver?.firstName ?? "The driver"} is ${stage === "at-pickup" ? "at" : "heading to"} the pickup.`, progress };
  return { label: "Matching", detail: "Matching a driver to the load.", progress: 0 };
}
