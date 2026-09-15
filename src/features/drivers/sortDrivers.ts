import type { DriverRecord } from "./driverRoster";

export type DriverSortKey = "name" | "vehicle" | "status" | "rating" | "deliveries" | "earnings";
export type SortDirection = "asc" | "desc";

// Client-side only, mirrors sortCustomers.ts.
export function sortDrivers(drivers: DriverRecord[], key: DriverSortKey, direction: SortDirection): DriverRecord[] {
  const sorted = [...drivers].sort((a, b) => {
    let cmp = 0;
    switch (key) {
      case "name":
        cmp = a.name.localeCompare(b.name);
        break;
      case "vehicle":
        cmp = a.vehicle.localeCompare(b.vehicle);
        break;
      case "status":
        cmp = a.status.localeCompare(b.status);
        break;
      case "rating":
        cmp = a.rating - b.rating;
        break;
      case "deliveries":
        cmp = a.deliveries - b.deliveries;
        break;
      case "earnings":
        cmp = a.earnings - b.earnings;
        break;
    }
    return direction === "asc" ? cmp : -cmp;
  });

  return sorted;
}
