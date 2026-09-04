import { OverlayView } from "@react-google-maps/api";
import { cn } from "../../../lib/cn";
import type { DeliveryType } from "../../../components/TagChip";
import type { QueuedOrder } from "../data";

const pillClasses: Record<DeliveryType, string> = {
  express: "bg-tag-express-bg text-tag-express-fg",
  standard: "bg-tag-standard-bg text-tag-standard-fg",
  freight: "bg-tag-freight-bg text-tag-freight-fg",
  healthcare: "bg-tag-healthcare-bg text-tag-healthcare-fg",
  overnight: "bg-tag-overnight-bg text-tag-overnight-fg",
};

const dotClasses: Record<DeliveryType, string> = {
  express: "bg-tag-express-fg",
  standard: "bg-tag-standard-fg",
  freight: "bg-tag-freight-fg",
  healthcare: "bg-tag-healthcare-fg",
  overnight: "bg-tag-overnight-fg",
};

export function OrderMarker({ order }: { order: QueuedOrder }) {
  return (
    <OverlayView
      position={{ lat: order.pickupLat, lng: order.pickupLng }}
      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
      getPixelPositionOffset={(width, height) => ({ x: -width / 2, y: -height - 6 })}
    >
      <div
        className="flex flex-col items-center gap-1"
        title={`${order.id} — ${order.title}`}
      >
        <span
          className={cn(
            "text-badge whitespace-nowrap rounded-full px-2 py-1 shadow-md",
            pillClasses[order.type],
          )}
        >
          {order.id}
        </span>
        <span className={cn("h-2.5 w-2.5 rounded-full border-2 border-white shadow", dotClasses[order.type])} />
      </div>
    </OverlayView>
  );
}
