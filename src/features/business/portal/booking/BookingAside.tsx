import { Card } from "../../../../components/Card";
import { cn } from "../../../../lib/cn";
import { OrderRouteMap } from "../../../orders/components/OrderRouteMap";
import { loadSummary } from "../../deliveries/display";
import { stopCoords } from "../../deliveries/geo";
import type { DeliveryDraft } from "../../deliveries/deliveryTypes";
import { RouteStops } from "../components/RouteStops";
import { isComplete } from "./locationsForm";

const STEPS = ["Set Location", "Package Details", "Delivery Options"];

/** Right column: the step list, the route on a real map, and the load so far. */
export function BookingAside({ draft, step }: { draft: DeliveryDraft; step: number }) {
  const routed = isComplete(draft.pickup.address) && isComplete(draft.dropoff.address);
  return (
    <div className="flex flex-col gap-4 lg:sticky lg:top-0">
      <Card className="flex flex-col gap-2">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-3">
            <span className={cn("flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold", i < step ? "bg-success text-white" : i === step ? "bg-primary text-primary-foreground" : "bg-bg text-text-muted")}>{i + 1}</span>
            <span className={cn("text-sm", i === step ? "font-semibold text-text" : "text-text-muted")}>{label}</span>
          </div>
        ))}
      </Card>
      <Card className="flex flex-col gap-3">
        <div className="h-56 overflow-hidden rounded-lg">
          {routed ? (
            <OrderRouteMap pickup={stopCoords(draft.pickup.address)} dropoff={stopCoords(draft.dropoff.address)} />
          ) : (
            <div className="flex h-full items-center justify-center bg-bg px-6 text-center text-sm text-text-muted">Pick both locations to see the route.</div>
          )}
        </div>
        {routed && <RouteStops pickup={draft.pickup.address} dropoff={draft.dropoff.address} />}
        {step > 1 && draft.load.description && <p className="border-t border-border pt-3 text-sm text-text">{loadSummary(draft.load)}</p>}
      </Card>
    </div>
  );
}
