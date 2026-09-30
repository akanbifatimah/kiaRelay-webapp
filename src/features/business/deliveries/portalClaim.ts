import { acmeSedanClaim } from "../../support/claimInvestigationData";
import { claimCategoryLabels, type ClaimCategory, type ClaimInvestigation } from "../../support/claimInvestigation";
import { nextClaimId, saveClaim } from "../../support/claims";
import { attachClaim } from "./deliveryActions";
import { stateCode } from "./display";
import { eventTime } from "./deliverySim";
import type { DeliveryOrder } from "./deliveryTypes";
import type { DeliveryClaim } from "./trackingTypes";

const CATEGORY: Record<string, ClaimCategory> = {
  "Damaged items": "transit-damage",
  "Lost items": "loss",
  "Late delivery": "delay",
  "Billing issue": "billing",
};

const today = () => new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });

/**
 * A customer's "Submit Claim" (2026-09-30): saved on the delivery and filed
 * as an open claim in admin Claims Management, so Support sees it at once.
 * TODO: POST /deliveries/:id/claims creates both server-side.
 */
export function submitPortalClaim(order: DeliveryOrder, input: Omit<DeliveryClaim, "id" | "submittedAt">, companyName: string): string {
  const id = nextClaimId();
  const category = CATEGORY[input.reason] ?? "transit-damage";
  const reason = input.reason === "Other" ? input.reasonOther : input.reason;
  const place = (a: DeliveryOrder["pickup"]["address"]) => `${a.city}, ${stateCode(a.state)}`;
  const claim: ClaimInvestigation = {
    ...acmeSedanClaim,
    id,
    ticketId: "—",
    status: "open",
    category,
    type: claimCategoryLabels[category],
    amount: input.amount,
    createdDaysAgo: 0,
    resolvedDaysAgo: undefined,
    incidentDate: (eventTime(order, "delivered") ?? order.createdAt).slice(0, 10),
    submitted: today(),
    serviceTag: order.speed.toUpperCase(),
    dispatcher: "—",
    incidentDescription: `${reason}: ${input.description}`,
    customerStatement: input.description,
    internalNotes: "",
    reviewer: "Unassigned",
    resolutionState: "Not Started",
    order: { ref: order.id, status: "Delivered", title: `${claimCategoryLabels[category]} — ${order.load.description}`, route: `${place(order.pickup.address)} → ${place(order.dropoff.address)}`, dates: order.createdAt.slice(0, 10) },
    customer: { name: companyName, accountId: order.customerId },
    driver: { name: order.driver ? `${order.driver.firstName} ${order.driver.lastName}` : "—", meta: order.driver ? `${order.driver.vehicle} · ${order.driver.plate}` : "Assigned driver" },
    photos: [],
    gps: [],
    signatures: [],
    attachments: input.photos.map((photo) => ({ name: photo.name, size: 0, url: photo.uri })),
    timeline: [
      { id: "t1", title: "Claim Submitted", time: today(), description: `Filed by the customer from the ${companyName} portal.`, status: "done" },
      { id: "t2", title: "Evidence Review", time: "", description: "Awaiting reviewer assessment.", status: "pending" },
      { id: "t3", title: "Resolution Pending", time: "", description: "Awaiting investigation outcome.", status: "pending" },
    ],
    similarIncidents: [],
    evidenceValidated: false,
  };
  saveClaim(claim);
  attachClaim(order.id, { ...input, id, submittedAt: new Date().toISOString() });
  return id;
}
