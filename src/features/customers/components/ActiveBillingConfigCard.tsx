import { CircleCheck, User, MapPin, Send } from "lucide-react";
import { Card } from "../../../components/Card";
import type { BillingTermsDetail } from "../companyInvoices";

export function ActiveBillingConfigCard({ terms }: { terms: BillingTermsDetail }) {
  return (
    <Card className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm font-semibold text-success">
          <CircleCheck className="h-4 w-4" />
          Active Configuration: {terms.cycle} Invoice
        </div>
        <span className="text-xs text-text-muted">Last Updated: {terms.lastUpdatedLabel}</span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-label text-text-muted">Billing Cycle</p>
          <p className="mt-1 text-sm font-medium text-text">{terms.cycle}</p>
          <p className="text-xs text-text-muted">{terms.cycleDescription}</p>
        </div>
        <div>
          <p className="text-label text-text-muted">Billing Contact</p>
          <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-text">
            <User className="h-3.5 w-3.5 text-text-muted" />
            {terms.contactName}
          </p>
          <p className="text-xs text-text-muted">{terms.contactEmail}</p>
        </div>
        <div>
          <p className="text-label text-text-muted">Billing Address</p>
          <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-text">
            <MapPin className="h-3.5 w-3.5 text-text-muted" />
            {terms.addressLabel}
          </p>
          <p className="text-xs text-text-muted">{terms.addressDetail}</p>
        </div>
        <div>
          <p className="text-label text-text-muted">Invoice Delivery</p>
          <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-text">
            <Send className="h-3.5 w-3.5 text-text-muted" />
            {terms.deliveryMethod}
          </p>
          <p className="text-xs text-text-muted">{terms.deliveryDescription}</p>
        </div>
      </div>
    </Card>
  );
}
