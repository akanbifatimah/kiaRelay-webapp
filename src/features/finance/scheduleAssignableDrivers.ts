export interface AssignableDriver {
  id: string;
  name: string;
  classLabel: string;
  driverIdLabel: string;
  fleet: string;
  region: string;
  currentScheduleId: string;
  joinedDate: string;
}

// TODO: replace with GET /finance/payout-schedules/drivers once the
// Financial Management API exists. Independent from features/drivers'
// own roster ids — same documented independent-id-space precedent as
// Orders vs Invoices (see CLAUDE.md).
const handAuthored: AssignableDriver[] = [
  { id: "AD-1", name: "Elena Rodriguez", classLabel: "Class A CDL", driverIdLabel: "DRV-99420", fleet: "Northern Express", region: "Northeast", currentScheduleId: "SCH-END-OF-DAY", joinedDate: "Oct 12, 2021" },
  { id: "AD-2", name: "Samuel Thompson", classLabel: "Heavy Haul Specialist", driverIdLabel: "DRV-51256", fleet: "Midwest Logistics", region: "Midwest", currentScheduleId: "SCH-FIRST-OF-WEEK", joinedDate: "Jan 05, 2020" },
  { id: "AD-3", name: "Liam Zhang", classLabel: "Class A CDL", driverIdLabel: "DRV-55612", fleet: "Coastal Carriers", region: "West", currentScheduleId: "SCH-ON-DEMAND", joinedDate: "May 22, 2023" },
  { id: "AD-4", name: "Michael Kovic", classLabel: "Class A CDL", driverIdLabel: "DRV-88219", fleet: "Northern Express", region: "Northeast", currentScheduleId: "SCH-END-OF-DAY", joinedDate: "Feb 14, 2022" },
];

const fillerFirstNames = ["Maria", "David", "Aisha", "Noah", "Yuki", "Carlos", "Hannah", "Omar"];
const fillerLastNames = ["Garcia", "Smith", "Bello", "Turner", "Tanaka", "Mendez", "Baker", "Farouk"];
const fillerFleets = ["Northern Express", "Midwest Logistics", "Coastal Carriers", "Southern Freight", "Pioneer Transport"];
const fillerRegions = ["Northeast", "Midwest", "West", "South"];
const fillerScheduleIds = ["SCH-END-OF-DAY", "SCH-FIRST-OF-WEEK", "SCH-BI-WEEKLY", "SCH-ON-DEMAND"];
const fillerClasses = ["Class A CDL", "Class B CDL", "Heavy Haul Specialist", "Express Van"];

function buildFillerDrivers(count: number): AssignableDriver[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `AD-0${100 + i}`,
    name: `${fillerFirstNames[i % fillerFirstNames.length]} ${fillerLastNames[(i * 3) % fillerLastNames.length]}`,
    classLabel: fillerClasses[i % fillerClasses.length],
    driverIdLabel: `DRV-${10000 + i}`,
    fleet: fillerFleets[i % fillerFleets.length],
    region: fillerRegions[i % fillerRegions.length],
    currentScheduleId: fillerScheduleIds[i % fillerScheduleIds.length],
    joinedDate: `${["Jan", "Apr", "Jul", "Nov"][i % 4]} ${1 + (i % 28)}, ${2019 + (i % 5)}`,
  }));
}

export const assignableDrivers: AssignableDriver[] = [...handAuthored, ...buildFillerDrivers(748)];

export interface AssignableDriverFilters {
  search: string;
  fleet: string | "all";
  region: string | "all";
  scheduleId: string | "all";
}

export const assignableFleetOptions = Array.from(new Set(assignableDrivers.map((d) => d.fleet)));
export const assignableRegionOptions = Array.from(new Set(assignableDrivers.map((d) => d.region)));

export function filterAssignableDrivers(rows: AssignableDriver[], filters: AssignableDriverFilters): AssignableDriver[] {
  const term = filters.search.trim().toLowerCase();
  return rows.filter((row) => {
    if (filters.fleet !== "all" && row.fleet !== filters.fleet) return false;
    if (filters.region !== "all" && row.region !== filters.region) return false;
    if (filters.scheduleId !== "all" && row.currentScheduleId !== filters.scheduleId) return false;
    if (term && !row.name.toLowerCase().includes(term) && !row.driverIdLabel.toLowerCase().includes(term)) return false;
    return true;
  });
}
