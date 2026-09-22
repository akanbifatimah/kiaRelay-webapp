import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { marketingAreas, marketingMapCenter } from "../data";
import { CustomerAreaMarker } from "./CustomerAreaMarker";

const containerStyle = { width: "100%", height: "100%" };

// Real Google Map, mirroring DispatchMap.tsx's setup — replaces the earlier
// custom CSS bubble layout per the user's direct request for an actual map.
export function CustomerDistributionMap() {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "kiarelay-google-maps",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  if (loadError) {
    return (
      <div className="flex h-56 items-center justify-center rounded-lg bg-bg px-6 text-center text-sm text-text-muted">
        Couldn't load the map. Check the Google Maps API key and its referrer restrictions.
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex h-56 items-center justify-center rounded-lg bg-bg text-sm text-text-muted">
        Loading map…
      </div>
    );
  }

  return (
    <div className="h-56 w-full overflow-hidden rounded-lg">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={marketingMapCenter}
        zoom={6}
        options={{ disableDefaultUI: true, zoomControl: true, gestureHandling: "cooperative" }}
      >
        {marketingAreas.map((area) => (
          <CustomerAreaMarker key={area.id} area={area} />
        ))}
      </GoogleMap>
    </div>
  );
}
