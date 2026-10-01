import type { DeliveryOrder } from "./deliveryTypes";
import type { IncidentEvent, IncidentEventKind, IncidentReport } from "./incidentTypes";

// Demo incident reports (2026-10-01), same as the customer app's
// src/mocks/incidentSeeds.ts: the design's four rows, adapted for a
// customer, on the account's own past deliveries.
// TODO: remove with the mock data.

const MIN = 60_000;

function events(now: number, startMinAgo: number, kinds: [IncidentEventKind, number, string?][]): IncidentEvent[] {
  return [{ kind: "reported", at: new Date(now - startMinAgo * MIN).toISOString(), note: "" }, ...kinds.map(([kind, minAgo, note]) => ({ kind, at: new Date(now - minAgo * MIN).toISOString(), note: note ?? "" }))];
}

export function buildSeedIncidents(customerId: string, orders: DeliveryOrder[], now: number): IncidentReport[] {
  const delivered = orders.filter((o) => o.pod);
  const pick = (i: number) => delivered[i % Math.max(1, delivered.length)]?.id ?? "";
  const base = { customerId, categoryOther: "", photos: [], responses: [] };
  return [
    {
      ...base,
      id: "IR-10482",
      orderId: pick(0),
      category: "Package Damage",
      description: "Box arrived crushed on the bottom left corner. Inner contents appear secure but outer packaging is compromised.",
      urgency: "urgent",
      claimAmount: 250,
      createdAt: new Date(now - 33 * MIN).toISOString(),
      events: events(now, 33, [["received", 31], ["under-review", 27], ["action-required", 20, "KiaRelay Operations needs an additional photo showing the condition of the inner packaging to process the damage claim."]]),
    },
    {
      ...base,
      id: "IR-10480",
      orderId: pick(1),
      category: "Late Delivery",
      description: "Delivery arrived over two hours after the promised window; our receiving crew had left.",
      urgency: "normal",
      claimAmount: 0,
      createdAt: new Date(now - 26 * 60 * MIN).toISOString(),
      events: events(now, 26 * 60, [["received", 26 * 60 - 2], ["under-review", 20 * 60]]),
    },
    {
      ...base,
      id: "IR-10475",
      orderId: pick(2),
      category: "Billing Issue",
      description: "Charged a liftgate fee, but the drop-off had a dock leveler and no liftgate was used.",
      urgency: "normal",
      claimAmount: 0,
      createdAt: new Date(now - 4 * 24 * 60 * MIN).toISOString(),
      events: events(now, 4 * 24 * 60, []),
    },
    {
      ...base,
      id: "IR-10460",
      orderId: pick(3),
      category: "Wrong Address Details",
      description: "The suite number on the drop-off was wrong; the driver had to call us to find the dock.",
      urgency: "normal",
      claimAmount: 0,
      createdAt: new Date(now - 8 * 24 * 60 * MIN).toISOString(),
      events: events(now, 8 * 24 * 60, [["received", 8 * 24 * 60 - 3], ["under-review", 7 * 24 * 60], ["resolved", 6 * 24 * 60, "Address corrected in your saved locations; the driver confirmed the dock."]]),
    },
  ];
}
