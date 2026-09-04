import { Phone, CheckCircle2 } from "lucide-react";
import { SlideOverPanel } from "../../../components/SlideOverPanel";
import { StatusBadge } from "../../../components/StatusBadge";
import { Avatar } from "../../../components/Avatar";
import { Timeline } from "../../../components/Timeline";
import { Button } from "../../../components/Button";
import { PaymentSummary } from "./PaymentSummary";
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
          <StatusBadge status={detail.status} />
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
              Contact
            </Button>
          </div>
        </>
      }
    >
      <div className="flex flex-col gap-5">
        <section className="flex flex-col gap-1">
          <h3 className="text-label text-text-muted">Customer &amp; Recipient</h3>
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-text">{detail.customer}</p>
            {detail.verified && <CheckCircle2 className="h-4 w-4 text-success" />}
          </div>
          <p className="flex items-center gap-1.5 text-xs text-text-muted">
            <Phone className="h-3.5 w-3.5" />
            {detail.phone}
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h3 className="text-label text-text-muted">Logistics Details</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-xs text-text-muted">Dimensions</p>
              <p className="text-text">{detail.dimensions}</p>
            </div>
            <div>
              <p className="text-xs text-text-muted">Weight</p>
              <p className="text-text">{detail.weightLbs} lbs</p>
            </div>
          </div>
          {detail.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {detail.tags.map((tag) => (
                <span key={tag} className="text-badge rounded-full bg-tag-freight-bg px-2 py-0.5 text-tag-freight-fg">
                  {tag}
                </span>
              ))}
            </div>
          )}
          <div className="flex flex-col gap-1.5 pt-1 text-sm">
            <div className="flex items-start gap-2">
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-success" />
              <p className="text-text">{detail.pickupAddress}</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
              <p className="text-text">{detail.dropoffAddress}</p>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-between rounded-lg border border-border p-3">
          <div className="flex items-center gap-2">
            <Avatar name={detail.driverName} size="sm" />
            <div>
              <p className="text-sm font-medium text-text">{detail.driverName}</p>
              <p className="text-xs text-text-muted">
                {detail.driverVehicle} &middot; {detail.driverRating.toFixed(1)}★
              </p>
            </div>
          </div>
          <Button type="button" variant="ghost" size="sm">
            Track Live
          </Button>
        </section>

        <section className="flex flex-col gap-2">
          <h3 className="text-label text-text-muted">Delivery Timeline</h3>
          <Timeline steps={detail.timeline} />
        </section>

        <PaymentSummary payment={detail.payment} totalPaid={detail.totalPaid} invoiceNote={detail.invoiceNote} />
      </div>
    </SlideOverPanel>
  );
}
