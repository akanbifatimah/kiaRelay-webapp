import { cn } from "../../../../lib/cn";
import { cityLine, stopTitle } from "../../deliveries/display";
import type { StopAddress } from "../../deliveries/deliveryTypes";

/** Pickup → drop-off with the dotted connector from the designs. */
export function RouteStops({ pickup, dropoff, compact }: { pickup: StopAddress; dropoff: StopAddress; compact?: boolean }) {
  const stops = [
    { caption: "Pickup", address: pickup, dot: "border-2 border-sidebar bg-surface" },
    { caption: "Drop-off", address: dropoff, dot: "bg-primary" },
  ];
  return (
    <div>
      {stops.map((stop, i) => (
        <div key={stop.caption} className="flex gap-3">
          <div className="flex flex-col items-center pt-1">
            <span className={cn("h-2.5 w-2.5 rounded-full", stop.dot)} />
            {i === 0 && <span className="my-1 w-px flex-1 border-l border-dashed border-text-muted/60" />}
          </div>
          <div className={cn("min-w-0 flex-1", i === 0 && "pb-3")}>
            {!compact && <p className="text-[10px] font-semibold uppercase tracking-wide text-text-muted">{stop.caption}</p>}
            <p className="truncate text-sm font-semibold text-text">{stopTitle(stop.address)}</p>
            <p className="truncate text-xs text-text-muted">{stop.address.name ? `${stop.address.street} · ${cityLine(stop.address)}` : cityLine(stop.address)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
