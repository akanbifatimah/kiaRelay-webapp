import { Radio } from "lucide-react";
import { cn } from "../../../lib/cn";

interface MapStatsOverlayProps {
  activeOrders: number;
  activeDrivers: number;
  pending: number;
  region: string;
}

function Stat({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className="flex flex-col">
      <span className={cn("text-lg leading-tight font-semibold", accent ? "text-primary" : "text-white")}>
        {value}
      </span>
      <span className="text-label text-white/70">{label}</span>
    </div>
  );
}

// TODO: "Live Updates" is a static label for now — wire it to the real
// driver-location polling interval once the Dispatch API exists.
export function MapStatsOverlay({ activeOrders, activeDrivers, pending, region }: MapStatsOverlayProps) {
  return (
    <div className="absolute left-4 top-4 flex flex-wrap items-start gap-2">
      <div className="flex gap-4 rounded-lg bg-sidebar/90 px-4 py-3 shadow-lg">
        <Stat label="Active Orders" value={activeOrders} accent />
        <Stat label="Active Drivers" value={activeDrivers} />
        <Stat label="Pending" value={pending} />
      </div>
      <div className="flex items-center gap-1.5 self-center rounded-full bg-surface px-3 py-1.5 text-xs font-medium text-success shadow-lg">
        <Radio className="h-3.5 w-3.5" />
        Live Updates
      </div>
      <div className="self-center rounded-lg bg-surface px-3 py-1.5 shadow-lg">
        <p className="text-sm font-semibold text-text">{region}</p>
        <p className="text-xs text-text-muted">Fleet monitoring active</p>
      </div>
    </div>
  );
}
