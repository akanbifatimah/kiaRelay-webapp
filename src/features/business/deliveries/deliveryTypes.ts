// Delivery booking shapes (2026-09-30). Mirrored field-for-field in
// kiarelay-customer-mobile/src/types/delivery.ts, so one backend contract
// serves the customer app, this KiaRelay Business portal and admin.
import type { ChatMessage, DeliveryClaim, DeliveryEvent, DeliveryRating, DriverOffer, DriverSummary, PaymentChoice, ProofOfDelivery, Quote } from "./trackingTypes";

export type Provision = "Forklift" | "Dock Leveler" | "Crane";
export type HandlingFlag = "HazMat" | "Fragile" | "Keep Upright" | "Temperature Control" | "Liftgate Required" | "High Value";
export type MeasurementType = "Solid/Dry" | "Liquid";
export type VolumeUnit = "gal" | "L";
export type DeliverySpeed = "standard" | "express" | "scheduled";

export interface StopAddress {
  /** Facility or company, e.g. "Port of Houston, Terminal 4". */
  name: string;
  street: string;
  /** City, state and ZIP are picked from the US lookup, never typed. */
  city: string;
  /** Full state name, e.g. "Texas". */
  state: string;
  zip: string;
}

export interface DeliveryStop {
  address: StopAddress;
  /** Names are always split (user rule, 2026-09-30). */
  contactFirstName: string;
  contactLastName: string;
  contactPhone: string;
  /** Gate, dock or access notes from "Add Details". */
  notes: string;
  provisions: Provision[];
}

export interface LoadDetails {
  description: string;
  category: string;
  /** Filled only when category is "Other". */
  categoryOther: string;
  packaging: string;
  /** Filled only when packaging is "Other". */
  packagingOther: string;
  measurement: MeasurementType;
  /** Inches; Solid/Dry only. */
  lengthIn: number;
  widthIn: number;
  heightIn: number;
  /** Liquid only. */
  volume: number;
  volumeUnit: VolumeUnit;
  weightLbs: number;
  quantity: number;
}

/** PO, Project and BOL numbers are Business-only; Declared Value is on both. */
export interface ReferenceNumbers {
  declaredValue: number;
  po: string;
  project: string;
  bol: string;
}

export interface DeliveryPhoto {
  name: string;
  /** Device URI (mobile) or data URL (web). TODO: server URL once uploads exist. */
  uri: string;
}

export interface DeliveryOrder {
  /** Same "#ORD-####" id space as admin Order Monitoring. */
  id: string;
  /** KR-#####-XX for a business; the owner's email for a personal account. */
  customerId: string;
  placedByFirstName: string;
  placedByLastName: string;
  /** Business branch billed; "" for personal. */
  branch: string;
  createdAt: string;
  pickup: DeliveryStop;
  dropoff: DeliveryStop;
  load: LoadDetails;
  handling: HandlingFlag[];
  references: ReferenceNumbers;
  pickupInstructions: string;
  dropoffInstructions: string;
  photos: DeliveryPhoto[];
  speed: DeliverySpeed;
  /** ISO time for "scheduled", else "". */
  scheduledFor: string;
  /** "I may need extended wait time" (demurrage). */
  extendedWait: boolean;
  payment: PaymentChoice;
  quote: Quote;
  offers: DriverOffer[];
  declinedDriverIds: string[];
  driver?: DriverSummary;
  events: DeliveryEvent[];
  pod?: ProofOfDelivery;
  rating?: DeliveryRating;
  claim?: DeliveryClaim;
  messages: ChatMessage[];
}

/** A starred address ("Saved Locations", "Send again"). Recents come from order history. */
export interface SavedLocation {
  id: string;
  address: StopAddress;
}

/** Everything the booking wizard collects before an order exists. */
export type DeliveryDraft = Pick<
  DeliveryOrder,
  "pickup" | "dropoff" | "load" | "handling" | "references" | "pickupInstructions" | "dropoffInstructions" | "photos" | "speed" | "scheduledFor" | "extendedWait" | "payment" | "branch"
>;
