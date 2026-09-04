import { OverlayView } from "@react-google-maps/api";
import { Truck } from "lucide-react";
import type { DriverLocation } from "../data";

export function DriverMarker({ driver }: { driver: DriverLocation }) {
  return (
    <OverlayView
      position={{ lat: driver.lat, lng: driver.lng }}
      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
      getPixelPositionOffset={(width, height) => ({ x: -width / 2, y: -height - 6 })}
    >
      <div
        className="flex flex-col items-center gap-1"
        title={`${driver.name} — ${driver.vehicle}`}
      >
        <span className="flex items-center gap-1 whitespace-nowrap rounded-full bg-sidebar px-2 py-1 text-[10px] font-semibold text-white shadow-md">
          <Truck className="h-3 w-3" />
          {driver.name}
        </span>
        <span className="h-2.5 w-2.5 rounded-full border-2 border-white bg-sidebar shadow" />
      </div>
    </OverlayView>
  );
}
