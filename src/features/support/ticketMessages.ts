import { createStore, useStore } from "../../lib/createStore";

export type MessageKind = "customer" | "agent" | "internal";

export interface TicketMessage {
  id: string;
  kind: MessageKind;
  author: string;
  time: string;
  body: string;
}

// Messages keyed by ticket id — only tickets someone has replied to (or
// created with a description) have an entry; ticketWorkspace.ts seeds the
// rest from its hand-authored/fallback thread on first open.
// TODO: GET/POST /support/tickets/:id/messages once the API exists.
export const messagesStore = createStore<Record<string, TicketMessage[]>>({});

export function useTicketMessages(ticketId: string): TicketMessage[] | undefined {
  return useStore(messagesStore)[ticketId];
}

export function setTicketMessages(ticketId: string, messages: TicketMessage[]): void {
  messagesStore.set((prev) => ({ ...prev, [ticketId]: messages }));
}

export function appendTicketMessage(ticketId: string, message: Omit<TicketMessage, "id">, base: TicketMessage[] = []): void {
  messagesStore.set((prev) => {
    const thread = prev[ticketId] ?? base;
    return { ...prev, [ticketId]: [...thread, { ...message, id: `m${thread.length + 1}` }] };
  });
}

export function nowTime(): string {
  return new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}
