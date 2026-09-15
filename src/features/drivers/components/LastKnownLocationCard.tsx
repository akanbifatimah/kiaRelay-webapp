import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { Card } from "../../../components/Card";
import { CurrentPositionMarker } from "../../../components/CurrentPositionMarker";
import { cn } from "../../../lib/cn";
import type { LatLng } from "../../../types/geo";

interface LastKnownLocationCardProps {
  isLive: boolean;
  position?: LatLng;
  address: string;
}

const containerStyle = { width: "100%", height: "100%" };

// Real map, same non-interactive GoogleMap + CurrentPositionMarker pattern as
// OrderRouteMap.tsx (promoted to src/components/ for this second use) — a
// decorative gray box hid the fact that this card needs real lat/lng from
// the backend, which is exactly what a real map makes obvious.
export function LastKnownLocationCard({ isLive, position, address }: LastKnownLocationCardProps) {
  const { isLoaded } = useJsApiLoader({
    id: "kiarelay-google-maps",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  return (
    <Card className="flex flex-col gap-3">
      <h3 className="text-label text-text-muted">Last Known Location</h3>
      {!position ? (
        <div className="flex h-28 items-center justify-center rounded-lg bg-bg text-xs text-text-muted">
          No location data yet
        </div>
      ) : !isLoaded ? (
        <div className="flex h-28 items-center justify-center rounded-lg bg-bg text-xs text-text-muted">
          Loading map…
        </div>
      ) : (
        <div className="h-28 overflow-hidden rounded-lg border border-border">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={position}
            zoom={12}
            options={{ disableDefaultUI: true, gestureHandling: "none", keyboardShortcuts: false }}
          >
            <CurrentPositionMarker position={position} label="Last Known Position" />
          </GoogleMap>
        </div>
      )}
      <div className={cn("flex items-center gap-1.5 text-xs font-medium", isLive ? "text-success" : "text-text-muted")}>
        <span className={cn("h-1.5 w-1.5 rounded-full", isLive ? "bg-success" : "bg-text-muted")} />
        {isLive ? "Live Tracking Active" : "No live signal"}
      </div>
      <p className="text-xs text-text-muted">{address}</p>
    </Card>
  );
}
