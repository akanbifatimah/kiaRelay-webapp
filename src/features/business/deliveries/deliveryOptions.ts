import type { DeliverySpeed, HandlingFlag, MeasurementType, Provision } from "./deliveryTypes";

// Booking option lists (2026-09-30), same as the customer app's
// src/constants/delivery.ts. Lists ending in "Other" reveal a required
// "Specify…" field.

export const PROVISIONS: Provision[] = ["Forklift", "Dock Leveler", "Crane"];

export const HANDLING_FLAGS: HandlingFlag[] = ["HazMat", "Fragile", "Keep Upright", "Temperature Control", "Liftgate Required", "High Value"];

export const CARGO_CATEGORIES = [
  "General Freight",
  "Hazardous Materials",
  "Industrial Equipment",
  "Chemicals",
  "Construction Materials",
  "Food & Beverage",
  "Medical Supplies",
  "Electronics",
  "Household Goods",
  "Other",
];

export const PACKAGING_TYPES = ["Pallets", "Drum", "Crate", "Boxes", "Tote / IBC", "Envelope", "Loose", "Other"];

export const MEASUREMENT_TYPES: MeasurementType[] = ["Solid/Dry", "Liquid"];

export const CLAIM_REASONS = ["Damaged items", "Lost items", "Late delivery", "Wrong items delivered", "Billing issue", "Other"];

export const SPEED_OPTIONS: Record<DeliverySpeed, { label: string; title: string; subtitle: string; surcharge: number }> = {
  standard: { label: "Standard", title: "Standard delivery", subtitle: "Picked up as soon as a driver accepts", surcharge: 0 },
  express: { label: "Express", title: "Priority delivery", subtitle: "Guaranteed in 2 hours", surcharge: 15 },
  scheduled: { label: "Scheduled", title: "Scheduled delivery", subtitle: "Guaranteed by select date and time", surcharge: 15 },
};

/** Scheduled pickups (the design shows dates only; times are a first pass). */
export const SCHEDULE_TIME_SLOTS = ["8:00 AM", "10:00 AM", "12:00 PM", "2:00 PM", "4:00 PM"];

/** TODO: from Operations Settings / the pricing API. */
export const DEMURRAGE = { freeMinutes: 15, hourlyRate: 45 };

/** Priced add-ons for handling flags. TODO: from the pricing API. */
export const HANDLING_SURCHARGES: Partial<Record<HandlingFlag, { label: string; amount: number }>> = {
  HazMat: { label: "HazMat Premium", amount: 50 },
  "Temperature Control": { label: "Temperature Control", amount: 40 },
  "Liftgate Required": { label: "Liftgate Service", amount: 25 },
  "High Value": { label: "High Value Coverage", amount: 20 },
};

/** Equipment the driver brings when the drop-off needs it. */
export const PROVISION_SURCHARGES: Partial<Record<Provision, { label: string; amount: number }>> = {
  Forklift: { label: "Forklift Rental", amount: 150 },
  Crane: { label: "Crane Service", amount: 350 },
};

/** The display value of a pick-list field that may be "Other". */
export const otherLabel = (value: string, other: string) => (value === "Other" && other ? other : value);
