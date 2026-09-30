import { MessageSquareText, Phone, Star } from "lucide-react";
import { Tooltip } from "../../../../components/Tooltip";
import type { DriverSummary } from "../../deliveries/trackingTypes";

/** Masked relay line; drivers' own numbers are never shared.
 * TODO: per-delivery proxy numbers from the telephony API. */
export const DRIVER_RELAY_PHONE = "+18005550199";

const PHOTOS: Record<string, string> = { "driver-1": "/business/driver-1.webp", "driver-2": "/business/driver-2.webp" };

export function DriverPhoto({ driver, size = 44 }: { driver: DriverSummary; size?: number }) {
  const style = { width: size, height: size };
  if (PHOTOS[driver.avatar]) return <img src={PHOTOS[driver.avatar]} alt={`${driver.firstName} ${driver.lastName}`} style={style} className="rounded-xl border border-border object-cover" />;
  return (
    <span style={style} className="flex items-center justify-center rounded-xl bg-sidebar text-sm font-semibold text-white">
      {driver.firstName[0]}
      {driver.lastName[0]}
    </span>
  );
}

interface DriverRowProps {
  driver: DriverSummary;
  subtitle?: string;
  onMessage?: () => void;
  call?: boolean;
}

/** Photo, name, rating, and message / call buttons. */
export function DriverRow({ driver, subtitle, onMessage, call = true }: DriverRowProps) {
  return (
    <div className="flex items-center gap-3">
      <DriverPhoto driver={driver} />
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-text">
          {driver.firstName} {driver.lastName}
        </p>
        <p className="flex items-center gap-1 text-xs text-text-muted">
          <Star className="h-3 w-3 fill-warning text-warning" />
          {driver.rating} · {subtitle ?? `${driver.trips} deliveries · ${driver.vehicle}`}
        </p>
      </div>
      {onMessage && (
        <Tooltip label={`Message ${driver.firstName}`}>
          <button type="button" aria-label={`Message ${driver.firstName}`} onClick={onMessage} className="rounded-full bg-bg p-2.5 text-text hover:bg-border">
            <MessageSquareText className="h-4 w-4" />
          </button>
        </Tooltip>
      )}
      {call && (
        <Tooltip label={`Call ${driver.firstName}`}>
          <a href={`tel:${DRIVER_RELAY_PHONE}`} aria-label={`Call ${driver.firstName}`} className="rounded-full bg-sidebar p-2.5 text-white hover:opacity-90">
            <Phone className="h-4 w-4" />
          </a>
        </Tooltip>
      )}
    </div>
  );
}
