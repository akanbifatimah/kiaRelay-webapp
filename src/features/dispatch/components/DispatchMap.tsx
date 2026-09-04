import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { mapCenter, type DriverLocation, type QueuedOrder } from "../data";
import { DriverMarker } from "./DriverMarker";
import { OrderMarker } from "./OrderMarker";

interface DispatchMapProps {
  drivers: DriverLocation[];
  orders: QueuedOrder[];
}

const containerStyle = { width: "100%", height: "100%" };

export function DispatchMap({ drivers, orders }: DispatchMapProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "kiarelay-google-maps",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  if (loadError) {
    return (
      <div className="flex h-full items-center justify-center bg-bg px-6 text-center text-sm text-text-muted">
        Couldn't load the map. Check the Google Maps API key and its referrer restrictions.
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex h-full items-center justify-center bg-bg text-sm text-text-muted">
        Loading map…
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={mapCenter}
      zoom={10}
      options={{ disableDefaultUI: true, zoomControl: true }}
    >
      {drivers.map((driver) => (
        <DriverMarker key={driver.id} driver={driver} />
      ))}
      {orders.map((order) => (
        <OrderMarker key={order.id} order={order} />
      ))}
    </GoogleMap>
  );
}
