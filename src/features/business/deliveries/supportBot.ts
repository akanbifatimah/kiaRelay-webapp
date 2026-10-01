import { eventTime, isFinished, simMinutesUntil, stageOf, tripProgress } from "./deliverySim";
import type { DeliveryOrder } from "./deliveryTypes";

// KiaRelay virtual assistant for Support Chat (2026-10-01 design), same as
// the customer app's src/lib/supportBot.ts. Keyword intents over the
// customer's own orders; anything else offers a human agent.
// TODO: replace with the Support API's assistant / live chat.

export type SupportAction = "track" | "claim" | "billing";
export type ChatSender = "bot" | "agent" | "customer" | "system";

export interface SupportMessage {
  id: string;
  from: ChatSender;
  text: string;
  at: string;
  /** Order id rendered as a status card ("Relay #RLY-8832"). */
  orderCard?: string;
  actions?: SupportAction[];
}

export const QUICK_REPLIES: { action: SupportAction; label: string }[] = [
  { action: "track", label: "Track my order" },
  { action: "claim", label: "Submit a claim" },
  { action: "billing", label: "Billing question" },
];

export const GREETING = "Hi there! 👋 I'm the KiaRelay virtual assistant. How can I help keep your logistics moving today?";

let seq = 0;
export const chatMessage = (from: ChatSender, text: string, extra: Partial<SupportMessage> = {}): SupportMessage => ({ id: `s-${Date.now()}-${(seq += 1)}`, from, text, at: new Date().toISOString(), ...extra });

/** Short status for an order card. */
export function orderStatusLine(order: DeliveryOrder, now = Date.now()): { label: string; detail: string; progress: number } {
  const stage = stageOf(order, now);
  const progress = tripProgress(order, now);
  if (stage === "delivered") return { label: "Delivered", detail: `Delivered to ${order.dropoff.address.name || order.dropoff.address.city}.`, progress: 1 };
  if (stage === "cancelled") return { label: "Cancelled", detail: "This delivery was cancelled before pickup.", progress: 0 };
  if (stage === "in-transit") return { label: "In Transit", detail: `On the way to ${order.dropoff.address.city}. Expected in about ${simMinutesUntil(eventTime(order, "delivered"), now)} minutes.`, progress };
  if (stage === "at-pickup" || stage === "accepted") return { label: "Driver Assigned", detail: `${order.driver?.firstName ?? "Your driver"} is ${stage === "at-pickup" ? "at" : "heading to"} the pickup in ${order.pickup.address.city}.`, progress };
  return { label: "Matching", detail: "We're matching a driver to your load right now.", progress: 0 };
}

function findOrder(text: string, orders: DeliveryOrder[]): DeliveryOrder | undefined {
  const digits = text.match(/\d{4,}/g) ?? [];
  return orders.find((o) => digits.some((d) => o.id.replace(/\D/g, "") === d));
}

/** The assistant's answer to a customer message or quick reply. */
export function botReply(input: string | SupportAction, orders: DeliveryOrder[], business: boolean, now = Date.now()): SupportMessage[] {
  const text = input.toLowerCase();
  const order = findOrder(input, orders);
  if (order) return [chatMessage("bot", `Let me look up ${order.id} for you. Give me just a moment.`), chatMessage("bot", "", { orderCard: order.id })];
  if (input === "track" || /track|where|status|eta|late|delay/.test(text)) {
    const live = orders.find((o) => !isFinished(stageOf(o, now)));
    if (live) return [chatMessage("bot", `Here's your latest active delivery, ${live.id}. Send me another order number to check a different one.`), chatMessage("bot", "", { orderCard: live.id })];
    return [chatMessage("bot", "You don't have anything on the road right now. Send me an order number (like ORD-2800) and I'll check it.")];
  }
  if (input === "claim" || /claim|damage|broken|missing|incident|lost/.test(text)) {
    return [chatMessage("bot", "Sorry to hear that. Report it as an incident with photos — our Operations team reviews every report and keeps you updated.", { actions: ["claim"] })];
  }
  if (input === "billing" || /bill|invoice|charge|payment|refund|receipt/.test(text)) {
    return [chatMessage("bot", business ? "Your invoices, balance and Pay Now are under Invoices & Statements." : "Every delivery has a receipt in its order details, and refunds go back to the card you paid with.", { actions: ["billing"] })];
  }
  return [chatMessage("bot", "I can help with tracking, claims and billing. For anything else, tap Escalate to Human Agent and a teammate will join.")];
}
