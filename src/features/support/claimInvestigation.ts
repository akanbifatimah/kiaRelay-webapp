export type ClaimStatus = "draft" | "open" | "in-review" | "resolved" | "escalated";

export const claimStatusLabels: Record<ClaimStatus, string> = {
  draft: "Draft",
  open: "Open",
  "in-review": "In Review",
  resolved: "Resolved",
  escalated: "Escalated",
};

/** Claims Management's Category Distribution buckets. The screenshot's
 * donut read Hardware/Software/Network/Access (placeholder copy from a
 * generic template) — replaced with real claim categories, per the plan
 * the user approved on 2026-09-23. */
export type ClaimCategory = "transit-damage" | "loss" | "delay" | "billing";

export const claimCategoryLabels: Record<ClaimCategory, string> = {
  "transit-damage": "Transit Damage",
  loss: "Lost Shipment",
  delay: "Delivery Delay",
  billing: "Billing Dispute",
};

export interface ClaimAttachment {
  name: string;
  size: number;
  url: string;
}

export interface EvidencePhoto {
  kind: "pickup" | "delivery";
  src: string;
  timestamp: string;
  caption: string;
  lat: number;
  lng: number;
}

export interface GpsPoint {
  label: string;
  time: string;
  lat: number;
  lng: number;
  note: string;
}

export interface SignatureLog {
  signer: string;
  role: string;
  time: string;
  method: string;
  status: "verified" | "flagged";
  note: string;
}

export interface ClaimTimelineEntry {
  id: string;
  title: string;
  time: string;
  description: string;
  status: "done" | "active" | "pending";
}

export interface SimilarIncident {
  claimId: string;
  driver: string;
  location: string;
  date: string;
  status: "closed" | "open";
  settlement: number;
}

export interface ClaimInvestigation {
  id: string;
  ticketId: string;
  status: ClaimStatus;
  category: ClaimCategory;
  type: string;
  /** Amount the customer is claiming (the table's Amount column). */
  amount: number;
  createdDaysAgo: number;
  resolvedDaysAgo?: number;
  /** ISO date (native date input value) — Create New Claim's Incident Date. */
  incidentDate?: string;
  attachments: ClaimAttachment[];
  submitted: string;
  serviceTag: string;
  dispatcher: string;
  incidentDescription: string;
  customerStatement: string;
  internalNotes: string;
  reviewer: string;
  resolutionState: string;
  policyLimit: number;
  order: { ref: string; status: string; title: string; route: string; dates: string };
  customer: { name: string; accountId: string };
  driver: { name: string; meta: string };
  photos: EvidencePhoto[];
  gps: GpsPoint[];
  signatures: SignatureLog[];
  timeline: ClaimTimelineEntry[];
  similarIncidents: SimilarIncident[];
  evidenceValidated: boolean;
}

export function formatUsd(amount: number): string {
  return amount.toLocaleString("en-US", { style: "currency", currency: "USD" });
}
