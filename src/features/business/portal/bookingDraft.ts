import { createStore, useStore } from "../../../lib/createStore";
import type { DeliveryDraft, DeliveryStop, LoadDetails, StopAddress } from "../deliveries/deliveryTypes";

// The in-progress portal booking (2026-09-30), the web twin of the customer
// app's bookingStore: "Send again" and "Reorder Similar" start it prefilled.

export const emptyAddress = (): StopAddress => ({ name: "", street: "", city: "", state: "", zip: "" });
export const emptyStop = (): DeliveryStop => ({ address: emptyAddress(), contactFirstName: "", contactLastName: "", contactPhone: "", notes: "", provisions: [] });

const emptyLoad = (): LoadDetails => ({
  description: "", category: "", categoryOther: "", packaging: "", packagingOther: "", measurement: "Solid/Dry",
  lengthIn: 0, widthIn: 0, heightIn: 0, volume: 0, volumeUnit: "gal", weightLbs: 0, quantity: 1,
});

export const emptyDraft = (): DeliveryDraft => ({
  pickup: emptyStop(),
  dropoff: emptyStop(),
  load: emptyLoad(),
  handling: [],
  references: { declaredValue: 0, po: "", project: "", bol: "" },
  pickupInstructions: "",
  dropoffInstructions: "",
  photos: [],
  speed: "standard",
  scheduledFor: "",
  extendedWait: false,
  payment: { kind: "invoice", label: "" },
  branch: "",
});

export type DraftOrigin = "new" | "reorder" | "send-again";

interface DraftState {
  draft: DeliveryDraft;
  origin: DraftOrigin;
  /** Bumped by startDraft so a mounted form reloads. */
  version: number;
}

const store = createStore<DraftState>({ draft: emptyDraft(), origin: "new", version: 0 });

export const useBookingDraft = () => useStore(store);
export const getBookingDraft = () => store.get();

export function startDraft(seed: Partial<DeliveryDraft> = {}, origin: DraftOrigin = "new"): void {
  store.set((s) => ({ draft: { ...emptyDraft(), ...seed }, origin, version: s.version + 1 }));
}

export function updateDraft(patch: Partial<DeliveryDraft>): void {
  store.set((s) => ({ ...s, draft: { ...s.draft, ...patch } }));
}
