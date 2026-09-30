import { quoteDelivery } from "./pricing";
import { hashSeed, seededRandom } from "../../../lib/seededRandom";
import type { DeliveryDraft, DeliveryOrder, StopAddress } from "./deliveryTypes";
import type { DeliveryEvent, PaymentChoice } from "./trackingTypes";
import { buildOffers } from "./driverPool";
import { CONTACTS, type LoadTemplate } from "./seedCatalog";

// Deterministic order-history generator (2026-09-30), same as the
// customer app's src/mocks/seedDeliveries.ts. Dates are relative to `now`, so
// "this month" spend and "recent" lists always have data. Order 0 is live
// (in transit, delivered ~90 real seconds later); the rest are delivered,
// with every 7th cancelled.
// TODO: remove once GET /deliveries serves real history.

export interface SeedPlan {
  customerId: string;
  placedBy: [string, string];
  branches: string[];
  payment: PaymentChoice;
  origins: StopAddress[];
  destinations: StopAddress[];
  loads: LoadTemplate[];
  business: boolean;
  count: number;
  /** Id of order 0; older orders count down from it. */
  firstId: number;
  now: number;
}

const MIN = 60_000;
const iso = (ms: number) => new Date(ms).toISOString();

function draftFor(plan: SeedPlan, i: number, random: () => number): DeliveryDraft {
  const template = plan.loads[i % plan.loads.length];
  const [first, last, , phone] = CONTACTS[i % CONTACTS.length];
  const stop = (address: StopAddress, provisions: LoadTemplate["pickupProvisions"]) => ({
    address, contactFirstName: first, contactLastName: last, contactPhone: phone, notes: plan.business ? "Check in at the gate office." : "", provisions,
  });
  return {
    pickup: stop(plan.origins[i % plan.origins.length], template.pickupProvisions),
    dropoff: stop(plan.destinations[(i * 5 + 1) % plan.destinations.length], template.dropoffProvisions),
    load: template.load,
    handling: template.handling,
    references: {
      declaredValue: Math.round(200 + random() * (plan.business ? 40000 : 1500)),
      po: plan.business ? `PO-${99200 + i * 7}` : "",
      project: plan.business && i % 3 === 0 ? `PRJ-${4100 + i}` : "",
      bol: plan.business ? `BOL-${441900 + i * 3}` : "",
    },
    pickupInstructions: plan.business ? "Check in at Guard Shack B. PPE required (hard hat, safety glasses)." : "",
    dropoffInstructions: plan.business ? "Dock doors 42–48 only. Must present TWIC at gate." : "Call when 10 minutes out.",
    photos: [],
    speed: i % 4 === 1 ? "express" : "standard",
    scheduledFor: "",
    extendedWait: false,
    payment: plan.payment,
    branch: plan.branches.length ? plan.branches[i % plan.branches.length] : "",
  };
}

export function buildSeedDeliveries(plan: SeedPlan): DeliveryOrder[] {
  return Array.from({ length: plan.count }, (_, i) => {
    const id = `#ORD-${plan.firstId - i}`;
    const random = seededRandom(hashSeed(`${plan.customerId}${id}`));
    const draft = draftFor(plan, i, random);
    const quote = quoteDelivery(draft);
    const offers = buildOffers(id, draft);
    const driver = offers[i % 2].driver;
    const live = i === 0;
    const cancelled = !live && i % 7 === 3;
    const created = live ? plan.now - 45 * MIN : plan.now - (1 + i * 4 + Math.floor(random() * 3)) * 1440 * MIN - Math.floor(random() * 300) * MIN;
    const accepted = created + 6 * MIN;
    const pickedUp = accepted + 40 * MIN;
    const delivered = live ? plan.now + 90_000 : pickedUp + quote.transitMinutes * MIN;
    const events: DeliveryEvent[] = [
      { stage: "searching", at: iso(created) },
      { stage: "choosing", at: iso(created + MIN) },
      { stage: "requested", at: iso(created + 2 * MIN) },
      ...(cancelled
        ? [{ stage: "cancelled" as const, at: iso(created + 3 * MIN), note: "Cancelled by customer" }]
        : [
            { stage: "accepted" as const, at: iso(accepted) },
            { stage: "at-pickup" as const, at: iso(accepted + 25 * MIN) },
            { stage: "in-transit" as const, at: iso(live ? plan.now - 10 * MIN : pickedUp) },
            { stage: "delivered" as const, at: iso(delivered) },
          ]),
    ];
    const [first, last, title] = CONTACTS[i % CONTACTS.length];
    return {
      ...draft,
      id,
      customerId: plan.customerId,
      placedByFirstName: plan.placedBy[0],
      placedByLastName: plan.placedBy[1],
      createdAt: iso(created),
      quote,
      offers,
      declinedDriverIds: [],
      driver: cancelled ? undefined : driver,
      events,
      pod: cancelled
        ? undefined
        : { photo: "delivery-door", signedByFirstName: first, signedByLastName: last, signedByTitle: plan.business ? title : "Recipient", signedAt: iso(delivered), lat: 29 + random() * 2, lng: -96 + random() * 4 },
      rating: !cancelled && !live && i % 3 === 1 ? { stars: 5 - (i % 2), comment: "On time and careful with the load.", at: iso(delivered + 30 * MIN) } : undefined,
      messages: [],
    };
  });
}
