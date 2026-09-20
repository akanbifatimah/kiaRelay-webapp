import { adjustments, type Adjustment } from "./adjustments";
import { customers } from "../customers/data";

export interface RelatedRecord {
  label: string;
  value: string;
  href?: string;
}

export interface AdjustmentReason {
  text: string;
  tags: string[];
  claimCaseId: string;
  claimLastUpdatedLabel: string;
}

export interface AdjustmentNote {
  id: string;
  author: string;
  text: string;
  timestamp: string;
}

export interface AdjustmentDetail {
  adjustment: Adjustment;
  managedBy: string;
  createdLabel: string;
  processedLabel: string;
  remainingCharge: number;
  relatedRecords: RelatedRecord[];
  reason: AdjustmentReason;
  notes: AdjustmentNote[];
  customerId: string;
  customerAccountType: "individual" | "company";
}

function pick<T>(list: T[], seed: string): T {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  return list[Math.abs(hash) % list.length];
}

const staff = ["Sarah Jenkins", "Mike Ross", "Priya Anand", "Daniel Kim"];
const reasonsByTag: Record<string, string> = {
  Damaged: "Package damage verified during claim investigation KR-CLM-0042.",
  "Late Delivery": "SLA breach confirmed — delivery exceeded committed window by over 4 hours.",
  "Promo Credit": "Promotional credit applied per active marketing campaign terms.",
  "Account Credit": "Account credit issued after manual review of billing dispute.",
  "Billing Correction": "Correction applied after a duplicate charge was identified.",
  Refund: "Refund approved after customer support escalation review.",
  "Cold Chain Failure": "Temperature excursion confirmed via cold-chain monitoring logs.",
};

// TODO: replace with GET /finance/adjustments/:id once the Financial
// Management / Claims API exists. Managed-by/reason/notes are computed
// deterministically from the base adjustment record rather than a second
// hand-authored dataset, same technique as transactionDetail.ts.
export function getAdjustmentDetail(id: string): AdjustmentDetail | null {
  const adjustment = adjustments.find((a) => a.id === `#${id}` || a.id === id);
  if (!adjustment) return null;

  const managedBy = pick(staff, adjustment.id);
  const caseId = `KR-CLM-${String(Math.abs(adjustment.id.charCodeAt(5) * 13) % 9000).padStart(4, "0")}`;
  // Adjustment.customer is a display-name string only, no id backing — same
  // fix as transactionDetail.ts's EntityLinkageCard: deterministically pick
  // a real customer so the display name shown elsewhere stays whatever the
  // mock adjustment record says, while the link itself is a real route.
  const linkedCustomer = pick(customers, adjustment.id + "c");

  return {
    adjustment,
    managedBy,
    createdLabel: `${adjustment.date}, 2026 · 09:12 AM`,
    processedLabel: `${adjustment.date}, 2026 · 14:45 PM`,
    remainingCharge: Math.round((adjustment.original + adjustment.adjustment) * 100) / 100,
    customerId: linkedCustomer.id,
    customerAccountType: linkedCustomer.accountType,
    relatedRecords: [
      { label: "Customer", value: adjustment.customer, href: `/customers/${linkedCustomer.accountType}/${linkedCustomer.id}` },
      { label: "Original Order", value: adjustment.orderRef },
      { label: "Claim Record", value: `#CLM-${caseId.slice(-4)}` },
    ],
    reason: {
      text: reasonsByTag[adjustment.reasonTag] ?? "Adjustment approved after manual finance review.",
      tags: ["Proof Attached", "SLA Compliant"],
      claimCaseId: caseId,
      claimLastUpdatedLabel: "7 days ago",
    },
    notes: [
      {
        id: "note-1",
        author: managedBy,
        text: "Final verification complete. Warehouse photos match the courier's report. Proceeding with partial refund as per client contract terms.",
        timestamp: "Yesterday at 2:45 PM",
      },
    ],
  };
}
