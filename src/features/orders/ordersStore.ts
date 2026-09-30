import { useMemo } from "react";
import { createStore, useStore } from "../../lib/createStore";
import type { TimelineStep } from "../../components/Timeline";
import { toAdminOrder } from "../business/deliveries/adminBridge";
import { cancelDelivery } from "../business/deliveries/deliveryActions";
import { findDelivery, getDeliveries, updateDelivery, useDeliveries } from "../business/deliveries/deliveriesStore";
import { dropFuture, isMatching, requestEvents, stageOf } from "../business/deliveries/deliverySim";
import { generatedOrders, type Order } from "./data";

// Session-wide order list (2026-09-28), so a reassignment made in the order
// panel (TC-13) or from a driver's profile (TC-12, "Assign Ride") shows up on
// Orders and on both drivers' profiles until a reload.
// Customer-portal orders (2026-09-30) aren't copied in: they're derived live
// from the delivery store, so a portal booking appears here immediately and
// an admin reassign/cancel reaches the customer too.
// TODO: replace with the Order Monitoring API (GET /orders,
// POST /orders/:id/reassign, POST /orders/:id/cancel).
const ordersStore = createStore<Order[]>(generatedOrders);

/** Extra timeline steps per order, appended after its base timeline. */
const eventsStore = createStore<Record<string, TimelineStep[]>>({});

export function useOrders(): Order[] {
  const rows = useStore(ordersStore);
  const deliveries = useDeliveries();
  return useMemo(() => [...deliveries.map((delivery) => toAdminOrder(delivery)), ...rows], [deliveries, rows]);
}
export const useOrderEvents = () => useStore(eventsStore);
export const getOrders = () => [...getDeliveries().map((delivery) => toAdminOrder(delivery)), ...ordersStore.get()];

export const REASSIGN_REASONS = [
  { value: "driver-unavailable", label: "Original driver unavailable" },
  { value: "vehicle-issue", label: "Vehicle breakdown / issue" },
  { value: "delay", label: "Running late / SLA at risk" },
  { value: "customer-request", label: "Customer request" },
  { value: "other", label: "Other" },
];

export const reasonLabel = (value: string) => REASSIGN_REASONS.find((reason) => reason.value === value)?.label ?? value;

function stamp(): string {
  return new Date().toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

function addEvent(orderId: string, step: TimelineStep) {
  eventsStore.set((prev) => ({ ...prev, [orderId]: [...(prev[orderId] ?? []), step] }));
}

/** Gives an order to another driver. Pending orders become in transit. */
export function reassignOrder(orderId: string, driver: { id: string; name: string; vehicle: string }, reason: string, actor: string): Order | undefined {
  const previous = getOrders().find((order) => order.id === orderId);
  if (!previous) return undefined;
  if (findDelivery(orderId)) {
    // A customer delivery: give it the roster driver so the customer sees them too.
    const [firstName, ...rest] = driver.name.split(" ");
    updateDelivery(orderId, (order, now) => ({
      ...order,
      // Still matching on the customer's side: the assignment counts as accepted.
      events: isMatching(stageOf(order, now)) ? [...dropFuture(order.events, now), ...requestEvents(now, false, order.scheduledFor)] : order.events,
      driver: { id: driver.id, firstName, lastName: rest.join(" ") || "", avatar: "generic", rating: order.driver?.rating ?? 4.8, trips: order.driver?.trips ?? 0, vehicle: driver.vehicle, plate: order.driver?.plate ?? "—", capabilities: order.driver?.capabilities ?? [] },
    }));
  } else ordersStore.set((prev) =>
    prev.map((order) =>
      order.id === orderId
        ? { ...order, driver: driver.name, driverId: driver.id, driverVehicle: driver.vehicle, status: order.status === "pending" ? "in-transit" : order.status }
        : order,
    ),
  );
  const from = previous.driverId || previous.status !== "pending" ? ` from ${previous.driver}` : "";
  addEvent(orderId, { label: `Reassigned to ${driver.name}${from}`, timestamp: `${stamp()} · ${reasonLabel(reason)} · by ${actor}`, status: "done" });
  return previous;
}

export function cancelOrder(orderId: string, actor: string): void {
  if (findDelivery(orderId)) cancelDelivery(orderId, `Cancelled by KiaRelay (${actor})`);
  else ordersStore.set((prev) => prev.map((order) => (order.id === orderId ? { ...order, status: "cancelled" } : order)));
  addEvent(orderId, { label: "Order cancelled", timestamp: `${stamp()} · by ${actor}`, status: "done" });
}

/** Orders a driver could take over: not finished and not already theirs. */
export function isReassignable(order: Order): boolean {
  return order.status === "pending" || order.status === "in-transit";
}
