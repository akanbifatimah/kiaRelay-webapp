import { Truck } from "lucide-react";
import { Card } from "../../../components/Card";
import type { LatLng } from "../../../types/geo";
import type { ActiveDelivery } from "../customerSupport";
import { SupportRouteMap, type MapMarker, type MapRoute } from "./SupportRouteMap";

const ROUTE_TOKENS: MapRoute["colorToken"][] = ["--color-primary", "--color-info"];

export function ActiveDeliveriesCard({ deliveries, hub }: { deliveries: ActiveDelivery[]; hub: LatLng }) {
  const routes: MapRoute[] = deliveries.map((delivery, index) => ({
    id: delivery.id,
    path: delivery.path,
    colorToken: ROUTE_TOKENS[index % ROUTE_TOKENS.length],
    progress: delivery.progress,
  }));
  const markers: MapMarker[] = [
    { id: "hub", position: hub, kind: "hub", title: "HQ & Main Hub" },
    ...deliveries.flatMap((delivery) => [
      { id: `${delivery.id}-dest`, position: delivery.path[delivery.path.length - 1], kind: "destination" as const, title: `${delivery.id} destination` },
      { id: `${delivery.id}-truck`, position: delivery.path[Math.round((delivery.path.length - 1) * delivery.progress)], kind: "vehicle" as const, title: delivery.id },
    ]),
  ];

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-text">Active Deliveries</h2>
        <span className="rounded bg-bg px-2 py-0.5 text-xs font-medium text-text-muted">{deliveries.length} in Transit</span>
      </div>
      <div className="relative h-64 overflow-hidden rounded-lg border border-border">
        <SupportRouteMap routes={routes} markers={markers} />
        <div className="pointer-events-none absolute inset-x-3 bottom-3 grid grid-cols-2 gap-3">
          {deliveries.map((delivery) => (
            <div key={delivery.id} className="flex items-center justify-between rounded-lg border border-border bg-surface px-3 py-2 shadow">
              <div>
                <p className="text-xs text-text-muted">{delivery.id}</p>
                <p className="text-sm font-semibold text-text">{delivery.eta}</p>
              </div>
              <Truck className="h-4 w-4 text-primary" />
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
