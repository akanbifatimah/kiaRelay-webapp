import { CURRENT_AGENT_ID } from "./agents";
import type { SlaStatus, SupportTicket, TicketCategory, TicketPriority, TicketStatus } from "./types";

type Seed = [id: string, subject: string, customer: string, category: TicketCategory, priority: TicketPriority, sla: SlaStatus, slaMinutesLeft: number, createdMinutesAgo: number];

// First seven rows copied from the Unassigned Tickets screenshot; the rest
// pad the queue to the "17 tickets requiring assignment" count it shows.
const unassignedSeeds: Seed[] = [
  ["TCK-8902", "Missing Freight Documentation", "Acme Logistics Corp.", "compliance", "critical", "breached", -60, 240],
  ["TCK-8915", "Driver route optimization error", "Global Trans Inc.", "technical", "high", "at-risk", 15, 60],
  ["TCK-8922", "Invoice discrepancy #INV-554", "Northwest Supply", "billing", "medium", "healthy", 180, 20],
  ["TCK-8923", "Payment request #PAY-123", "East Coast Logistics", "finance", "high", "pending", 60, 15],
  ["TCK-8924", "Service update #SRV-789", "Central Tech Solutions", "support", "low", "resolved", 120, 10],
  ["TCK-8925", "Feedback request #FB-456", "Southwest Innovations", "marketing", "medium", "open", 30, 5],
  ["TCK-8928", "Update account primary contact", "Summit Freight", "account", "low", "healthy", 1380, 5],
  ["KR-1048", "Driver hasn't arrived", "BioPharm Logistics", "delivery", "high", "at-risk", 10, 25],
  ["TCK-8931", "Damage claim — sedan front fender", "Premier Auto Logistics", "claims", "high", "healthy", 240, 45],
  ["TCK-8933", "Proof of delivery photo missing", "Harbor Retail Group", "delivery", "medium", "healthy", 300, 70],
  ["TCK-8936", "Duplicate charge on card", "Jennifer Walsh", "billing", "high", "at-risk", 25, 90],
  ["TCK-8940", "HazMat certification upload failing", "Atlas Global Logistics Ltd", "compliance", "critical", "breached", -30, 150],
  ["TCK-8941", "Cannot reset account password", "Sarah Jenkins", "access", "medium", "healthy", 420, 110],
  ["TCK-8944", "Fuel surcharge dispute", "Midland Freightways", "finance", "low", "healthy", 900, 180],
  ["TCK-8947", "Tracking link shows wrong ETA", "Cyberdyne Systems", "technical", "medium", "pending", 95, 200],
  ["TCK-8950", "Request to add second branch", "Acme Refinery LLC", "account", "low", "open", 600, 260],
  ["TCK-8952", "Temperature log gap on healthcare load", "St. Mary's Medical Supply", "compliance", "high", "at-risk", 20, 300],
];

// First three rows copied from the My Open Tickets screenshot. TKT-8841 is
// the hand-authored conversation (ticketWorkspace.ts); TKT-8810 is the
// hand-authored claim investigation (claimInvestigationData.ts).
const mySeeds: [...Seed, TicketStatus][] = [
  ["TKT-8902", "API Gateway Timeout in EU Region", "Acme Corp", "infrastructure", "critical", "at-risk", 45, 30, "open"],
  ["TKT-8895", "Billing Export Job Failed", "Globex Inc", "billing", "high", "healthy", 135, 120, "open"],
  ["TKT-8870", "Update SSO Configuration", "Stark Logistics", "access", "medium", "healthy", 1680, 300, "open"],
  ["TKT-8841", "Delayed Delivery - Order #8841", "Cyberdyne Systems", "delivery", "high", "at-risk", 30, 120, "open"],
  ["TKT-8810", "Damage report — vehicle transport sedan", "Premier Auto Logistics", "claims", "high", "healthy", 360, 2880, "open"],
  ["TKT-8924", "Critical Server Outage (Node 4)", "Central Tech Solutions", "infrastructure", "critical", "breached", -20, 90, "open"],
  ["TKT-8866", "Refund not received for cancelled order", "Sarah Jenkins", "finance", "medium", "healthy", 600, 1440, "awaiting-customer"],
  ["TKT-8859", "Signature missing on POD", "Harbor Retail Group", "delivery", "low", "healthy", 900, 2000, "awaiting-customer"],
  ["TKT-8851", "Confirm new billing contact", "Acme Refinery LLC", "account", "low", "healthy", 1200, 2600, "awaiting-customer"],
  ["TKT-8848", "Clarify invoice line items", "Jennifer Walsh", "billing", "medium", "pending", 240, 3000, "awaiting-customer"],
  ["TKT-8838", "Driver app crash on photo upload", "Internal — Driver Ops", "technical", "high", "pending", 180, 3500, "awaiting-internal"],
  ["TKT-8832", "Verify HazMat endorsement", "Atlas Global Logistics Ltd", "compliance", "medium", "healthy", 700, 4000, "awaiting-internal"],
  ["TKT-8820", "Wrong delivery address on order", "Summit Freight", "delivery", "medium", "resolved", 0, 5000, "resolved"],
  ["TKT-8815", "Access request for new dispatcher", "Globex Inc", "access", "low", "resolved", 0, 6000, "resolved"],
];

const ACME_ID = "KR-77410-JW";
const MARCUS_ID = "DR-08190";

// Tickets raised by real records, backing the Driver Support View (Marcus
// Thorne, DR-08190) and Customer Support View (Acme Refinery LLC,
// KR-77410-JW) — the first two of each copied from those screenshots.
const requesterSeeds: [...Seed, TicketStatus, SupportTicket["requester"]][] = [
  ["TKT-492", "Detour required on I-94", "Marcus Thorne", "routing", "high", "at-risk", 40, 15, "open", { kind: "driver", id: MARCUS_ID, summary: "Driver reported road closure ahead, requesting alternate route clearance to avoid delay on the Detroit drop.", handler: "Dispatch: Sarah J." }],
  ["TKT-488", "Check Engine Light - Yellow", "Marcus Thorne", "maintenance", "medium", "healthy", 300, 240, "open", { kind: "driver", id: MARCUS_ID, summary: "Sensor fault on emissions system reported during morning pre-trip inspection.", handler: "Fleet Maint." }],
  ["TKT-455", "Fuel card declined at Gary, IN", "Marcus Thorne", "finance", "low", "resolved", 0, 8600, "resolved", { kind: "driver", id: MARCUS_ID, summary: "Card limit reset by Finance; driver refueled.", handler: "Finance" }],
  ["TKT-1042", "Delayed shipment to Warehouse B", "Acme Refinery LLC", "delivery", "high", "at-risk", 35, 120, "open", { kind: "customer", id: ACME_ID, handler: "System" }],
  ["TKT-1038", "Billing discrepancy on invoice #449", "Acme Refinery LLC", "billing", "medium", "healthy", 400, 1440, "awaiting-internal", { kind: "customer", id: ACME_ID, handler: "Finance" }],
  ["TKT-1021", "Feature request: Custom reporting", "Acme Refinery LLC", "support", "low", "healthy", 2000, 4320, "awaiting-customer", { kind: "customer", id: ACME_ID, handler: "S. Jenkins" }],
  ["TKT-0988", "POD signature missing on DEL-9870", "Acme Refinery LLC", "delivery", "medium", "resolved", 0, 11520, "resolved", { kind: "customer", id: ACME_ID, handler: "Support" }],
];

function fromSeed(seed: Seed, status: TicketStatus, assigneeId?: string): SupportTicket {
  const [id, subject, customer, category, priority, sla, slaMinutesLeft, createdMinutesAgo] = seed;
  return {
    id,
    subject,
    customer,
    category,
    priority,
    status,
    sla,
    slaMinutesLeft,
    createdMinutesAgo,
    lastActivityMinutesAgo: Math.max(1, Math.round(createdMinutesAgo / 3)),
    assigneeId,
    // TKT-8810 is the hand-authored claim; any other claims ticket exercises
    // claimInvestigation.ts's generic fallback.
    claimId: category === "claims" ? (id === "TKT-8810" ? "CLM-882910-X" : `CLM-${id.replace(/\D/g, "")}-K`) : undefined,
  };
}

const withCustomer = (ticket: SupportTicket): SupportTicket =>
  ticket.customer === "Acme Refinery LLC" ? { ...ticket, requester: { kind: "customer", id: ACME_ID } } : ticket;

// TODO: replace with GET /support/tickets once the Support module API
// exists. Unassigned = no assigneeId; "My Tickets" = assigneeId is the
// signed-in agent — one list, so assigning to yourself moves a ticket
// between the two pages.
export const seedTickets: SupportTicket[] = [
  ...unassignedSeeds.map((seed) => withCustomer(fromSeed(seed, "open"))),
  ...mySeeds.map((seed) => withCustomer(fromSeed(seed.slice(0, 8) as Seed, seed[8], CURRENT_AGENT_ID))),
  ...requesterSeeds.map((seed) => ({ ...fromSeed(seed.slice(0, 8) as Seed, seed[8], CURRENT_AGENT_ID), requester: seed[9] })),
];
