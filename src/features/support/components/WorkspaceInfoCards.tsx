import { Link } from "react-router-dom";
import { Building2, ExternalLink, Package, Phone, Truck } from "lucide-react";
import { Card } from "../../../components/Card";
import { Avatar } from "../../../components/Avatar";
import { Tooltip } from "../../../components/Tooltip";
import type { TicketWorkspace } from "../ticketWorkspace";

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 text-sm">
      <span className="text-text-muted">{label}</span>
      <span className="text-right font-medium text-text">{children}</span>
    </div>
  );
}

function CardTitle({ icon: Icon, children }: { icon: typeof Building2; children: React.ReactNode }) {
  return (
    <h3 className="flex items-center gap-2 text-sm font-semibold text-text">
      <Icon className="h-4 w-4 text-text-muted" />
      {children}
    </h3>
  );
}

export function CustomerDetailsCard({ customer }: { customer: TicketWorkspace["customer"] }) {
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <CardTitle icon={Building2}>Customer Details</CardTitle>
        {customer.supportHref && (
          <Tooltip label="Open customer support view">
            <Link to={customer.supportHref} aria-label="Open customer support view" className="text-text-muted hover:text-primary">
              <ExternalLink className="h-4 w-4" />
            </Link>
          </Tooltip>
        )}
      </div>
      <Row label="Company">{customer.company}</Row>
      <Row label="Contact">{customer.contact}</Row>
      <Row label="Email">
        <a href={`mailto:${customer.email}`} className="text-info hover:underline">
          {customer.email}
        </a>
      </Row>
      <Row label="Account Type">
        <span className="text-badge rounded bg-tag-overnight-bg px-1.5 py-0.5 text-tag-overnight-fg">{customer.accountType}</span>
      </Row>
    </Card>
  );
}

export function AssignedAssetsCard({ driver, vehicle }: Pick<TicketWorkspace, "driver" | "vehicle">) {
  return (
    <Card className="flex flex-col gap-3">
      <CardTitle icon={Truck}>Assigned Assets</CardTitle>
      <div className="flex items-center gap-3 rounded-lg border border-border px-3 py-2">
        <Avatar name={driver.name} src="/profile_img.png" />
        <div className="flex-1">
          {driver.supportHref ? (
            <Link to={driver.supportHref} className="text-sm font-semibold text-text hover:text-primary hover:underline">
              {driver.name}
            </Link>
          ) : (
            <p className="text-sm font-semibold text-text">{driver.name}</p>
          )}
          <p className="text-xs text-text-muted">{driver.role}</p>
        </div>
        <Tooltip label={`Call ${driver.phone}`}>
          <a
            href={`tel:${driver.phone.replace(/[^\d+]/g, "")}`}
            aria-label={`Call ${driver.phone}`}
            className="rounded-full bg-tag-info-bg p-2 text-tag-info-fg hover:opacity-80"
          >
            <Phone className="h-3.5 w-3.5" />
          </a>
        </Tooltip>
      </div>
      <div className="flex items-center gap-3 rounded-lg border border-border px-3 py-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-md bg-bg text-text-muted">
          <Truck className="h-4 w-4" />
        </span>
        <div className="flex-1">
          <p className="text-sm font-semibold text-text">{vehicle.name}</p>
          <p className="text-xs font-medium text-warning">{vehicle.status}</p>
        </div>
        <span className="rounded border border-border px-1.5 py-0.5 font-mono text-xs text-text-muted">{vehicle.plate}</span>
      </div>
    </Card>
  );
}

export function OrderSummaryCard({ order }: { order: TicketWorkspace["order"] }) {
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <CardTitle icon={Package}>Order {order.id}</CardTitle>
        <span className="text-badge rounded-full bg-tag-warning-bg px-2 py-0.5 text-tag-warning-fg">{order.status}</span>
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-xs text-text-muted">Orig. ETA</p>
          <p className="text-text-muted line-through">{order.originalEta}</p>
        </div>
        <div>
          <p className="text-xs text-text-muted">Revised ETA</p>
          <p className="font-semibold text-danger">{order.revisedEta}</p>
        </div>
      </div>
      <div className="text-sm">
        <p className="text-xs text-text-muted">Cargo Type</p>
        <p className="font-medium text-text">{order.cargo}</p>
      </div>
    </Card>
  );
}
