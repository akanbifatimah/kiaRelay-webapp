import { OverlayView } from "@react-google-maps/api";
import { Truck } from "lucide-react";
import type { LatLng } from "./OrderRouteMap";

export function CurrentPositionMarker({ position }: { position: LatLng }) {
  return (
    <OverlayView
      position={position}
      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
      getPixelPositionOffset={(width, height) => ({ x: -width / 2, y: -height - 6 })}
    >
      <div className="flex flex-col items-center gap-1">
        <span className="flex items-center gap-1 whitespace-nowrap rounded-full bg-sidebar px-2 py-1 text-[10px] font-semibold text-white shadow-md">
          <Truck className="h-3 w-3" />
          Current Position
        </span>
        <span className="h-3 w-3 rounded-full border-2 border-white bg-primary shadow" />
      </div>
    </OverlayView>
  );
}
