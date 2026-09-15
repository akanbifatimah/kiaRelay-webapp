import { Truck, Pencil } from "lucide-react";
import { Card } from "../../../components/Card";
import { Button } from "../../../components/Button";
import { Tooltip } from "../../../components/Tooltip";
import type { DriverVehicleAssignment } from "../driverDetails";

interface AssignedVehicleCardProps {
  vehicle: DriverVehicleAssignment;
  onAssign: () => void;
}

export function AssignedVehicleCard({ vehicle, onAssign }: AssignedVehicleCardProps) {
  const isUnassigned = vehicle.name === "Unassigned";

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-label text-text-muted">Assigned Vehicle</h3>
        {!isUnassigned && (
          <Tooltip label="Reassign vehicle">
            <button
              type="button"
              aria-label="Reassign vehicle"
              onClick={onAssign}
              className="text-text-muted hover:text-text"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
          </Tooltip>
        )}
      </div>

      {isUnassigned ? (
        <div className="flex flex-col items-start gap-2">
          <div className="flex items-center gap-2 text-text-muted">
            <Truck className="h-4 w-4" />
            <span className="font-medium">No vehicle assigned</span>
          </div>
          <Button size="sm" onClick={onAssign}>
            Assign Vehicle
          </Button>
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
              <p className="text-text">{vehicle.vin}</p>
            </div>
            <div>
              <p className="text-label text-text-muted">Plate Number</p>
              <p className="text-text">{vehicle.plate}</p>
            </div>
            <div>
              <p className="text-label text-text-muted">Payload Capacity</p>
              <p className="text-text">{vehicle.payloadCapacity}</p>
            </div>
          </div>
        </>
      )}
    </Card>
  );
}
