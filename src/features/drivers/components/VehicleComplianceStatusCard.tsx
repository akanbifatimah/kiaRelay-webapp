import { CheckCircle2 } from "lucide-react";
import { Card } from "../../../components/Card";
import type { VehicleComplianceRow } from "../vehicleInfoDetail";

export function VehicleComplianceStatusCard({ rows }: { rows: VehicleComplianceRow[] }) {
  return (
    <Card className="flex flex-col gap-3">
      <h3 className="text-label text-text-muted">Compliance Status</h3>
      <div className="flex flex-col gap-3">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-2 text-sm">
            <div>
              <p className="font-medium text-text">{row.label}</p>
              <p className="text-xs text-text-muted">{row.sublabel}</p>
            </div>
            <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
          </div>
        ))}
      </div>
    </Card>
  );
}
