import { createStore, useStore } from "../../lib/createStore";
import type { TimelineStep } from "../../components/Timeline";
import { orders as seedOrders, type Order } from "./data";

// Session-wide order list (2026-09-28), so a reassignment made in the order
// panel (TC-13) or from a driver's profile (TC-12, "Assign Ride") shows up on
// Orders and on both drivers' profiles until a reload.
// TODO: replace with the Order Monitoring API (GET /orders,
// POST /orders/:id/reassign, POST /orders/:id/cancel).
const ordersStore = createStore<Order[]>(seedOrders);

/** Extra timeline steps per order, appended after its base timeline. */
const eventsStore = createStore<Record<string, TimelineStep[]>>({});

export const useOrders = () => useStore(ordersStore);
export const useOrderEvents = () => useStore(eventsStore);
export const getOrders = () => ordersStore.get();

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
  const previous = ordersStore.get().find((order) => order.id === orderId);
  if (!previous) return undefined;
  ordersStore.set((prev) =>
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
  ordersStore.set((prev) => prev.map((order) => (order.id === orderId ? { ...order, status: "cancelled" } : order)));
  addEvent(orderId, { label: "Order cancelled", timestamp: `${stamp()} · by ${actor}`, status: "done" });
}

/** Orders a driver could take over: not finished and not already theirs. */
export function isReassignable(order: Order): boolean {
  return order.status === "pending" || order.status === "in-transit";
}
