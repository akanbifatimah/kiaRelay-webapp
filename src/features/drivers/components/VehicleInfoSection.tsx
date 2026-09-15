import { VehicleHeroCard } from "./VehicleHeroCard";
import { VehicleSpecificationsCard } from "./VehicleSpecificationsCard";
import { VehicleComplianceStatusCard } from "./VehicleComplianceStatusCard";
import { VehicleStatTilesRow } from "./VehicleStatTilesRow";
import { getVehicleInfo } from "../vehicleInfoDetail";

export function VehicleInfoSection({ driverId }: { driverId: string }) {
  const vehicle = getVehicleInfo(driverId);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <VehicleHeroCard assignedSince={vehicle.assignedSince} operationalStatus={vehicle.operationalStatus} />
        </div>
        <div className="flex flex-col gap-4">
          <VehicleSpecificationsCard
            make={vehicle.make}
            model={vehicle.model}
            year={vehicle.year}
            plate={vehicle.plate}
            cargoCapacity={vehicle.cargoCapacity}
          />
          <VehicleComplianceStatusCard rows={vehicle.compliance} />
        </div>
      </div>
      <VehicleStatTilesRow
        efficiencyMpg={vehicle.efficiencyMpg}
        odometerMiles={vehicle.odometerMiles}
        nextServiceMiles={vehicle.nextServiceMiles}
      />
    </div>
  );
}
