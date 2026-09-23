import { Route } from "lucide-react";
import { Card } from "../../../components/Card";
import type { DriverSupportProfile } from "../driverSupport";
import { SupportRouteMap } from "./SupportRouteMap";

export function LoadTrackingCard({ load }: { load: DriverSupportProfile["load"] }) {
  const currentIndex = Math.round((load.path.length - 1) * load.progress);
  const markers = [
    { id: "origin", position: load.path[0], kind: "origin" as const, title: load.origin },
    { id: "destination", position: load.path[load.path.length - 1], kind: "destination" as const, title: load.destination },
    { id: "vehicle", position: load.path[currentIndex], kind: "vehicle" as const, title: "Current position" },
  ];

  return (
    <Card className="flex flex-col gap-0 overflow-hidden p-0">
      <div className="flex items-center justify-between px-5 py-4">
        <h2 className="flex items-center gap-2 text-base font-semibold text-text">
          <Route className="h-4 w-4 text-info" />
          Current Load Tracking
        </h2>
        <span className="text-xs font-medium text-text-muted">{load.trackingId}</span>
      </div>
      <div className="relative h-72">
        <SupportRouteMap routes={[{ id: "load", path: load.path, colorToken: "--color-info", progress: load.progress }]} markers={markers} />
        <div className="pointer-events-none absolute inset-x-3 bottom-3 grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-border bg-surface px-3 py-2 shadow">
            <p className="text-xs text-text-muted">Origin</p>
            <p className="font-semibold text-text">{load.origin}</p>
            <p className="text-xs text-text-muted">{load.departed}</p>
          </div>
          <div className="rounded-lg border border-border border-l-4 border-l-info bg-surface px-3 py-2 shadow">
            <p className="text-xs font-medium text-info">ETA Destination</p>
            <p className="font-semibold text-text">{load.destination}</p>
            <p className="text-xs text-text-muted">{load.eta}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
