export interface VehicleComplianceRow {
  label: string;
  sublabel: string;
}

export interface VehicleInfoDetail {
  make: string;
  model: string;
  year: number;
  plate: string;
  assignedSince: string;
  operationalStatus: string;
  cargoCapacity: string;
  compliance: VehicleComplianceRow[];
  efficiencyMpg: number;
  odometerMiles: number;
  nextServiceMiles: number;
}

// TODO: replace with GET /drivers/:id/vehicle once the Driver Management API
// exists. Only Marcus Thorne (DR-08190) has real detail — generic fallback
// below for every other driver id.
const handAuthored: Record<string, VehicleInfoDetail> = {
  "DR-08190": {
    make: "Mercedes-Benz",
    model: "Sprinter",
    year: 2022,
    plate: "TX-9582",
    assignedSince: "Jan 2022",
    operationalStatus: "Active Operational",
    cargoCapacity: "3,500 lbs",
    compliance: [
      { label: "Registration", sublabel: "Valid until Oct 2024" },
      { label: "Insurance", sublabel: "Active - Policy #88219" },
      { label: "Inspection", sublabel: "Last passed 2 months ago" },
    ],
    efficiencyMpg: 22,
    odometerMiles: 34102,
    nextServiceMiles: 40000,
  },
};

function buildGenericDetail(): VehicleInfoDetail {
  return {
    make: "Unassigned",
    model: "—",
    year: 0,
    plate: "—",
    assignedSince: "—",
    operationalStatus: "Unassigned",
    cargoCapacity: "—",
    compliance: [
      { label: "Registration", sublabel: "No vehicle assigned" },
      { label: "Insurance", sublabel: "No vehicle assigned" },
      { label: "Inspection", sublabel: "No vehicle assigned" },
    ],
    efficiencyMpg: 0,
    odometerMiles: 0,
    nextServiceMiles: 0,
  };
}

export function getVehicleInfo(driverId: string): VehicleInfoDetail {
  return handAuthored[driverId] ?? buildGenericDetail();
}
