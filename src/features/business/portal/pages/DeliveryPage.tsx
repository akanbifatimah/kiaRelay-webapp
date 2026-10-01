import { useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Headset, TriangleAlert } from "lucide-react";
import { Card } from "../../../../components/Card";
import { ConfirmModal } from "../../../../components/ConfirmModal";
import { OrderRouteMap } from "../../../orders/components/OrderRouteMap";
import { cancelDelivery, draftFrom } from "../../deliveries/deliveryActions";
import { stageOf, tripProgress } from "../../deliveries/deliverySim";
import { along, stopCoords } from "../../deliveries/geo";
import { formatWhen } from "../../deliveries/display";
import { startDraft } from "../bookingDraft";
import { StagePill } from "../components/StagePill";
import { ChatModal } from "../delivery/ChatModal";
import { LoadDetailsCard, PricingCard, RouteLocationsCard, StatusTimelineCard } from "../delivery/DeliveryInfoCards";
import { LivePanel } from "../delivery/LivePanel";
import { ProofCard, RatingCard } from "../delivery/ProofRatingCards";
import { usePortalAccount } from "../usePortalAccount";
import { useNow, usePortalBilling, usePortalDeliveries } from "../usePortalData";
import { invoiceForOrder } from "../../deliveries/invoices";

// Delivery detail + live tracking (2026-09-30): the app's live screens
// (driver matching → arrived → en route), order detail and proof of delivery,
// on one desktop page with a real Google map.
export function DeliveryPage() {
  const { orderNo } = useParams<{ orderNo: string }>();
  const account = usePortalAccount();
  const navigate = useNavigate();
  const now = useNow();
  const order = usePortalDeliveries(account).find((o) => o.id === `#ORD-${orderNo}`);
  const { invoices } = usePortalBilling(account);
  const [modal, setModal] = useState<"chat" | "cancel" | null>(null);
  if (!account) return null;
  if (!order) return <Navigate to="/business/deliveries" replace />;

  const stage = stageOf(order, now);
  const delivered = stage === "delivered";
  const pickup = stopCoords(order.pickup.address);
  const dropoff = stopCoords(order.dropoff.address);
  const onRoad = stage === "accepted" || stage === "at-pickup" || stage === "in-transit";
  const reorder = () => {
    startDraft(draftFrom(order), "reorder");
    navigate("/business/book");
  };

  return (
    <div className="flex flex-col gap-6">
      <Link to="/business/deliveries" className="flex w-fit items-center gap-1.5 text-sm text-text-muted hover:text-text">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Deliveries
      </Link>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-semibold text-text">Order {order.id}</h1>
        <StagePill stage={stage} />
        <span className="text-sm text-text-muted">Created {formatWhen(order.createdAt)} by {order.placedByFirstName} {order.placedByLastName}</span>
      </div>
      <div className="grid gap-6 lg:grid-cols-[400px_minmax(0,1fr)]">
        <div className="flex flex-col gap-4">
          <LivePanel order={order} stage={stage} now={now} onMessage={() => setModal("chat")} onCancel={() => setModal("cancel")} onReorder={reorder} />
          {delivered && <RatingCard order={order} />}
          <Link to={`/business/support/new?order=${orderNo}`} className="flex items-center justify-center gap-2 rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium text-text hover:bg-bg">
            <Headset className="h-4 w-4" /> Contact Support
          </Link>
          {order.incidentId ? (
            <Link to={`/business/incidents/${order.incidentId}`} className="flex items-center gap-2 rounded-xl bg-warning/10 p-3 text-sm text-text hover:bg-warning/20">
              <TriangleAlert className="h-4 w-4 text-warning" /> Incident #{order.incidentId} reported — track it here.
            </Link>
          ) : (
            <Link to={`/business/incidents/new?order=${orderNo}`} className="flex items-center justify-center gap-2 rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium text-text hover:bg-bg">
              <TriangleAlert className="h-4 w-4" /> Report an Incident
            </Link>
          )}
          {delivered && <ProofCard order={order} />}
        </div>
        <div className="flex flex-col gap-4">
          <Card className="h-72 overflow-hidden p-0">
            <OrderRouteMap pickup={pickup} dropoff={dropoff} current={onRoad ? along(pickup, dropoff, tripProgress(order, now)) : undefined} />
          </Card>
          <div className="grid gap-4 xl:grid-cols-2">
            <StatusTimelineCard order={order} now={now} />
            <LoadDetailsCard order={order} />
            <RouteLocationsCard order={order} />
            <PricingCard order={order} delivered={delivered} invoiceId={invoiceForOrder(invoices, order.id)?.id} />
          </div>
        </div>
      </div>
      {modal === "chat" && <ChatModal order={order} onClose={() => setModal(null)} />}
      {modal === "cancel" && (
        <ConfirmModal
          title="Cancel this delivery?"
          message="Your driver will be released. There's no charge for cancelling before pickup."
          confirmLabel="Cancel Delivery"
          cancelLabel="Keep It"
          tone="danger"
          onCancel={() => setModal(null)}
          onConfirm={() => {
            cancelDelivery(order.id);
            setModal(null);
          }}
        />
      )}
    </div>
  );
}
