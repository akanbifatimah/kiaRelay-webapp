import { useState } from "react";
import { Phone, Printer, Share2 } from "lucide-react";
import { SlideOverPanel } from "../../../components/SlideOverPanel";
import { StatusBadge } from "../../../components/StatusBadge";
import { Timeline } from "../../../components/Timeline";
import { Button } from "../../../components/Button";
import { Card } from "../../../components/Card";
import { Tooltip } from "../../../components/Tooltip";
import { ConfirmModal } from "../../../components/ConfirmModal";
import { useToast } from "../../../components/toast/ToastContext";
import { CustomerRecipientCard } from "./CustomerRecipientCard";
import { LogisticsDetailsCard } from "./LogisticsDetailsCard";
import { DriverRow } from "./DriverRow";
import { PaymentSummary } from "./PaymentSummary";
import { OrderRouteMap } from "./OrderRouteMap";
import { ReassignDriverModal } from "./ReassignDriverModal";
import { getOrderDetail } from "../orderDetails";
import { cancelOrder, isReassignable, useOrderEvents, useOrders } from "../ordersStore";
import { useCurrentUser } from "../../access/permissions";
import type { Order } from "../data";

interface OrderDetailPanelProps {
  order: Order;
  onClose: () => void;
}

export function OrderDetailPanel({ order: initial, onClose }: OrderDetailPanelProps) {
  const { showToast } = useToast();
  const user = useCurrentUser();
  const events = useOrderEvents();
  // Read the live row so a reassignment or cancellation re-renders the panel.
  const order = useOrders().find((o) => o.id === initial.id) ?? initial;
  const base = getOrderDetail(order);
  const detail = {
    ...base,
    status: order.status,
    ...(order.driverId && { driverName: order.driver, driverVehicle: order.driverVehicle ?? "—" }),
    timeline: [...base.timeline, ...(events[order.id] ?? [])],
  };
  const [isReassigning, setIsReassigning] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const canChange = isReassignable(order);

  return (
    <SlideOverPanel
      title={
        <>
          {detail.id}
          <StatusBadge status={detail.status} variant="pill" />
        </>
      }
      headerActions={
        <>
          <Tooltip label="Print" side="bottom">
            <button type="button" aria-label="Print" onClick={() => window.print()} className="text-text-muted hover:text-text">
              <Printer className="h-4 w-4" />
            </button>
          </Tooltip>
          <Tooltip label="Copy link" side="bottom">
            <button
              type="button"
              aria-label="Copy link"
              onClick={() => navigator.clipboard.writeText(`${window.location.origin}/orders?order=${encodeURIComponent(order.id)}`).then(() => showToast("success", "Order link copied."))}
              className="text-text-muted hover:text-text"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </Tooltip>
        </>
      }
      onClose={onClose}
      footer={
        <>
          {/* Reassign Driver (TC-13, 2026-09-28) used to have no handler. */}
          <Button className="w-full" disabled={!canChange} onClick={() => setIsReassigning(true)}>
            Reassign Driver
          </Button>
          {!canChange && <p className="text-center text-xs text-text-muted">Only pending or in-transit orders can change driver.</p>}
          <div className="flex gap-2">
            <Button variant="secondary" className="flex-1" disabled={!canChange} onClick={() => setIsCancelling(true)}>
              Cancel Order
            </Button>
            <a
              href={`tel:${detail.phone.replace(/[^\d+]/g, "")}`}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-text hover:bg-bg"
            >
              <Phone className="h-4 w-4" />
              Call Customer
            </a>
          </div>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <CustomerRecipientCard customer={detail.customer} accountNumber={detail.accountNumber} verified={detail.verified} phone={detail.phone} />
        <LogisticsDetailsCard dimensions={detail.dimensions} weightLbs={detail.weightLbs} tags={detail.tags} pickupAddress={detail.pickupAddress} dropoffAddress={detail.dropoffAddress} />
        <DriverRow driverName={detail.driverName} driverVehicle={detail.driverVehicle} driverRating={detail.driverRating} />
        {detail.route && <OrderRouteMap pickup={detail.route.pickup} dropoff={detail.route.dropoff} current={detail.route.current} />}
        <Card className="flex flex-col gap-3">
          <h3 className="text-base font-semibold text-text">Delivery Timeline</h3>
          <Timeline steps={detail.timeline} />
        </Card>
        <PaymentSummary payment={detail.payment} totalPaid={detail.totalPaid} invoiceNote={detail.invoiceNote} />
      </div>

      {isReassigning && <ReassignDriverModal order={order} onClose={() => setIsReassigning(false)} />}
      {isCancelling && (
        <ConfirmModal
          title="Cancel Order"
          message={`Cancel ${order.id} for ${order.customer}? The driver is released and the customer is notified.`}
          confirmLabel="Cancel Order"
          cancelLabel="Keep Order"
          tone="danger"
          onCancel={() => setIsCancelling(false)}
          onConfirm={() => {
            cancelOrder(order.id, user?.name ?? "Admin");
            setIsCancelling(false);
            showToast("success", `${order.id} was cancelled.`);
          }}
        />
      )}
    </SlideOverPanel>
  );
}
