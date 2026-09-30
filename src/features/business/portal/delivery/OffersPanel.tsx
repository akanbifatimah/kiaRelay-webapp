import { useState } from "react";
import { ArrowRight, CheckCircle2, Flame, Truck } from "lucide-react";
import { Button } from "../../../../components/Button";
import { cn } from "../../../../lib/cn";
import { requestDriver } from "../../deliveries/deliveryActions";
import { ALL_CAPABILITIES } from "../../deliveries/driverPool";
import type { DeliveryOrder } from "../../deliveries/deliveryTypes";
import type { DriverOffer } from "../../deliveries/trackingTypes";
import { DriverPhoto, DriverRow } from "./DriverBits";

/** "Available Drivers", then the chosen driver's detail with "Choose …". */
export function OffersPanel({ order }: { order: DeliveryOrder }) {
  const offers = order.offers.filter((o) => !order.declinedDriverIds.includes(o.driver.id));
  const [selected, setSelected] = useState<DriverOffer | undefined>();

  if (selected) {
    const { driver } = selected;
    return (
      <div className="flex flex-col gap-4">
        <DriverRow driver={driver} subtitle={`${driver.trips} deliveries · ${selected.etaMinutes} min away`} call={false} />
        <div className="flex gap-3 rounded-lg bg-bg p-3">
          <Flame className="h-4 w-4 shrink-0 text-primary" />
          <div>
            <p className="text-sm font-semibold text-text">{selected.recommended ? "Recommended for your package size" : "Available near your pickup"}</p>
            <p className="text-xs text-text-muted">
              {driver.vehicle} · {selected.note}
            </p>
          </div>
        </div>
        <ul className="flex flex-wrap gap-4">
          {ALL_CAPABILITIES.map((c) => {
            const has = driver.capabilities.includes(c);
            return (
              <li key={c} className={cn("flex items-center gap-1 text-xs", has ? "text-text" : "text-text-muted/60")}>
                <CheckCircle2 className={cn("h-4 w-4", has ? "text-success" : "text-text-muted/40")} />
                {c}
              </li>
            );
          })}
        </ul>
        <Button onClick={() => requestDriver(order.id, driver.id)} className="flex items-center justify-center gap-2">
          Choose {driver.firstName} <ArrowRight className="h-4 w-4" />
        </Button>
        <button type="button" onClick={() => setSelected(undefined)} className="text-sm font-medium text-text-muted hover:text-text">
          See other drivers
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <h2 className="font-semibold text-text">Available Drivers</h2>
      {offers.map((offer) => (
        <button key={offer.driver.id} type="button" onClick={() => setSelected(offer)} className={cn("flex items-center gap-3 rounded-lg border p-3 text-left hover:bg-bg", offer.recommended ? "border-2 border-primary" : "border-border")}>
          <DriverPhoto driver={offer.driver} />
          <span className="min-w-0 flex-1">
            <span className="flex flex-wrap items-center gap-2 text-sm font-semibold text-text">
              {offer.driver.firstName} {offer.driver.lastName}
              {offer.recommended && <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">RECOMMENDED</span>}
            </span>
            <span className="flex items-center gap-1 text-xs text-text-muted">
              <Truck className="h-3 w-3" /> {offer.driver.vehicle} · {offer.driver.rating} Rating
            </span>
          </span>
          <span className="text-right">
            <span className="block text-sm font-bold text-text">{offer.etaMinutes} min</span>
            <span className="block text-xs text-text-muted">{offer.distanceMi} mi</span>
          </span>
        </button>
      ))}
      {offers.length === 0 && <p className="py-4 text-center text-sm text-text-muted">No more drivers nearby right now. Cancel and try again shortly.</p>}
    </div>
  );
}
