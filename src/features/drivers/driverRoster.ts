import { handAuthoredDrivers } from "./driverRosterData";

export type DriverStatus = "online" | "in-transit" | "offline" | "delivered" | "suspended";

export interface DriverRecord {
  id: string;
  name: string;
  vehicle: string;
  plate: string;
  vehicleType: string;
  status: DriverStatus;
  rating: number;
  deliveries: number;
  onTimeRate: number;
  earnings: number;
  earningsDeltaPct: number;
}

// TODO: replace with GET /drivers once the Driver Management API exists.
// handAuthoredDrivers (driverRosterData.ts) matches the shared screenshot;
// buildFillerDrivers() below pads the roster so pagination has more than one
// page to page through.
const fillerNames = [
  "Priya Shah",
  "Kevin Walsh",
  "Aisha Bello",
  "Tom Harrington",
  "Sofia Reyes",
  "Daniel Kim",
  "Rachel Adeyemi",
  "Omar Haddad",
];
const fillerVehicles: { vehicle: string; vehicleType: string }[] = [
  { vehicle: "Ford Transit", vehicleType: "Cargo Van" },
  { vehicle: "Mercedes Sprinter", vehicleType: "Sprinter Van" },
  { vehicle: "Iveco Daily", vehicleType: "Box Truck" },
  { vehicle: "Ram ProMaster", vehicleType: "Cargo Van" },
];
const fillerStatuses: DriverStatus[] = ["online", "offline", "in-transit", "delivered", "suspended"];

function buildFillerDrivers(count: number): DriverRecord[] {
  return Array.from({ length: count }, (_, i) => {
    const name = fillerNames[i % fillerNames.length];
    const { vehicle, vehicleType } = fillerVehicles[i % fillerVehicles.length];
    return {
      id: `DR-0${8500 + i}`,
      name: `${name} ${Math.floor(i / fillerNames.length) + 1}`,
      vehicle,
      vehicleType,
      plate: `KR${(4000 + i * 17) % 9000}`,
      status: fillerStatuses[i % fillerStatuses.length],
      rating: Math.round((4 + ((i * 7) % 10) / 10) * 10) / 10,
      deliveries: 200 + i * 37,
      onTimeRate: Math.round((88 + ((i * 3) % 12)) * 10) / 10,
      earnings: 1200 + i * 63.5,
      earningsDeltaPct: Math.round(((i % 5) - 2) * 1.7 * 10) / 10,
    };
  });
}

export const drivers: DriverRecord[] = [...handAuthoredDrivers, ...buildFillerDrivers(28)];

export const vehicleTypes: string[] = Array.from(new Set(drivers.map((d) => d.vehicleType)));

// Flavor numbers for the stats row — not derived from the (much smaller) mock
// array above, same convention as customerOverviewStats/dispatchOverview.
export const driverOverviewStats = {
  totalDrivers: 1248,
  activeToday: 842,
  onlineNow: 6,
  pendingOnboarding: 14,
  flaggedOrSuspended: 6,
};
