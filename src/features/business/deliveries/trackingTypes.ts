// Pricing, driver matching and tracking shapes (2026-09-30). Mirrored in
// kiarelay-customer-mobile/src/types/deliveryTracking.ts.
import type { DeliveryPhoto } from "./deliveryTypes";

export interface PriceLine {
  label: string;
  amount: number;
  /** Charged after the fact (demurrage) rather than quoted up front. */
  accrued?: boolean;
}

export interface Quote {
  lines: PriceLine[];
  total: number;
  miles: number;
  transitMinutes: number;
}

export type PaymentChoice = { kind: "card"; methodId: string; label: string } | { kind: "invoice"; label: string };

/** Which bundled photo to show; each app maps it to its own image file. */
export type DriverAvatar = "driver-1" | "driver-2" | "generic";

export interface DriverSummary {
  id: string;
  firstName: string;
  lastName: string;
  avatar: DriverAvatar;
  rating: number;
  trips: number;
  /** "Ford Transit", "Box Truck". */
  vehicle: string;
  plate: string;
  capabilities: string[];
}

/** One driver offered during matching ("Available Drivers"). */
export interface DriverOffer {
  driver: DriverSummary;
  etaMinutes: number;
  distanceMi: number;
  recommended: boolean;
  /** "Spacious cargo capacity suitable for oversized items." */
  note: string;
}

export type DeliveryStage = "searching" | "choosing" | "requested" | "unavailable" | "accepted" | "at-pickup" | "in-transit" | "delivered" | "cancelled";

/** Stage changes. Future-dated events are the mock's schedule (deliverySim). */
export interface DeliveryEvent {
  stage: DeliveryStage;
  at: string;
  note?: string;
}

export interface ProofOfDelivery {
  /** Image key ("delivery-door") or URI. */
  photo: string;
  signedByFirstName: string;
  signedByLastName: string;
  signedByTitle: string;
  signedAt: string;
  lat: number;
  lng: number;
}

export interface DeliveryRating {
  stars: number;
  comment: string;
  at: string;
}

export interface DeliveryClaim {
  id: string;
  reason: string;
  /** Filled only when reason is "Other". */
  reasonOther: string;
  description: string;
  amount: number;
  photos: DeliveryPhoto[];
  submittedAt: string;
}

export interface ChatMessage {
  id: string;
  from: "customer" | "driver";
  text: string;
  at: string;
}
