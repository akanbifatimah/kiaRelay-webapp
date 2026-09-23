import { orders, type Order } from "../orders/data";
import { acmeSedanClaim } from "./claimInvestigationData";
import { claimCategoryLabels, type ClaimAttachment, type ClaimCategory, type ClaimInvestigation } from "./claimInvestigation";
import { getAgent, CURRENT_AGENT_ID } from "./agents";

export interface CreateClaimValues {
  orderQuery: string;
  orderId: string;
  category: ClaimCategory | "";
  incidentDate: string;
  /** Not in the Create New Claim screenshot — added because every claim
   * carries an amount (Claims table column, Resolve's policy-limit check). */
  amount: string;
  description: string;
  evidencePhoto: boolean;
  evidenceGps: boolean;
  evidenceSignature: boolean;
  attachments: ClaimAttachment[];
}

export const EMPTY_CLAIM_FORM: CreateClaimValues = {
  orderQuery: "",
  orderId: "",
  category: "",
  incidentDate: "",
  amount: "",
  description: "",
  evidencePhoto: false,
  evidenceGps: false,
  evidenceSignature: false,
  attachments: [],
};

/** "Search Logistics DB" — matches order ID, customer or driver. */
export function searchOrders(query: string): Order[] {
  const q = query.trim().toLowerCase().replace(/^#/, "");
  if (!q) return [];
  return orders.filter((order) => `${order.id} ${order.customer} ${order.driver}`.toLowerCase().replace(/#/g, "").includes(q)).slice(0, 6);
}

export function findOrder(id: string): Order | undefined {
  return orders.find((order) => order.id === id);
}

function today(): string {
  return new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
}

// TODO: POST /claims (and PUT /claims/:id for drafts) once the Claims API
// exists. The linked order's artifacts are the sample evidence set (the
// user-supplied pickup/damage photos, GPS trace, signature log) — whichever
// the agent ticked get attached; unticked ones are left off the claim.
export function buildClaimFromForm(id: string, values: CreateClaimValues, status: "draft" | "open"): ClaimInvestigation {
  const order = findOrder(values.orderId);
  const category = values.category || "transit-damage";
  const reviewer = getAgent(CURRENT_AGENT_ID)?.name ?? "Unassigned";
  return {
    ...acmeSedanClaim,
    id,
    ticketId: "—",
    status,
    category,
    type: claimCategoryLabels[category],
    amount: Number(values.amount) || 0,
    createdDaysAgo: 0,
    resolvedDaysAgo: undefined,
    incidentDate: values.incidentDate || undefined,
    submitted: today(),
    serviceTag: order ? order.type.toUpperCase() : "—",
    dispatcher: "—",
    incidentDescription: values.description.trim() || "No description provided yet.",
    customerStatement: "Customer statement not yet recorded.",
    internalNotes: "",
    reviewer,
    resolutionState: status === "draft" ? "Draft" : "Not Started",
    order: order
      ? { ref: order.id, status: order.status === "delivered" ? "Delivered" : "In Progress", title: `${claimCategoryLabels[category]} — ${order.type} delivery`, route: `${order.pickup} → ${order.dropoff}`, dates: order.date }
      : { ref: "—", status: "—", title: "No order linked", route: "—", dates: "—" },
    customer: { name: order?.customer ?? "—", accountId: "—" },
    driver: { name: order?.driver ?? "—", meta: "Assigned driver" },
    photos: values.evidencePhoto ? acmeSedanClaim.photos : [],
    gps: values.evidenceGps ? acmeSedanClaim.gps : [],
    signatures: values.evidenceSignature ? acmeSedanClaim.signatures : [],
    attachments: values.attachments,
    timeline: [
      { id: "t1", title: status === "draft" ? "Draft Saved" : "Claim Created", time: today(), description: `Logged manually by ${reviewer}.`, status: "done" },
      { id: "t2", title: "Evidence Review", time: "", description: "Awaiting reviewer assessment.", status: "pending" },
      { id: "t3", title: "Resolution Pending", time: "", description: "Awaiting investigation outcome.", status: "pending" },
    ],
    similarIncidents: [],
    evidenceValidated: false,
  };
}

/** Reverse of buildClaimFromForm — reopening a draft in Create New Claim. */
export function formFromDraft(claim: ClaimInvestigation): CreateClaimValues {
  const hasOrder = claim.order.ref !== "—";
  return {
    orderQuery: hasOrder ? claim.order.ref : "",
    orderId: hasOrder ? claim.order.ref : "",
    category: claim.category,
    incidentDate: claim.incidentDate ?? "",
    amount: claim.amount ? String(claim.amount) : "",
    description: claim.incidentDescription === "No description provided yet." ? "" : claim.incidentDescription,
    evidencePhoto: claim.photos.length > 0,
    evidenceGps: claim.gps.length > 0,
    evidenceSignature: claim.signatures.length > 0,
    attachments: claim.attachments,
  };
}
