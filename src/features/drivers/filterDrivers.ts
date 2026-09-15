import type { DriverRecord, DriverStatus } from "./driverRoster";

export interface DriverFilters {
  vehicleType: string;
  status: DriverStatus | "all";
}

export function filterDrivers(drivers: DriverRecord[], filters: DriverFilters): DriverRecord[] {
  return drivers.filter((driver) => {
    if (filters.vehicleType !== "all" && driver.vehicleType !== filters.vehicleType) return false;
    if (filters.status !== "all" && driver.status !== filters.status) return false;
    return true;
  });
}

// Client-side only — exports whatever rows are currently filtered in memory.
// Swap for a real "export" endpoint once the Driver Management API exists.
export function exportDriversToCsv(drivers: DriverRecord[], filename = "drivers.csv"): void {
  const headers = ["ID", "Name", "Vehicle", "Plate", "Status", "Rating", "Deliveries", "On-Time %", "Earnings to Date"];
  const rows = drivers.map((driver) => [
    driver.id,
    driver.name,
    driver.vehicle,
    driver.plate,
    driver.status,
    driver.rating,
    driver.deliveries,
    driver.onTimeRate,
    driver.earnings.toFixed(2),
  ]);
  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
