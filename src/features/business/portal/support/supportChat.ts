import { useMemo } from "react";
import { createStore, useStore } from "../../../../lib/createStore";
import { appendTicketMessage, messagesStore, nowTime } from "../../../support/ticketMessages";
import { createTicket, updateTicket } from "../../../support/tickets";
import { getDeliveries } from "../../deliveries/deliveriesStore";
import { botReply, chatMessage, GREETING, QUICK_REPLIES, type SupportAction, type SupportMessage } from "../../deliveries/supportBot";
import type { BusinessAccount } from "../../businessAccounts";

// Portal Support Chat (2026-10-01 design). The assistant answers locally;
// "Escalate to Human Agent" opens an admin support ticket with the
// transcript, and from then on the chat IS that ticket's thread — agent
// replies in the Support workspace show up here.
// TODO: the Support API's chat sessions.

interface ChatState {
  threads: Record<string, SupportMessage[]>;
  tickets: Record<string, string>;
}

const store = createStore<ChatState>({ threads: {}, tickets: {} });
const START = (): SupportMessage[] => [chatMessage("bot", GREETING)];

function append(customerId: string, messages: SupportMessage[]): void {
  store.set((s) => ({ ...s, threads: { ...s.threads, [customerId]: [...(s.threads[customerId] ?? START()), ...messages] } }));
}

export function sendChat(account: BusinessAccount, input: string | SupportAction): void {
  const text = QUICK_REPLIES.find((q) => q.action === input)?.label ?? String(input).trim();
  const ticketId = store.get().tickets[account.id];
  if (ticketId) {
    appendTicketMessage(ticketId, { kind: "customer", author: `${account.owner.firstName} ${account.owner.lastName} (Customer)`, time: nowTime(), body: text });
    updateTicket(ticketId, { status: "awaiting-internal", lastActivityMinutesAgo: 0 });
    return;
  }
  append(account.id, [chatMessage("customer", text)]);
  const orders = getDeliveries().filter((o) => o.customerId === account.id);
  setTimeout(() => append(account.id, botReply(input, orders, true)), 700);
}

export function escalateChat(account: BusinessAccount): void {
  if (store.get().tickets[account.id]) return;
  const transcript = (store.get().threads[account.id] ?? START())
    .filter((m) => m.text)
    .map((m) => `${m.from === "customer" ? "Customer" : "Assistant"}: ${m.text}`)
    .join("\n");
  const ticket = createTicket(
    { subject: "Live chat — escalated from the virtual assistant", customer: account.company.legalName, category: "support", priority: "medium", description: transcript || "Customer asked for an agent." },
    { kind: "customer", id: account.id, summary: "Escalated from portal Support Chat" },
  );
  updateTicket(ticket.id, { assigneeId: undefined });
  store.set((s) => ({ ...s, tickets: { ...s.tickets, [account.id]: ticket.id } }));
  append(account.id, [chatMessage("system", `Connected to KiaRelay Support (ticket ${ticket.id}). An agent will reply here.`)]);
}

/** The chat as shown: assistant thread, then the ticket conversation. */
export function useSupportChat(account: BusinessAccount | undefined): { messages: SupportMessage[]; escalated: boolean } {
  const state = useStore(store);
  const threads = useStore(messagesStore);
  return useMemo(() => {
    if (!account) return { messages: [], escalated: false };
    const ticketId = state.tickets[account.id];
    const local = state.threads[account.id] ?? START();
    const ticketThread = ticketId ? (threads[ticketId] ?? []).slice(1).filter((m) => m.kind !== "internal") : [];
    const fromTicket = ticketThread.map((m) => ({ id: `${ticketId}-${m.id}`, from: m.kind === "customer" ? ("customer" as const) : ("agent" as const), text: m.body, at: m.time }));
    return { messages: [...local, ...fromTicket], escalated: Boolean(ticketId) };
  }, [account, state, threads]);
}
