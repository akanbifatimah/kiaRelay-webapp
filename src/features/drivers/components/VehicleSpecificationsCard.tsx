import { Lock } from "lucide-react";
import { Card } from "../../../components/Card";
import type { VehicleInfoDetail } from "../vehicleInfoDetail";

type VehicleSpecificationsCardProps = Pick<VehicleInfoDetail, "make" | "model" | "year" | "plate" | "cargoCapacity">;

export function VehicleSpecificationsCard({ make, model, year, plate, cargoCapacity }: VehicleSpecificationsCardProps) {
  return (
    <Card className="flex flex-col gap-3">
      <h3 className="text-label text-text-muted">Specifications</h3>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-label text-text-muted">Make</p>
          <p className="text-text">{make}</p>
        </div>
        <div>
          <p className="text-label text-text-muted">Model</p>
          <p className="text-text">{model}</p>
        </div>
        <div>
          <p className="text-label text-text-muted">Year</p>
          <p className="text-text">{year || "—"}</p>
        </div>
        <div>
          <p className="text-label text-text-muted">License Plate</p>
          <p className="text-danger">{plate}</p>
        </div>
      </div>
      <div className="flex items-center justify-between rounded-[var(--radius-card)] bg-sidebar px-4 py-3 text-white">
        <div>
          <p className="text-label text-white/60">Cargo Capacity</p>
          <p className="text-lg font-semibold">{cargoCapacity}</p>
        </div>
        <Lock className="h-4 w-4 text-white/60" />
      </div>
    </Card>
  );
}
