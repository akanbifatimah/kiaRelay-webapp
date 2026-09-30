import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, FileText, Inbox, type LucideIcon } from "lucide-react";
import { Card } from "../../../../components/Card";
import { cn } from "../../../../lib/cn";
import type { Invoice } from "../../../customers/companyInvoices";
import { cityState, shortId } from "../../deliveries/display";
import { stageOf } from "../../deliveries/deliverySim";
import type { DeliveryOrder } from "../../deliveries/deliveryTypes";
import { StagePill } from "./StagePill";
import { INVOICE_TONE, orderPath } from "../paths";

/** Dashboard section card: icon + title, optional link, body. */
export function SectionCard({ title, icon: Icon, action, children, className }: { title: string; icon: LucideIcon; action?: { label: string; to: string }; children: ReactNode; className?: string }) {
  return (
    <Card className={cn("flex flex-col gap-3", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-text" />
          <h2 className="text-base font-semibold text-text">{title}</h2>
        </div>
        {action && (
          <Link to={action.to} className="text-sm font-medium text-primary hover:underline">
            {action.label}
          </Link>
        )}
      </div>
      {children}
    </Card>
  );
}

export function EmptyNote({ text, link }: { text: string; link?: { label: string; to: string } }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-text-muted/40 bg-bg px-4 py-6 text-center">
      <Inbox className="h-5 w-5 text-text-muted" />
      <p className="text-sm text-text-muted">{text}</p>
      {link && (
        <Link to={link.to} className="text-sm font-medium text-text underline">
          {link.label}
        </Link>
      )}
    </div>
  );
}

export function LiveDeliveryList({ orders, now }: { orders: DeliveryOrder[]; now: number }) {
  return (
    <ul className="flex flex-col gap-2">
      {orders.map((order) => (
        <li key={order.id}>
          <Link to={orderPath(order)} className="flex items-center gap-3 rounded-lg bg-bg p-3 hover:bg-border/40">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-text">
                {shortId(order)} · {cityState(order.pickup.address)} → {cityState(order.dropoff.address)}
              </p>
              <p className="truncate text-xs text-text-muted">
                {order.load.description} · {order.branch}
              </p>
            </div>
            <StagePill stage={stageOf(order, now)} />
            <ChevronRight className="h-4 w-4 text-text-muted" />
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function RecentInvoices({ invoices }: { invoices: Invoice[] }) {
  if (invoices.length === 0) return <EmptyNote text="No recent invoices" />;
  return (
    <ul className="flex flex-col gap-2">
      {invoices.slice(0, 4).map((invoice) => (
        <li key={invoice.id}>
          <Link to={`/business/invoices/${invoice.id}`} className="flex items-center gap-3 rounded-lg border border-border px-3 py-2.5 hover:bg-bg">
            <FileText className="h-4 w-4 text-text-muted" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-text">{invoice.id}</p>
              <p className="text-xs text-text-muted">
                {invoice.orderRef} · Due {invoice.dueDate}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-text">{invoice.amount}</p>
              <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize", INVOICE_TONE[invoice.status])}>{invoice.status}</span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
