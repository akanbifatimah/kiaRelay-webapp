import { useMemo } from "react";
import { createStore, useStore } from "../../../../lib/createStore";
import { getAgent } from "../../../support/agents";
import { appendTicketMessage, messagesStore, nowTime, type TicketMessage } from "../../../support/ticketMessages";
import { createTicket, findTicket, updateTicket, useTickets } from "../../../support/tickets";
import type { SupportTicket } from "../../../support/types";
import { useAllIncidents } from "../../deliveries/incidentsStore";
import type { DeliveryPhoto } from "../../deliveries/deliveryTypes";
import type { CustomerTicket, TicketCategory } from "../../deliveries/supportTicketTypes";
import type { BusinessAccount } from "../../businessAccounts";

// The portal's Support tickets (2026-10-01): real admin Support tickets,
// worked by KiaRelay staff in the ticket workspace and workflow. The customer
// sees them through toCustomerTicket(): no internal notes, plain statuses.
// TODO: GET/POST /support/tickets for the requester once the API exists.

/** Delivery a ticket is about (admin tickets have no order field yet). */
const orderMeta = createStore<Record<string, string>>({});

const shortName = (name: string) => {
  const [first, last] = name.replace(/\s*\((Support|Customer)\)$/, "").split(" ");
  return last ? `${first} ${last[0]}.` : first;
};

export function toCustomerTicket(ticket: SupportTicket, thread: TicketMessage[], orderId?: string, incidentId?: string): CustomerTicket {
  const created = new Date(Date.now() - ticket.createdMinutesAgo * 60_000).toISOString();
  return {
    id: ticket.id,
    customerId: ticket.requester?.id ?? "",
    subject: ticket.subject,
    category: ticket.category,
    priority: ticket.priority,
    status: ticket.status,
    stage: ticket.stage ?? "new",
    queue: ticket.queue ?? "customer",
    assigneeName: ticket.assigneeId ? shortName(getAgent(ticket.assigneeId)?.name ?? "KiaRelay Support") : undefined,
    createdAt: created,
    orderId,
    incidentId,
    messages: thread
      .filter((m) => m.kind !== "internal")
      .map((m) => ({ id: m.id, from: m.kind === "customer" ? "customer" : "agent", author: shortName(m.author), body: m.body, at: created, timeLabel: m.time })),
  };
}

/** The account's tickets as the customer sees them; incident tickets are
 * left to Incident Reports. */
export function usePortalTickets(account: BusinessAccount | undefined): CustomerTicket[] {
  const tickets = useTickets();
  const threads = useStore(messagesStore);
  const orders = useStore(orderMeta);
  const incidents = useAllIncidents();
  return useMemo(() => {
    const incidentTickets = new Set(incidents.map((i) => i.ticketId));
    return tickets
      .filter((t) => t.requester?.kind === "customer" && t.requester.id === account?.id && !incidentTickets.has(t.id))
      .map((t) => toCustomerTicket(t, threads[t.id] ?? [], orders[t.id]));
  }, [account, tickets, threads, orders, incidents]);
}

export interface PortalTicketInput {
  subject: string;
  category: TicketCategory;
  urgent: boolean;
  body: string;
  orderId?: string;
  photos: DeliveryPhoto[];
}

const withPhotos = (body: string, photos: DeliveryPhoto[]) => [body.trim(), photos.length ? `(${photos.length} photo${photos.length === 1 ? "" : "s"} attached: ${photos.map((p) => p.name).join(", ")})` : ""].filter(Boolean).join(" ");

/** New Ticket: an unassigned ticket in the Customer queue, stage New. */
export function openPortalTicket(account: BusinessAccount, input: PortalTicketInput): string {
  const ticket = createTicket(
    { subject: input.subject.trim(), customer: account.company.legalName, category: input.category, priority: input.urgent ? "high" : "medium", description: withPhotos(input.body, input.photos) },
    { kind: "customer", id: account.id, summary: `From the ${account.company.legalName} portal${input.orderId ? ` · ${input.orderId}` : ""}` },
  );
  updateTicket(ticket.id, { assigneeId: undefined, stage: "new" });
  if (input.orderId) orderMeta.set((m) => ({ ...m, [ticket.id]: input.orderId as string }));
  return ticket.id;
}

const author = (account: BusinessAccount) => `${account.owner.firstName} ${account.owner.lastName} (Customer)`;

export function replyToPortalTicket(account: BusinessAccount, ticketId: string, body: string): void {
  const ticket = findTicket(ticketId);
  appendTicketMessage(ticketId, { kind: "customer", author: author(account), time: nowTime(), body: body.trim() }, messagesStore.get()[ticketId]);
  updateTicket(ticketId, { status: ticket?.assigneeId ? "awaiting-internal" : "open", lastActivityMinutesAgo: 0 });
}

/** Reopen a resolved ticket (closed ones stay closed): back In Progress for
 * the same agent, with an internal note so staff see why. */
export function reopenPortalTicket(account: BusinessAccount, ticketId: string, body: string): void {
  const base = messagesStore.get()[ticketId];
  if (body.trim()) appendTicketMessage(ticketId, { kind: "customer", author: author(account), time: nowTime(), body: body.trim() }, base);
  appendTicketMessage(ticketId, { kind: "internal", author: "System", time: nowTime(), body: "Customer reopened this ticket from the portal." }, messagesStore.get()[ticketId] ?? base);
  updateTicket(ticketId, { status: "open", stage: "in-progress", sla: "healthy", lastActivityMinutesAgo: 0 });
}
