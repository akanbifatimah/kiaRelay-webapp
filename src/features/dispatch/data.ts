import type { DeliveryType } from "../../components/TagChip";

export interface DriverLocation {
  id: string;
  name: string;
  vehicle: string;
  lat: number;
  lng: number;
  onTimeRate: number;
  distanceMiles: number;
  etaMinutes: number;
  recommended?: boolean;
}

export type RiskLevel = "Low" | "Medium" | "High";

export interface QueuedOrder {
  id: string;
  type: DeliveryType;
  title: string;
  packageDescription: string;
  weightKg: number;
  fragile?: boolean;
  riskLevel: RiskLevel;
  distanceMiles: number;
  etaMinutes: number;
  pickupLabel: string;
  dropoffLabel: string;
  pickupAddress: string;
  dropoffAddress: string;
  pickupLat: number;
  pickupLng: number;
  waitTimeLabel: string;
}

// Houston, TX — matches the PRD's primary market (§2.3).
export const mapCenter = { lat: 29.7604, lng: -95.3698 };

// TODO: replace with the real Dispatch API (live driver GPS + order queue)
// once it exists.
export const driverLocations: DriverLocation[] = [
  { id: "drv-1", name: "John D.", vehicle: "Ford Transit #402", lat: 29.79, lng: -95.41, onTimeRate: 98, distanceMiles: 2.3, etaMinutes: 8, recommended: true },
  { id: "drv-2", name: "Sarah M.", vehicle: "Sprinter Van #210", lat: 29.72, lng: -95.3, onTimeRate: 96, distanceMiles: 4.1, etaMinutes: 14 },
  { id: "drv-3", name: "Michael T.", vehicle: "Hino Box Truck #830", lat: 29.68, lng: -95.45, onTimeRate: 92, distanceMiles: 5.8, etaMinutes: 19 },
  { id: "drv-4", name: "Elena R.", vehicle: "Ford Transit #118", lat: 29.85, lng: -95.35, onTimeRate: 94, distanceMiles: 6.4, etaMinutes: 21 },
];

export const queuedOrders: QueuedOrder[] = [
  {
    id: "#KR-9944",
    type: "healthcare",
    title: "Emergency Room Supplies",
    packageDescription: "Critical Care Items",
    weightKg: 3.2,
    riskLevel: "High",
    distanceMiles: 12.3,
    etaMinutes: 24,
    pickupLabel: "Hub A",
    dropoffLabel: "Hospital Main",
    pickupAddress: "842 Industrial Blvd, Houston TX",
    dropoffAddress: "2102 Westmoreland Rd, Houston TX",
    pickupLat: 29.75,
    pickupLng: -95.36,
    waitTimeLabel: "15m 20s",
  },
  {
    id: "#KR-8812",
    type: "express",
    title: "Global Tech Solutions",
    packageDescription: "High-Value Electronics",
    weightKg: 2.4,
    fragile: true,
    riskLevel: "Medium",
    distanceMiles: 8.4,
    etaMinutes: 16,
    pickupLabel: "Hub B",
    dropoffLabel: "Residential North",
    pickupAddress: "410 Commerce St, Houston TX",
    dropoffAddress: "77 Oak Hollow Dr, Houston TX",
    pickupLat: 29.8,
    pickupLng: -95.4,
    waitTimeLabel: "04m 12s",
  },
  {
    id: "#KR-7703",
    type: "standard",
    title: "Tech Supplies Shipping",
    packageDescription: "Office Equipment",
    weightKg: 5.0,
    riskLevel: "Low",
    distanceMiles: 5.2,
    etaMinutes: 12,
    pickupLabel: "Hub C",
    dropoffLabel: "Business Park",
    pickupAddress: "901 Main St, Houston TX",
    dropoffAddress: "1200 Bay Area Blvd, Houston TX",
    pickupLat: 29.7,
    pickupLng: -95.28,
    waitTimeLabel: "03m 15s",
  },
  {
    id: "#KR-7702",
    type: "standard",
    title: "Gourmet Delights Delivery",
    packageDescription: "Perishable Goods",
    weightKg: 1.5,
    riskLevel: "Low",
    distanceMiles: 3.1,
    etaMinutes: 9,
    pickupLabel: "Hub D",
    dropoffLabel: "Downtown",
    pickupAddress: "550 Distribution Way, Houston TX",
    dropoffAddress: "300 Main St, Houston TX",
    pickupLat: 29.77,
    pickupLng: -95.35,
    waitTimeLabel: "01m 02s",
  },
];

export const dispatchOverview = {
  activeOrders: 42,
  activeDrivers: 56,
  pending: 128,
  region: "TX Gulf Coast",
};
