import { MapPin, Navigation } from "lucide-react";
import { Card } from "../../../components/Card";
import { OrderRouteMap } from "../../orders/components/OrderRouteMap";
import type { TicketWorkspace } from "../ticketWorkspace";

// Reuses Orders' OrderRouteMap (same custom pickup/drop-off/current-position
// markers) rather than a second map component — needs
// VITE_GOOGLE_MAPS_API_KEY like every other map in the app.
export function ActiveRouteCard({ route }: { route: TicketWorkspace["route"] }) {
  return (
    <Card className="flex flex-col gap-3">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-text">
        <Navigation className="h-4 w-4 text-text-muted" />
        Active Route
      </h3>
      <div className="relative h-36 overflow-hidden rounded-lg">
        <OrderRouteMap pickup={route.pickup} dropoff={route.dropoff} current={route.current} />
        <span className="absolute left-2 top-2 rounded bg-surface px-2 py-0.5 text-xs font-semibold text-warning shadow">
          Status: {route.statusLabel}
        </span>
      </div>
      <ol className="flex flex-col gap-2 text-sm">
        <li className="flex gap-2">
          <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full border-2 border-sidebar" />
          <div>
            <p className="text-xs text-text-muted">Origin</p>
            <p className="font-medium text-text">{route.origin}</p>
          </div>
        </li>
        <li className="flex gap-2">
          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
          <div>
            <p className="text-xs text-text-muted">Destination</p>
            <p className="font-medium text-text">{route.destination}</p>
          </div>
        </li>
      </ol>
    </Card>
  );
}
