import { SlidersHorizontal } from "lucide-react";
import { Button } from "../../../components/Button";
import type { DriverStatus } from "../driverRoster";

interface DriverFilterBarProps {
  vehicleType: string;
  onVehicleTypeChange: (value: string) => void;
  vehicleTypes: string[];
  status: DriverStatus | "all";
  onStatusChange: (value: DriverStatus | "all") => void;
}

const statusOptions: { value: DriverStatus | "all"; label: string }[] = [
  { value: "all", label: "Status: All" },
  { value: "online", label: "Online" },
  { value: "in-transit", label: "In Transit" },
  { value: "offline", label: "Offline" },
  { value: "delivered", label: "Delivered" },
  { value: "suspended", label: "Suspended" },
];

// "More Filters" has no design behind it yet — visual-only, same precedent as
// CustomersFilterBar's Date Range/Sort controls.
export function DriverFilterBar({
  vehicleType,
  onVehicleTypeChange,
  vehicleTypes,
  status,
  onStatusChange,
}: DriverFilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        value={vehicleType}
        onChange={(event) => onVehicleTypeChange(event.target.value)}
        className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text"
      >
        <option value="all">All Vehicle Types</option>
        {vehicleTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>
      <select
        value={status}
        onChange={(event) => onStatusChange(event.target.value as DriverStatus | "all")}
        className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text"
      >
        {statusOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <Button type="button" variant="ghost">
        <SlidersHorizontal className="h-4 w-4" />
        More Filters
      </Button>
    </div>
  );
}
