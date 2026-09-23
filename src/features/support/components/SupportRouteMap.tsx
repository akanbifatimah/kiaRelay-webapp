import { Fragment, useCallback } from "react";
import { GoogleMap, OverlayView, Polyline, useJsApiLoader } from "@react-google-maps/api";
import { Check, Truck } from "lucide-react";
import { cssVar } from "../../../lib/cssVar";
import { cn } from "../../../lib/cn";
import type { LatLng } from "../../../types/geo";

export interface MapRoute {
  id: string;
  path: LatLng[];
  /** Theme token name — resolved at runtime via cssVar(), never raw hex. */
  colorToken: "--color-info" | "--color-primary" | "--color-warning";
  /** Portion of the route already driven — drawn solid, the rest faded. */
  progress?: number;
}

export interface MapMarker {
  id: string;
  position: LatLng;
  kind: "origin" | "destination" | "vehicle" | "hub";
  title: string;
}

const containerStyle = { width: "100%", height: "100%" };

function Marker({ marker }: { marker: MapMarker }) {
  return (
    <OverlayView
      position={marker.position}
      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
      getPixelPositionOffset={(width, height) => ({ x: -width / 2, y: -height / 2 })}
    >
      <div title={marker.title}>
        {marker.kind === "origin" && <span className="block h-4 w-4 rounded-full border-4 border-info/30 bg-info shadow" />}
        {marker.kind === "destination" && (
          <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-info text-white shadow-md">
            <Check className="h-3.5 w-3.5" />
          </span>
        )}
        {marker.kind === "vehicle" && (
          <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-primary text-primary-foreground shadow-md">
            <Truck className="h-3.5 w-3.5" />
          </span>
        )}
        {marker.kind === "hub" && <span className={cn("block h-3.5 w-3.5 rotate-45 rounded-sm border-2 border-white bg-sidebar shadow")} />}
      </div>
    </OverlayView>
  );
}

// Real Google Map shared by the Driver and Customer Support Views (per the
// user's "use actual maps" direction, 2026-09-23). Routes are hand-plotted
// highway waypoints, not a Directions API result.
// TODO: swap each route's path for the backend's live GPS trace / routed
// polyline once the tracking API exists.
export function SupportRouteMap({ routes, markers }: { routes: MapRoute[]; markers: MapMarker[] }) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "kiarelay-google-maps",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const handleLoad = useCallback(
    (map: google.maps.Map) => {
      const bounds = new google.maps.LatLngBounds();
      routes.forEach((route) => route.path.forEach((point) => bounds.extend(point)));
      markers.forEach((marker) => bounds.extend(marker.position));
      map.fitBounds(bounds, 56);
    },
    [routes, markers],
  );

  if (loadError) {
    return (
      <div className="flex h-full items-center justify-center bg-bg px-6 text-center text-sm text-text-muted">
        Couldn't load the map. Check the Google Maps API key and its referrer restrictions.
      </div>
    );
  }
  if (!isLoaded) {
    return <div className="flex h-full items-center justify-center bg-bg text-sm text-text-muted">Loading map…</div>;
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={markers[0]?.position ?? routes[0]?.path[0]}
      zoom={8}
      onLoad={handleLoad}
      options={{ disableDefaultUI: true, zoomControl: true, clickableIcons: false }}
    >
      {routes.map((route) => {
        const color = cssVar(route.colorToken);
        const splitAt = Math.max(1, Math.round((route.path.length - 1) * (route.progress ?? 1)));
        return (
          <Fragment key={route.id}>
            <Polyline path={route.path.slice(0, splitAt + 1)} options={{ strokeColor: color, strokeOpacity: 0.95, strokeWeight: 4 }} />
            {splitAt < route.path.length - 1 && (
              <Polyline path={route.path.slice(splitAt)} options={{ strokeColor: color, strokeOpacity: 0.35, strokeWeight: 4 }} />
            )}
          </Fragment>
        );
      })}
      {markers.map((marker) => (
        <Marker key={marker.id} marker={marker} />
      ))}
    </GoogleMap>
  );
}
