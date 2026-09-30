import { dropFuture, requestEvents, searchEvents } from "./deliverySim";
import { buildOffers, DECLINING_DRIVER_ID, driverById } from "./driverPool";
import { quoteDelivery } from "./pricing";
import { getDeliveries, getSavedLocations, setSavedLocations, updateDelivery, upsertDelivery } from "./deliveriesStore";
import type { DeliveryDraft, DeliveryOrder, StopAddress } from "./deliveryTypes";
import type { DeliveryClaim } from "./trackingTypes";

// Portal delivery actions (2026-09-30), the same calls as the customer
// app's src/mocks/deliveryApi.ts.
// TODO: POST /deliveries, /deliveries/:id/request-driver, /cancel, /rating,
// /claims, /messages; PUT /saved-locations.

const iso = (ms: number) => new Date(ms).toISOString();

function nextOrderId(): string {
  const ids = getDeliveries().map((o) => Number(o.id.replace(/\D/g, "")));
  return `#ORD-${Math.max(5200, ...ids) + 1}`;
}

export function placeDelivery(customerId: string, placedBy: { firstName: string; lastName: string }, draft: DeliveryDraft): DeliveryOrder {
  const id = nextOrderId();
  const now = Date.now();
  const order: DeliveryOrder = {
    ...draft,
    id,
    customerId,
    placedByFirstName: placedBy.firstName,
    placedByLastName: placedBy.lastName,
    createdAt: iso(now),
    quote: quoteDelivery(draft),
    offers: buildOffers(id, draft),
    declinedDriverIds: [],
    events: searchEvents(now),
    messages: [],
  };
  upsertDelivery(order);
  return order;
}

export function requestDriver(orderId: string, driverId: string): void {
  updateDelivery(orderId, (order, now) => {
    const events = [...dropFuture(order.events, now), ...requestEvents(now, driverId === DECLINING_DRIVER_ID, order.scheduledFor)];
    const deliveredAt = events.find((event) => event.stage === "delivered")?.at;
    const { dropoff } = order;
    return {
      ...order,
      driver: driverById(driverId),
      events,
      pod: deliveredAt
        ? { photo: "delivery-door", signedByFirstName: dropoff.contactFirstName || "Front", signedByLastName: dropoff.contactLastName || "Desk", signedByTitle: "Receiving", signedAt: deliveredAt, lat: 29.76, lng: -95.37 }
        : undefined,
    };
  });
}

export function chooseAnotherDriver(orderId: string): void {
  updateDelivery(orderId, (order, now) => ({
    ...order,
    declinedDriverIds: order.driver ? [...order.declinedDriverIds, order.driver.id] : order.declinedDriverIds,
    driver: undefined,
    pod: undefined,
    events: [...dropFuture(order.events, now), { stage: "choosing", at: iso(now) }],
  }));
}

export function cancelDelivery(orderId: string, note = "Cancelled by customer"): void {
  updateDelivery(orderId, (order, now) => ({ ...order, pod: undefined, events: [...dropFuture(order.events, now), { stage: "cancelled", at: iso(now), note }] }));
}

export function rateDelivery(orderId: string, stars: number, comment: string): void {
  updateDelivery(orderId, (order, now) => ({ ...order, rating: { stars, comment: comment.trim(), at: iso(now) } }));
}

export function attachClaim(orderId: string, claim: DeliveryClaim): DeliveryOrder | undefined {
  return updateDelivery(orderId, (order) => ({ ...order, claim }));
}

const REPLIES = ["Got it, thanks!", "On my way — I'll call when I'm at the gate.", "Understood. I'll let you know if anything changes."];

/** Mock driver chat: the driver answers with a canned reply. */
export function sendMessage(orderId: string, text: string): void {
  const append = (from: "customer" | "driver", body: string) =>
    updateDelivery(orderId, (order, now) => ({ ...order, messages: [...order.messages, { id: `m-${now}-${from}`, from, text: body, at: iso(now) }] }));
  append("customer", text.trim());
  setTimeout(() => append("driver", REPLIES[Date.now() % REPLIES.length]), 2500);
}

/** The booking fields of a past order, for "Reorder Similar" / "Send again". */
export function draftFrom(order: DeliveryOrder): DeliveryDraft {
  const { pickup, dropoff, load, handling, references, pickupInstructions, dropoffInstructions, payment, branch } = order;
  return { pickup, dropoff, load, handling, references, pickupInstructions, dropoffInstructions, photos: [], speed: "standard", scheduledFor: "", extendedWait: false, payment, branch };
}

const sameAddress = (a: StopAddress, b: StopAddress) => a.street === b.street && a.zip === b.zip;

export const isSaved = (saved: { address: StopAddress }[], address: StopAddress) => saved.some((l) => sameAddress(l.address, address));

export function toggleSavedLocation(customerId: string, address: StopAddress): void {
  const saved = getSavedLocations(customerId);
  setSavedLocations(customerId, isSaved(saved, address) ? saved.filter((l) => !sameAddress(l.address, address)) : [{ id: `loc-${Date.now()}`, address }, ...saved]);
}
