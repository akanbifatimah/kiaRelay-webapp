import { companyBranchesOverviews } from "../../customers/companyBranchesData";
import type { DeliveryOrder, SavedLocation } from "./deliveryTypes";
import { ACME_DESTINATIONS, ACME_SITES, BUSINESS_LOADS } from "./seedCatalog";
import { buildSeedDeliveries } from "./seedDeliveries";

// The KiaRelay Business demo company, KR-77410-JW Acme Refinery LLC
// (2026-09-30). Same seed as the customer app's src/mocks/acmeSeed.ts, so
// the portal, the app and admin all show the same order history. Branches
// and team come from admin's own record (customers/companyBranchesData.ts).
// TODO: remove with the mock data.

export const ACME_ID = "KR-77410-JW";

export const ACME_SAVED: SavedLocation[] = [
  { id: "loc-acme-1", address: ACME_DESTINATIONS[0] },
  { id: "loc-acme-2", address: ACME_DESTINATIONS[1] },
  { id: "loc-acme-3", address: ACME_SITES[1] },
];

/** Admin's hand-authored order panel record (#ORD-2800), now an Acme delivery. */
function withFigmaOrder(order: DeliveryOrder): DeliveryOrder {
  return {
    ...order,
    dropoff: { ...order.dropoff, address: { name: "Port of Mobile, Gate 3", street: "1200 Port Blvd, Gate 3", city: "Mobile", state: "Alabama", zip: "36602" }, provisions: [] },
    load: { ...order.load, description: "Temperature-sensitive sample kits", category: "Medical Supplies", packaging: "Boxes", measurement: "Solid/Dry", lengthIn: 24, widthIn: 18, heightIn: 12, volume: 0, weightLbs: 45, quantity: 1 },
    handling: ["Fragile", "Temperature Control"],
    speed: "express",
    quote: {
      lines: [
        { label: "Base Rate", amount: 95 },
        { label: "Express Surcharge (25%)", amount: 23.75 },
        { label: "Fuel Adjustment", amount: 5.75 },
      ],
      total: 124.5,
      miles: 472,
      transitMinutes: 420,
    },
  };
}

export function buildAcmeDeliveries(now = Date.now()): DeliveryOrder[] {
  const orders = buildSeedDeliveries({
    customerId: ACME_ID,
    placedBy: ["Jennifer", "Walsh"],
    branches: companyBranchesOverviews[ACME_ID].branches.map((branch) => branch.name),
    payment: { kind: "invoice", label: "Invoice · Net 15" },
    origins: ACME_SITES,
    destinations: ACME_DESTINATIONS,
    loads: BUSINESS_LOADS,
    business: true,
    count: 24,
    firstId: 2800,
    now,
  });
  return [withFigmaOrder(orders[0]), ...orders.slice(1)];
}
