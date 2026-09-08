import { useCallback } from "react";
import { GoogleMap, Polyline, useJsApiLoader } from "@react-google-maps/api";
import { RoutePinMarker } from "./RoutePinMarker";
import { CurrentPositionMarker } from "./CurrentPositionMarker";

export interface LatLng {
  lat: number;
  lng: number;
}

interface OrderRouteMapProps {
  pickup: LatLng;
  dropoff: LatLng;
  current?: LatLng;
}

const containerStyle = { width: "100%", height: "100%" };

// TODO: replace the straight line with a real routed polyline (Google
// Directions API, via the backend) once available — this is just a visual
// pickup -> drop-off indicator, not an actual road route.
export function OrderRouteMap({ pickup, dropoff, current }: OrderRouteMapProps) {
  const { isLoaded } = useJsApiLoader({
    id: "kiarelay-google-maps",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const handleLoad = useCallback(
    (map: google.maps.Map) => {
      const bounds = new google.maps.LatLngBounds();
      bounds.extend(pickup);
      bounds.extend(dropoff);
      map.fitBounds(bounds, 48);
    },
    [pickup, dropoff],
  );

  if (!isLoaded) {
    return (
      <div className="flex h-32 items-center justify-center rounded-lg bg-bg text-xs text-text-muted">
        Loading map…
      </div>
    );
  }

  return (
    <div className="h-40 overflow-hidden rounded-lg border border-border">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={pickup}
        zoom={13}
        onLoad={handleLoad}
        options={{ disableDefaultUI: true, gestureHandling: "none", keyboardShortcuts: false }}
      >
        <Polyline path={[pickup, dropoff]} options={{ strokeColor: "#f0602e", strokeOpacity: 0.7, strokeWeight: 2 }} />
        <RoutePinMarker position={pickup} label="A" variant="pickup" title="Pickup" />
        <RoutePinMarker position={dropoff} label="B" variant="dropoff" title="Drop-off" />
        {current && <CurrentPositionMarker position={current} />}
      </GoogleMap>
    </div>
  );
}
