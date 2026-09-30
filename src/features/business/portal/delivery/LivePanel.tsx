import { CheckCircle2, Hourglass, Loader2, Timer, TriangleAlert, XCircle } from "lucide-react";
import { Button } from "../../../../components/Button";
import { Card } from "../../../../components/Card";
import { chooseAnotherDriver, sendMessage } from "../../deliveries/deliveryActions";
import { DEMURRAGE } from "../../deliveries/deliveryOptions";
import { eventTime, formatClock, isCancellable, simMinutesSince, simMinutesUntil, tripProgress } from "../../deliveries/deliverySim";
import { formatWhen, loadSummary } from "../../deliveries/display";
import type { DeliveryOrder } from "../../deliveries/deliveryTypes";
import type { DeliveryStage } from "../../deliveries/trackingTypes";
import { DriverRow } from "./DriverBits";
import { OffersPanel } from "./OffersPanel";

interface LivePanelProps {
  order: DeliveryOrder;
  stage: DeliveryStage;
  now: number;
  onMessage: () => void;
  onCancel: () => void;
  onReorder: () => void;
}

const TITLES: Partial<Record<DeliveryStage, string>> = {
  searching: "Order Confirmed!",
  choosing: "Order Confirmed!",
  requested: "Order Request Sent!",
  accepted: "Driver has Accepted",
  "at-pickup": "Driver at Pickup",
  "in-transit": "Driver En Route to Drop-off",
};

/** The live stage of a delivery — the app's bottom sheets as one card. */
export function LivePanel({ order, stage, now, onMessage, onCancel, onReorder }: LivePanelProps) {
  const driver = order.driver;
  const progress = Math.round(tripProgress(order, now) * 100);
  return (
    <Card className="flex flex-col gap-4">
      {TITLES[stage] && (
        <p className="flex items-center gap-2 text-lg font-bold text-text">
          <CheckCircle2 className="h-5 w-5 text-success" /> {TITLES[stage]}
        </p>
      )}
      {stage === "searching" && (
        <p className="flex items-center gap-2 rounded-lg bg-bg p-4 text-sm text-text">
          <Loader2 className="h-4 w-4 animate-spin text-primary" /> Finding the best driver... under 60 seconds
        </p>
      )}
      {stage === "choosing" && <OffersPanel order={order} />}
      {stage === "requested" && driver && (
        <div className="flex flex-col items-center gap-3 text-center">
          <DriverRow driver={driver} call={false} />
          <Hourglass className="h-10 w-10 text-primary" />
          <p className="text-xl font-bold text-text">Request sent</p>
          <p className="text-sm text-text-muted">We're waiting for {driver.firstName} to accept your delivery.</p>
        </div>
      )}
      {stage === "unavailable" && (
        <div className="flex flex-col items-center gap-3 text-center">
          <TriangleAlert className="h-10 w-10 text-text" />
          <p className="text-xl font-bold text-text">{driver?.firstName ?? "Your driver"} isn't available</p>
          <span className="rounded bg-danger/10 px-2 py-0.5 text-xs font-semibold text-danger">Vehicle Issue</span>
          <p className="text-sm text-text-muted">Choose another available driver to keep your shipment on track.</p>
          <Button onClick={() => chooseAnotherDriver(order.id)} className="w-full">Choose Another Driver</Button>
        </div>
      )}
      {(stage === "accepted" || stage === "at-pickup" || stage === "in-transit") && driver && (
        <>
          <div className="rounded-lg bg-bg p-3">
            <DriverRow driver={driver} subtitle={`${driver.vehicle} · ${driver.plate}`} onMessage={onMessage} />
          </div>
          {stage === "accepted" && (
            <p className="text-sm text-text">
              Arriving in <span className="font-bold text-primary">{simMinutesUntil(eventTime(order, "at-pickup"), now)} minutes</span> · Pickup at {order.pickup.address.street}
            </p>
          )}
          {stage === "at-pickup" && (
            <>
              <p className="flex items-center justify-center gap-2 rounded-lg border border-success bg-success/10 py-2 text-sm font-semibold text-success">
                <Timer className="h-4 w-4" /> Wait time: {formatClock(simMinutesSince(eventTime(order, "at-pickup"), now))} / {formatClock(DEMURRAGE.freeMinutes)} free
              </p>
              <Button variant="secondary" onClick={() => sendMessage(order.id, "I'm on my way out with the load.")}>I'm on my way</Button>
            </>
          )}
          {stage === "in-transit" && (
            <p className="text-sm text-text">
              <span className="text-2xl font-bold">{simMinutesUntil(eventTime(order, "delivered"), now)} minutes</span> <span className="text-text-muted">to drop-off · {loadSummary(order.load)}</span>
            </p>
          )}
          <div className="h-2 overflow-hidden rounded-full bg-bg" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
            <div className="h-2 rounded-full bg-primary" style={{ width: `${progress}%` }} />
          </div>
        </>
      )}
      {stage === "delivered" && (
        <p className="flex items-center gap-2 text-lg font-bold text-text">
          <CheckCircle2 className="h-5 w-5 text-success" /> Delivered {formatWhen(eventTime(order, "delivered"))}
        </p>
      )}
      {stage === "cancelled" && (
        <div className="flex flex-col items-center gap-2 text-center">
          <XCircle className="h-8 w-8 text-danger" />
          <p className="font-bold text-text">Delivery cancelled</p>
          <p className="text-sm text-text-muted">{order.events[order.events.length - 1]?.note ?? "Cancelled"} · no charge before pickup.</p>
        </div>
      )}
      {isCancellable(stage) && (
        <Button variant="ghost" onClick={onCancel}>
          {stage === "accepted" || stage === "at-pickup" ? "Cancel Delivery" : "Cancel Request"}
        </Button>
      )}
      {(stage === "delivered" || stage === "cancelled") && <Button onClick={onReorder}>{stage === "cancelled" ? "Book Again" : "Reorder Similar"}</Button>}
    </Card>
  );
}
