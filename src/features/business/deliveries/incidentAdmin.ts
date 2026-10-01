import { acmeSedanClaim } from "../../support/claimInvestigationData";
import { claimCategoryLabels, type ClaimCategory, type ClaimInvestigation } from "../../support/claimInvestigation";
import { nextClaimId, saveClaim } from "../../support/claims";
import { createTicket, updateTicket } from "../../support/tickets";
import type { TicketCategory } from "../../support/types";
import { findDelivery } from "./deliveriesStore";
import { cityState } from "./display";
import { incidentTitle, isClaimCategory } from "./incidents";
import type { IncidentReport } from "./incidentTypes";

const TICKET_CATEGORY: Record<string, TicketCategory> = { "Billing Issue": "billing", "Driver Conduct": "support" };
const CLAIM_CATEGORY: Record<string, ClaimCategory> = { "Package Damage": "transit-damage", "Missing Items": "loss" };
const today = () => new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });

/**
 * Opens the admin records for a customer incident (2026-10-01): an
 * unassigned support ticket (the conversation — an agent's reply is the
 * customer's "What we need"), plus an open claim for damage / missing items,
 * linked by the claim's ticketId. TODO: POST /incidents does this server-side.
 */
export function openAdminRecords(incident: IncidentReport, companyName: string): { ticketId: string; claimId?: string } {
  const title = incidentTitle(incident);
  const ticket = createTicket(
    {
      subject: `${title}${incident.orderId ? ` — ${incident.orderId}` : ""} (#${incident.id})`,
      customer: companyName,
      category: TICKET_CATEGORY[incident.category] ?? "delivery",
      priority: incident.urgency === "urgent" ? "high" : "medium",
      description: incident.description,
    },
    { kind: "customer", id: incident.customerId, summary: `Incident report #${incident.id} from the ${companyName} portal` },
  );
  // Customer reports land in Unassigned, not on the current agent's desk.
  updateTicket(ticket.id, { assigneeId: undefined });
  if (!isClaimCategory(incident.category)) return { ticketId: ticket.id };

  const order = findDelivery(incident.orderId);
  const category = CLAIM_CATEGORY[incident.category];
  const claim: ClaimInvestigation = {
    ...acmeSedanClaim,
    id: nextClaimId(),
    ticketId: ticket.id,
    status: "open",
    category,
    type: claimCategoryLabels[category],
    amount: incident.claimAmount,
    createdDaysAgo: 0,
    resolvedDaysAgo: undefined,
    incidentDate: incident.createdAt.slice(0, 10),
    submitted: today(),
    serviceTag: order ? order.speed.toUpperCase() : "—",
    dispatcher: "—",
    incidentDescription: `${title}: ${incident.description}`,
    customerStatement: incident.description,
    internalNotes: `Customer incident #${incident.id}, ticket ${ticket.id}.`,
    reviewer: "Unassigned",
    resolutionState: "Not Started",
    order: order
      ? { ref: order.id, status: "Delivered", title: `${claimCategoryLabels[category]} — ${order.load.description}`, route: `${cityState(order.pickup.address)} → ${cityState(order.dropoff.address)}`, dates: order.createdAt.slice(0, 10) }
      : { ref: "—", status: "—", title: "No order linked", route: "—", dates: "—" },
    customer: { name: companyName, accountId: incident.customerId },
    driver: { name: order?.driver ? `${order.driver.firstName} ${order.driver.lastName}` : "—", meta: order?.driver ? `${order.driver.vehicle} · ${order.driver.plate}` : "Assigned driver" },
    photos: [],
    gps: [],
    signatures: [],
    attachments: incident.photos.map((p) => ({ name: p.name, size: 0, url: p.uri })),
    timeline: [
      { id: "t1", title: "Claim Submitted", time: today(), description: `Incident #${incident.id} from the ${companyName} portal.`, status: "done" },
      { id: "t2", title: "Evidence Review", time: "", description: "Awaiting reviewer assessment.", status: "pending" },
      { id: "t3", title: "Resolution Pending", time: "", description: "Awaiting investigation outcome.", status: "pending" },
    ],
    similarIncidents: [],
    evidenceValidated: false,
  };
  saveClaim(claim);
  return { ticketId: ticket.id, claimId: claim.id };
}
