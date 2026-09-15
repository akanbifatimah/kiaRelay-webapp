import { StatTile } from "../../../components/StatTile";

interface VehicleStatTilesRowProps {
  efficiencyMpg: number;
  odometerMiles: number;
  nextServiceMiles: number;
}

export function VehicleStatTilesRow({ efficiencyMpg, odometerMiles, nextServiceMiles }: VehicleStatTilesRowProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <StatTile label="Efficiency" value={`${efficiencyMpg || "—"} MPG Avg`} accent="primary" />
      <StatTile label="Odometer" value={`${odometerMiles.toLocaleString()} Miles`} accent="neutral" />
      <StatTile label="Next Service" value={`${nextServiceMiles.toLocaleString()} Miles`} accent="neutral" />
    </div>
  );
}
