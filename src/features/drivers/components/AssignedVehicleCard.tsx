import { Truck, ChevronRight } from "lucide-react";
import { Card } from "../../../components/Card";
import type { DriverVehicleAssignment } from "../driverDetails";

interface AssignedVehicleCardProps {
  vehicle: DriverVehicleAssignment;
  /** Opens the profile's Vehicle tab. */
  onViewDetails: () => void;
}

// Read-only since TC-12 (2026-09-28): admins assign *rides* to drivers, not
// vehicles. This card only shows the vehicle registered to the driver
// ("Assign Ride" lives in the profile header). Vehicle records are managed
// through driver onboarding and the Vehicle tab.
export function AssignedVehicleCard({ vehicle, onViewDetails }: AssignedVehicleCardProps) {
  const hasVehicle = vehicle.name !== "Unassigned";

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-label text-text-muted">Driver's Vehicle</h3>
        <button type="button" onClick={onViewDetails} className="flex items-center gap-0.5 text-xs font-medium text-primary hover:underline">
          Vehicle details
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {!hasVehicle ? (
        <div className="flex items-center gap-2 text-text-muted">
          <Truck className="h-4 w-4" />
          <span className="font-medium">No vehicle on file</span>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-primary" />
            <span className="font-medium text-text">{vehicle.name}</span>
          </div>
          <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
            <div>
              <p className="text-label text-text-muted">VIN</p>
              <p className="text-text">{vehicle.vin || "—"}</p>
            </div>
            <div>
              <p className="text-label text-text-muted">Plate Number</p>
              <p className="text-text">{vehicle.plate || "—"}</p>
            </div>
            <div>
              <p className="text-label text-text-muted">Payload Capacity</p>
              <p className="text-text">{vehicle.payloadCapacity || "—"}</p>
            </div>
          </div>
        </>
      )}
    </Card>
  );
}
