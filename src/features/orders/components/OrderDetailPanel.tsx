import { MessageSquare, Printer, Share2 } from "lucide-react";
import { SlideOverPanel } from "../../../components/SlideOverPanel";
import { StatusBadge } from "../../../components/StatusBadge";
import { Timeline } from "../../../components/Timeline";
import { Button } from "../../../components/Button";
import { Card } from "../../../components/Card";
import { Tooltip } from "../../../components/Tooltip";
import { CustomerRecipientCard } from "./CustomerRecipientCard";
import { LogisticsDetailsCard } from "./LogisticsDetailsCard";
import { DriverRow } from "./DriverRow";
import { PaymentSummary } from "./PaymentSummary";
import { OrderRouteMap } from "./OrderRouteMap";
import { getOrderDetail } from "../orderDetails";
import type { Order } from "../data";

interface OrderDetailPanelProps {
  order: Order;
  onClose: () => void;
}

export function OrderDetailPanel({ order, onClose }: OrderDetailPanelProps) {
  const detail = getOrderDetail(order);

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
            <button type="button" aria-label="Print" className="text-text-muted hover:text-text">
              <Printer className="h-4 w-4" />
            </button>
          </Tooltip>
          <Tooltip label="Share" side="bottom">
            <button type="button" aria-label="Share" className="text-text-muted hover:text-text">
              <Share2 className="h-4 w-4" />
            </button>
          </Tooltip>
        </>
      }
      onClose={onClose}
      footer={
        <>
          <Button className="w-full">Reassign Driver</Button>
          <div className="flex gap-2">
            <Button variant="secondary" className="flex-1">
              Cancel Order
            </Button>
            <Button variant="secondary" className="flex-1">
              <MessageSquare className="h-4 w-4" />
              Contact
            </Button>
          </div>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <CustomerRecipientCard
          customer={detail.customer}
          accountNumber={detail.accountNumber}
          verified={detail.verified}
          phone={detail.phone}
        />

        <LogisticsDetailsCard
          dimensions={detail.dimensions}
          weightLbs={detail.weightLbs}
          tags={detail.tags}
          pickupAddress={detail.pickupAddress}
          dropoffAddress={detail.dropoffAddress}
        />

        <DriverRow
          driverName={detail.driverName}
          driverVehicle={detail.driverVehicle}
          driverRating={detail.driverRating}
        />

        {detail.route && (
          <OrderRouteMap
            pickup={detail.route.pickup}
            dropoff={detail.route.dropoff}
            current={detail.route.current}
          />
        )}

        <Card className="flex flex-col gap-3">
          <h3 className="text-base font-semibold text-text">Delivery Timeline</h3>
          <Timeline steps={detail.timeline} />
        </Card>

        <PaymentSummary payment={detail.payment} totalPaid={detail.totalPaid} invoiceNote={detail.invoiceNote} />
      </div>
    </SlideOverPanel>
  );
}
