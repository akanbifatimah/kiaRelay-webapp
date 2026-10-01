import { useMemo } from "react";
import { useStore } from "../../../lib/createStore";
import { CURRENT_AGENT_ID, getAgent } from "../../support/agents";
import { useClaims } from "../../support/claims";
import { appendTicketMessage, messagesStore, nowTime } from "../../support/ticketMessages";
import { updateTicket, useTickets } from "../../support/tickets";
import { getDeliveries } from "../deliveries/deliveriesStore";
import { attachIncident } from "../deliveries/deliveryActions";
import { openAdminRecords } from "../deliveries/incidentAdmin";
import { buildSeedIncidents } from "../deliveries/incidentSeeds";
import { getIncidents, upsertIncident, useAllIncidents } from "../deliveries/incidentsStore";
import type { IncidentReport } from "../deliveries/incidentTypes";
import { incidentStatus } from "../deliveries/incidents";
import { incidentView, type IncidentView } from "../deliveries/portalIncidents";
import type { BusinessAccount } from "../businessAccounts";

/**
 * The demo company's four incidents (once per session), each with a real
 * admin ticket put in the matching state: an agent reply awaiting the
 * customer, under review, untouched, resolved. TODO: remove with mock data.
 */
export function seedPortalIncidents(account: BusinessAccount): void {
  if (getIncidents().some((i) => i.customerId === account.id)) return;
  const orders = getDeliveries().filter((o) => o.customerId === account.id);
  if (!orders.length) return;
  const agent = getAgent(CURRENT_AGENT_ID)?.name ?? "KiaRelay Support";
  for (const seed of buildSeedIncidents(account.id, orders, Date.now()).reverse()) {
    const incident: IncidentReport = { ...seed, events: seed.events.filter((e) => e.kind === "reported" || e.kind === "received"), ...openAdminRecords(seed, account.company.legalName) };
    upsertIncident(incident);
    if (incident.orderId) attachIncident(incident.orderId, incident.id);
    const status = incidentStatus(seed);
    const note = [...seed.events].reverse().find((e) => e.note)?.note;
    if (!incident.ticketId || status === "submitted") continue;
    if (note) appendTicketMessage(incident.ticketId, { kind: "agent", author: agent, time: nowTime(), body: note }, messagesStore.get()[incident.ticketId]);
    updateTicket(incident.ticketId, { assigneeId: CURRENT_AGENT_ID, status: status === "action-required" ? "awaiting-customer" : status === "resolved" ? "resolved" : "awaiting-internal" });
  }
}

export interface PortalIncident {
  incident: IncidentReport;
  view: IncidentView;
}

/** The company's incidents with their admin-derived status, newest first. */
export function usePortalIncidents(account: BusinessAccount | undefined): PortalIncident[] {
  const incidents = useAllIncidents();
  const tickets = useTickets();
  const threads = useStore(messagesStore);
  const claims = useClaims();
  return useMemo(
    () =>
      incidents
        .filter((i) => i.customerId === account?.id)
        .map((incident) => ({
          incident,
          view: incidentView(incident, tickets.find((t) => t.id === incident.ticketId), threads[incident.ticketId ?? ""] ?? [], claims.find((c) => c.id === incident.claimId)),
        })),
    [account, incidents, tickets, threads, claims],
  );
}
