import { OverlayView } from "@react-google-maps/api";
import { cn } from "../../../lib/cn";
import type { LatLng } from "./OrderRouteMap";

interface RoutePinMarkerProps {
  position: LatLng;
  label: string;
  variant: "pickup" | "dropoff";
  title: string;
}

const variantClasses: Record<RoutePinMarkerProps["variant"], string> = {
  pickup: "bg-success",
  dropoff: "bg-info",
};

export function RoutePinMarker({ position, label, variant, title }: RoutePinMarkerProps) {
  return (
    <OverlayView
      position={position}
      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
      getPixelPositionOffset={(width, height) => ({ x: -width / 2, y: -height })}
    >
      <div
        title={title}
        className={cn(
          "flex h-6 w-6 items-center justify-center rounded-full border-2 border-white text-xs font-bold text-white shadow-md",
          variantClasses[variant],
        )}
      >
        {label}
      </div>
    </OverlayView>
  );
}
