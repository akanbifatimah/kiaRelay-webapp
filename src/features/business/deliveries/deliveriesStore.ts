import { useMemo } from "react";
import { createStore, useStore } from "../../../lib/createStore";
import { ACME_ID, ACME_SAVED, buildAcmeDeliveries } from "./acmeSeed";
import type { DeliveryOrder, SavedLocation } from "./deliveryTypes";

// Every customer delivery in this browser session (2026-09-30): the Acme
// demo history plus anything booked in the KiaRelay Business portal. Admin's
// Order Monitoring, customer order history and invoices read the same list,
// so a portal booking shows up there too. Session-only, like the other admin
// stores (user decision: no persistence ahead of the backend).
// TODO: GET /deliveries (portal: GET /customers/:id/deliveries).
export const deliveriesStore = createStore<DeliveryOrder[]>(buildAcmeDeliveries());

const savedStore = createStore<Record<string, SavedLocation[]>>({ [ACME_ID]: ACME_SAVED });

export const useDeliveries = () => useStore(deliveriesStore);
export const getDeliveries = () => deliveriesStore.get();
export const findDelivery = (id: string) => deliveriesStore.get().find((order) => order.id === id);

/** One company's deliveries, newest first. */
export function useCustomerDeliveries(customerId: string | undefined): DeliveryOrder[] {
  const all = useDeliveries();
  return useMemo(() => all.filter((order) => order.customerId === customerId), [all, customerId]);
}

export function upsertDelivery(order: DeliveryOrder): void {
  deliveriesStore.set((prev) => (prev.some((o) => o.id === order.id) ? prev.map((o) => (o.id === order.id ? order : o)) : [order, ...prev]));
}

export function updateDelivery(id: string, change: (order: DeliveryOrder, now: number) => DeliveryOrder): DeliveryOrder | undefined {
  const order = findDelivery(id);
  if (!order) return undefined;
  const next = change(order, Date.now());
  upsertDelivery(next);
  return next;
}

const NO_SAVED: SavedLocation[] = [];

export function useSavedLocations(customerId: string | undefined): SavedLocation[] {
  const all = useStore(savedStore);
  return (customerId ? all[customerId] : undefined) ?? NO_SAVED;
}

export function setSavedLocations(customerId: string, saved: SavedLocation[]): void {
  savedStore.set((prev) => ({ ...prev, [customerId]: saved }));
}

export const getSavedLocations = (customerId: string) => savedStore.get()[customerId] ?? NO_SAVED;
