import { Link } from "react-router-dom";
import { Banknote, Boxes, MapPin, Package } from "lucide-react";
import { Card } from "../../../../components/Card";
import { Timeline } from "../../../../components/Timeline";
import { cn } from "../../../../lib/cn";
import { otherLabel } from "../../deliveries/deliveryOptions";
import { trackingSteps } from "../../deliveries/deliverySim";
import { cityLine, formatWhen, loadSize } from "../../deliveries/display";
import { invoiceIdFor, orderTotal } from "../../deliveries/invoices";
import { formatMoney } from "../../deliveries/pricing";
import type { DeliveryOrder, DeliveryStop } from "../../deliveries/deliveryTypes";

function Title({ icon: Icon, children }: { icon: typeof Package; children: string }) {
  return (
    <h2 className="flex items-center gap-2 text-base font-semibold text-text">
      <Icon className="h-4 w-4" /> {children}
    </h2>
  );
}

export function StatusTimelineCard({ order, now }: { order: DeliveryOrder; now: number }) {
  const steps = trackingSteps(order, now).map((s) => ({ label: s.label, timestamp: s.at ? formatWhen(s.at) : undefined, status: s.state }));
  return (
    <Card className="flex flex-col gap-3">
      <Title icon={Package}>Delivery Status</Title>
      <Timeline steps={steps} />
    </Card>
  );
}

export function LoadDetailsCard({ order }: { order: DeliveryOrder }) {
  const { load, references } = order;
  const fields: [string, string][] = [
    ["Commodity", load.description || otherLabel(load.category, load.categoryOther)],
    ["Weight", `${(load.weightLbs * load.quantity).toLocaleString("en-US")} lbs`],
    [load.measurement === "Liquid" ? "Volume" : "Dimensions", `${load.quantity} × ${loadSize(load)}`],
    ["Equipment", order.driver?.vehicle ?? "Assigned at pickup"],
    ["PO Number", references.po || "—"],
    ["BOL Number", references.bol || "—"],
  ];
  return (
    <Card className="flex flex-col gap-3">
      <Title icon={Boxes}>Load Details</Title>
      <dl className="grid grid-cols-2 gap-3">
        {fields.map(([label, value]) => (
          <div key={label}>
            <dt className="text-[11px] font-semibold uppercase text-text-muted">{label}</dt>
            <dd className="text-sm font-semibold text-text">{value}</dd>
          </div>
        ))}
      </dl>
      {order.handling.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {order.handling.map((h) => (
            <span key={h} className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", h === "HazMat" ? "bg-danger/10 text-danger" : "bg-bg text-text")}>{h}</span>
          ))}
        </div>
      )}
    </Card>
  );
}

function Stop({ title, stop, instructions, accent }: { title: string; stop: DeliveryStop; instructions: string; accent?: boolean }) {
  const notes = [...stop.provisions.map((p) => `${p} ${accent ? "needed" : "on site"}`), stop.notes, instructions].filter(Boolean);
  return (
    <div className={cn("flex flex-col gap-1 rounded-lg border border-border p-3", accent && "border-l-4 border-l-success")}>
      <p className="text-xs font-semibold text-text-muted">{title}</p>
      <p className="font-semibold text-text">{stop.address.name || stop.address.street}</p>
      <p className="text-xs text-text-muted">{stop.address.street}, {cityLine(stop.address)}</p>
      {notes.length > 0 && <ul className="mt-1 list-disc rounded bg-bg py-1.5 pl-6 pr-2 text-xs text-text-muted">{notes.map((n) => <li key={n}>{n}</li>)}</ul>}
    </div>
  );
}

export function RouteLocationsCard({ order }: { order: DeliveryOrder }) {
  return (
    <Card className="flex flex-col gap-3">
      <Title icon={MapPin}>Route Locations</Title>
      <Stop title="Loading Facility" stop={order.pickup} instructions={order.pickupInstructions} />
      <Stop title="Unloading Facility" stop={order.dropoff} instructions={order.dropoffInstructions} accent />
    </Card>
  );
}

/** "Pricing Breakdown" — "Total", not the design's driver-app "Total Payout". */
export function PricingCard({ order, delivered }: { order: DeliveryOrder; delivered: boolean }) {
  return (
    <Card className="flex flex-col gap-2">
      <Title icon={Banknote}>{delivered ? "Pricing Breakdown" : "Cost Breakdown"}</Title>
      {order.quote.lines.map((l) => (
        <div key={l.label} className={cn("flex justify-between text-sm", l.accrued ? "text-warning" : "text-text")}>
          <span>{l.label}</span>
          <span>{formatMoney(l.amount)}</span>
        </div>
      ))}
      <div className="flex justify-between border-t border-border pt-2 font-bold text-text">
        <span>{delivered ? "Total" : "Estimated Total"}</span>
        <span className="text-primary">{formatMoney(orderTotal(order))}</span>
      </div>
      <p className="text-xs text-text-muted">Paid by {order.payment.label} · billed to {order.branch}</p>
      {delivered && order.payment.kind === "invoice" && (
        <Link to={`/business/invoices/${invoiceIdFor(order.id)}`} className="mt-1 rounded-md bg-bg py-2 text-center text-sm font-semibold text-text hover:bg-border">
          View Full Invoice
        </Link>
      )}
    </Card>
  );
}
