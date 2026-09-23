import { orders } from "../orders/data";
import { drivers } from "../drivers/driverRoster";
import { seedTickets } from "./ticketSeeds";
import { acmeSedanClaim } from "./claimInvestigationData";
import type { ClaimCategory, ClaimInvestigation, ClaimStatus } from "./claimInvestigation";
import { seededRandom } from "../../lib/seededRandom";

const CATEGORY_WEIGHTS: [ClaimCategory, number][] = [["transit-damage", 0.45], ["loss", 0.3], ["delay", 0.15], ["billing", 0.1]];
const TYPE_LABELS: Record<ClaimCategory, string[]> = {
  "transit-damage": ["Damage Report", "Fragile Cargo Damage", "Water Damage"],
  loss: ["Missing Item", "Lost Shipment", "Short Delivery"],
  delay: ["Late Delivery", "Missed Delivery Window"],
  billing: ["Overcharge", "Duplicate Charge"],
};
const REVIEWERS = ["James Brennan", "Priya Nair", "Sarah Williams"];
const DAYS = 90;

function daysAgoLabel(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
}

function pickCategory(roll: number): ClaimCategory {
  let acc = 0;
  for (const [category, weight] of CATEGORY_WEIGHTS) {
    acc += weight;
    if (roll < acc) return category;
  }
  return "billing";
}

// Older claims are mostly settled; recent ones are mostly still open.
function pickStatus(daysAgo: number, roll: number): ClaimStatus {
  if (daysAgo > 21) return roll < 0.93 ? "resolved" : roll < 0.97 ? "escalated" : "in-review";
  if (daysAgo > 7) return roll < 0.55 ? "resolved" : roll < 0.75 ? "in-review" : roll < 0.8 ? "escalated" : "open";
  return roll < 0.15 ? "resolved" : roll < 0.4 ? "in-review" : roll < 0.45 ? "escalated" : "open";
}

function buildClaim(i: number, next: () => number): ClaimInvestigation {
  // Raising the roll to a power >1 skews creation toward recent days, so
  // claim volume is denser this week than two months ago (a believable
  // backlog shape) instead of perfectly flat.
  const createdDaysAgo = Math.floor(Math.pow(next(), 1.3) * DAYS);
  const category = pickCategory(next());
  const status = pickStatus(createdDaysAgo, next());
  const order = orders[i % orders.length];
  const driver = drivers[i % drivers.length];
  const types = TYPE_LABELS[category];
  const resolvedDaysAgo = status === "resolved" ? Math.max(0, createdDaysAgo - 1 - Math.floor(next() * 6)) : undefined;
  return {
    ...acmeSedanClaim,
    id: `CLM-${String(100200 + i * 37).slice(-6)}-${String.fromCharCode(65 + (i % 26))}`,
    ticketId: "—",
    status,
    category,
    type: types[i % types.length],
    amount: Math.round((category === "billing" ? 80 : 250) + next() * (category === "billing" ? 900 : 4200)),
    createdDaysAgo,
    resolvedDaysAgo,
    submitted: daysAgoLabel(createdDaysAgo),
    incidentDescription: `${types[i % types.length]} reported on order ${order.id} (${order.pickup} → ${order.dropoff}).`,
    customerStatement: "Customer statement on file.",
    internalNotes: "",
    reviewer: REVIEWERS[i % REVIEWERS.length],
    resolutionState: status === "resolved" ? "Resolved" : status === "escalated" ? "Escalated" : "Pending Review",
    order: { ...acmeSedanClaim.order, ref: order.id, title: `${order.type[0].toUpperCase()}${order.type.slice(1)} delivery`, route: `${order.pickup} → ${order.dropoff}`, status: "Delivered" },
    customer: { name: order.customer, accountId: `ID: ${order.id.replace(/\D/g, "")}` },
    driver: { name: driver.name, meta: `${driver.id} • ${driver.rating} ★` },
    timeline: acmeSedanClaim.timeline.map((step, index) => ({
      ...step,
      status: status === "resolved" ? "done" : index === 0 ? "done" : index === 1 && status !== "open" ? "active" : "pending",
    })),
    similarIncidents: [],
  };
}

/** Fallback claim for claims-category tickets (e.g. Unassigned's TCK-8931). */
function claimForTicket(ticketId: string, claimId: string, customer: string, subject: string): ClaimInvestigation {
  return {
    ...acmeSedanClaim,
    id: claimId,
    ticketId,
    status: "open",
    createdDaysAgo: 0,
    submitted: daysAgoLabel(0),
    incidentDescription: `${subject}. Awaiting reviewer assessment.`,
    customerStatement: "Customer statement not yet recorded.",
    internalNotes: "",
    resolutionState: "Not Started",
    customer: { name: customer, accountId: "ID: —" },
    timeline: acmeSedanClaim.timeline.map((entry, index) => ({ ...entry, status: index === 0 ? "done" : "pending" })),
    similarIncidents: [],
  };
}

// TODO: replace with GET /claims (paginated, filterable) once the Claims
// API exists (PRD §9 — Claims Management).
export function buildSeedClaims(): ClaimInvestigation[] {
  // Deterministic (see lib/seededRandom.ts), so the stat tiles, chart and
  // donut computed from these claims are identical on every load.
  const next = seededRandom(4201);
  const ticketClaims = seedTickets
    .filter((ticket) => ticket.claimId && ticket.claimId !== acmeSedanClaim.id)
    .map((ticket) => claimForTicket(ticket.id, ticket.claimId as string, ticket.customer, ticket.subject));
  return [acmeSedanClaim, ...ticketClaims, ...Array.from({ length: 540 }, (_, i) => buildClaim(i, next))];
}
