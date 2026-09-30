import type { DeliveryDraft } from "./deliveryTypes";
import type { DriverOffer, DriverSummary } from "./trackingTypes";
import { hashSeed, seededRandom } from "../../../lib/seededRandom";

// Mock drivers for matching (2026-09-30), same as the customer app's
// src/mocks/driverPool.ts. TODO: GET /deliveries/:id/offers — the dispatch
// service ranks real nearby drivers.

export const DRIVER_POOL: DriverSummary[] = [
  { id: "DRV-2041", firstName: "Marcus", lastName: "Williams", avatar: "driver-1", rating: 4.9, trips: 128, vehicle: "Ford Transit", plate: "RELAY-88", capabilities: ["Liftgate", "GPS Active"] },
  { id: "DRV-2077", firstName: "Sarah", lastName: "Johnson", avatar: "driver-2", rating: 4.8, trips: 214, vehicle: "Cargo Van", plate: "RELAY-41", capabilities: ["GPS Active", "Refrigerated"] },
  { id: "DRV-2093", firstName: "Daniel", lastName: "Carter", avatar: "generic", rating: 4.7, trips: 96, vehicle: "Sprinter Van", plate: "RELAY-17", capabilities: ["GPS Active"] },
  { id: "DRV-2102", firstName: "Mike", lastName: "Thompson", avatar: "generic", rating: 4.8, trips: 342, vehicle: "Box Truck", plate: "RELAY-482", capabilities: ["Liftgate", "GPS Active", "HazMat Certified"] },
  { id: "DRV-2118", firstName: "Elena", lastName: "Ruiz", avatar: "driver-2", rating: 4.9, trips: 511, vehicle: "Flatbed Truck", plate: "RELAY-305", capabilities: ["TWIC", "HazMat Certified", "GPS Active"] },
];

/** Every capability the driver sheet lists, lit up when the driver has it. */
export const ALL_CAPABILITIES = ["Liftgate", "GPS Active", "Refrigerated", "HazMat Certified", "TWIC"];

/**
 * Always declines with a vehicle issue, so the "isn't available" screen can
 * be reached on demand. TODO: remove with the mock.
 */
export const DECLINING_DRIVER_ID = "DRV-2093";

const NOTES: Record<string, string> = {
  "Ford Transit": "Spacious cargo capacity suitable for oversized items.",
  "Cargo Van": "Climate-controlled van, ideal for sensitive goods.",
  "Sprinter Van": "Nimble van for quick city runs.",
  "Box Truck": "26ft box truck with liftgate for palletized freight.",
  "Flatbed Truck": "Flatbed rated for heavy industrial and HazMat loads.",
};

export function driverById(id: string): DriverSummary | undefined {
  return DRIVER_POOL.find((driver) => driver.id === id);
}

/** Three nearby drivers for a booking, best match first. */
export function buildOffers(orderId: string, draft: Pick<DeliveryDraft, "load" | "handling">): DriverOffer[] {
  const random = seededRandom(hashSeed(orderId));
  const freight = draft.load.weightLbs * Math.max(1, draft.load.quantity) >= 1000 || draft.handling.includes("HazMat");
  const ids = freight ? ["DRV-2102", "DRV-2118", DECLINING_DRIVER_ID] : ["DRV-2041", "DRV-2077", DECLINING_DRIVER_ID];
  return ids.map((id, i) => {
    const driver = driverById(id) as DriverSummary;
    return {
      driver,
      etaMinutes: 5 + i * 4 + Math.floor(random() * 3),
      distanceMi: Math.round((0.8 + i * 1.3 + random()) * 10) / 10,
      recommended: i === 0,
      note: NOTES[driver.vehicle] ?? "",
    };
  });
}
