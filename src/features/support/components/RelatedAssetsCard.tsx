import { Building2, CalendarDays, MapPin } from "lucide-react";
import { Card } from "../../../components/Card";
import { Avatar } from "../../../components/Avatar";
import type { ClaimInvestigation } from "../claimInvestigation";

// The screenshot shows chevrons on the Customer/Driver rows, but neither
// record exists in the Customers or Drivers mock datasets (independently
// generated, no shared ID space — same situation as InvoiceDetailPage's
// removed "View Related Order"). Rendered as plain rows rather than links
// that would 404. TODO: link both once claims carry real customer/driver ids.
export function RelatedAssetsCard({ claim }: { claim: ClaimInvestigation }) {
  const { order, customer, driver } = claim;
  return (
    <div className="flex flex-col gap-3">
      <p className="text-label uppercase text-text-muted">Related Assets</p>
      <Card className="flex flex-col gap-2 p-4">
        <div className="flex items-center justify-between">
          <span className="text-badge rounded bg-sidebar px-1.5 py-0.5 text-white">Order {order.ref}</span>
          <span className="flex items-center gap-1 text-xs font-semibold uppercase text-success">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            {order.status}
          </span>
        </div>
        <p className="font-semibold text-text">{order.title}</p>
        <p className="flex items-center gap-1.5 text-xs text-text-muted">
          <MapPin className="h-3.5 w-3.5" />
          {order.route}
        </p>
        <p className="flex items-center gap-1.5 text-xs text-text-muted">
          <CalendarDays className="h-3.5 w-3.5" />
          {order.dates}
        </p>
      </Card>
      <Card className="flex items-center gap-3 p-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-md bg-bg text-text-muted">
          <Building2 className="h-4 w-4" />
        </span>
        <div>
          <p className="text-label uppercase text-text-muted">Customer</p>
          <p className="text-sm font-semibold text-text">{customer.name}</p>
          <p className="text-xs text-text-muted">{customer.accountId}</p>
        </div>
      </Card>
      <Card className="flex items-center gap-3 p-4">
        <Avatar name={driver.name} src="/profile_img.png" />
        <div>
          <p className="text-label uppercase text-text-muted">Driver</p>
          <p className="text-sm font-semibold text-text">{driver.name}</p>
          <p className="text-xs text-text-muted">{driver.meta}</p>
        </div>
      </Card>
    </div>
  );
}
