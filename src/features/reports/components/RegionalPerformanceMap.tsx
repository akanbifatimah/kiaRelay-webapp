import { useCallback } from "react";
import { CircleF, GoogleMap, OverlayView, useJsApiLoader } from "@react-google-maps/api";
import { cssVar } from "../../../lib/cssVar";
import { OTD_BAND_META, otdBand, type Region } from "../regions";

const containerStyle = { width: "100%", height: "100%" };

interface RegionalPerformanceMapProps {
  regions: Region[];
  onSelectRegion: (region: Region) => void;
}

// Real Google Map (per the "use actual maps" direction) — one service-area
// circle per region, colored by its on-time band via theme tokens resolved
// with cssVar() (the Maps API can't take var(...)). Same loader id as every
// other map in the app so the script only loads once.
export function RegionalPerformanceMap({ regions, onSelectRegion }: RegionalPerformanceMapProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "kiarelay-google-maps",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const handleLoad = useCallback(
    (map: google.maps.Map) => {
      const bounds = new google.maps.LatLngBounds();
      regions.forEach((region) => bounds.extend(region.center));
      map.fitBounds(bounds, 48);
    },
    [regions],
  );

  if (loadError) {
    return (
      <div className="flex h-full items-center justify-center bg-bg px-6 text-center text-sm text-text-muted">
        Couldn't load the map. Check the Google Maps API key and its referrer restrictions.
      </div>
    );
  }
  if (!isLoaded) return <div className="flex h-full items-center justify-center bg-bg text-sm text-text-muted">Loading map…</div>;

  return (
    <GoogleMap
      // Re-mount per region set so fitBounds re-runs when the state changes.
      key={regions.map((region) => region.id).join()}
      mapContainerStyle={containerStyle}
      onLoad={handleLoad}
      options={{ disableDefaultUI: true, zoomControl: true, gestureHandling: "cooperative", clickableIcons: false }}
    >
      {regions.map((region) => {
        const color = cssVar(OTD_BAND_META[otdBand(region.onTimeRate)].token);
        return (
          <CircleF
            key={region.id}
            center={region.center}
            radius={region.radius}
            onClick={() => onSelectRegion(region)}
            options={{ fillColor: color, fillOpacity: 0.3, strokeColor: color, strokeWeight: 2, clickable: true }}
          />
        );
      })}
      {regions.map((region) => (
        <OverlayView
          key={`${region.id}-label`}
          position={region.center}
          mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          getPixelPositionOffset={(width, height) => ({ x: -width / 2, y: -height / 2 })}
        >
          <button
            type="button"
            onClick={() => onSelectRegion(region)}
            className="whitespace-nowrap rounded-md bg-surface/95 px-1.5 py-0.5 text-[10px] font-semibold text-text shadow"
          >
            {region.name} <span className={OTD_BAND_META[otdBand(region.onTimeRate)].text}>{region.onTimeRate.toFixed(1)}%</span>
          </button>
        </OverlayView>
      ))}
    </GoogleMap>
  );
}
