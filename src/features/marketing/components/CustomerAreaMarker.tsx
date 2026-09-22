import { OverlayView } from "@react-google-maps/api";
import type { MarketingArea } from "../data";

const maxCustomerCount = 2340; // Houston Metro — the largest area, used to scale marker size.

interface CustomerAreaMarkerProps {
  area: MarketingArea;
}

// Mirrors DriverMarker/OrderMarker's OverlayView pill pattern from Dispatch —
// a translucent orange circle sized by customer count, with the area name
// inside, sitting on a real Google Map instead of a custom bubble layout.
export function CustomerAreaMarker({ area }: CustomerAreaMarkerProps) {
  const size = 56 + Math.round((area.customerCount / maxCustomerCount) * 56);

  return (
    <OverlayView
      position={{ lat: area.lat, lng: area.lng }}
      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
      getPixelPositionOffset={(width, height) => ({ x: -width / 2, y: -height / 2 })}
    >
      <div
        title={`${area.name} — ${area.customerCount.toLocaleString()} customers`}
        className="flex items-center justify-center rounded-full border-2 border-primary/50 bg-primary/15 text-center text-xs font-medium text-text shadow-sm"
        style={{ width: size, height: size }}
      >
        <span className="px-1 leading-tight">{area.name}</span>
      </div>
    </OverlayView>
  );
}
