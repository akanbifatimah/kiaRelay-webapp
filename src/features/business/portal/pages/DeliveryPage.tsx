import { useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, TriangleAlert } from "lucide-react";
import { Button } from "../../../../components/Button";
import { Card } from "../../../../components/Card";
import { ConfirmModal } from "../../../../components/ConfirmModal";
import { useToast } from "../../../../components/toast/ToastContext";
import { OrderRouteMap } from "../../../orders/components/OrderRouteMap";
import { cancelDelivery, draftFrom } from "../../deliveries/deliveryActions";
import { stageOf, tripProgress } from "../../deliveries/deliverySim";
import { along, stopCoords } from "../../deliveries/geo";
import { formatWhen } from "../../deliveries/display";
import { startDraft } from "../bookingDraft";
import { StagePill } from "../components/StagePill";
import { ChatModal } from "../delivery/ChatModal";
import { ClaimModal } from "../delivery/ClaimModal";
import { LoadDetailsCard, PricingCard, RouteLocationsCard, StatusTimelineCard } from "../delivery/DeliveryInfoCards";
import { LivePanel } from "../delivery/LivePanel";
import { ProofCard, RatingCard } from "../delivery/ProofRatingCards";
import { usePortalAccount } from "../usePortalAccount";
import { useNow, usePortalDeliveries } from "../usePortalData";

// Delivery detail + live tracking (2026-09-30): the app's live screens
// (driver matching → arrived → en route), order detail and proof of delivery,
// on one desktop page with a real Google map.
export function DeliveryPage() {
  const { orderNo } = useParams<{ orderNo: string }>();
  const account = usePortalAccount();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const now = useNow();
  const order = usePortalDeliveries(account).find((o) => o.id === `#ORD-${orderNo}`);
  const [modal, setModal] = useState<"chat" | "claim" | "cancel" | null>(null);
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
          {delivered &&
            (order.claim ? (
              <Card className="flex items-center gap-2 bg-warning/10 text-sm text-text">
                <TriangleAlert className="h-4 w-4 text-warning" /> Claim {order.claim.id} submitted — our claims team will contact you within 1 business day.
              </Card>
            ) : (
              <Button variant="secondary" onClick={() => setModal("claim")} className="flex items-center justify-center gap-2">
                <TriangleAlert className="h-4 w-4" /> Submit Claim
              </Button>
            ))}
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
            <PricingCard order={order} delivered={delivered} />
          </div>
        </div>
      </div>
      {modal === "chat" && <ChatModal order={order} onClose={() => setModal(null)} />}
      {modal === "claim" && (
        <ClaimModal
          order={order}
          companyName={account.company.legalName}
          onClose={() => setModal(null)}
          onSubmitted={(id) => {
            setModal(null);
            showToast("success", `Claim ${id} submitted. We'll be in touch within 1 business day.`);
          }}
        />
      )}
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
