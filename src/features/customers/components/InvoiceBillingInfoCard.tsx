import { CreditCard } from "lucide-react";
import { Card } from "../../../components/Card";
import type { InvoiceDetail } from "../invoiceDetail";

interface InvoiceBillingInfoCardProps {
  detail: InvoiceDetail;
  onEditDetails: () => void;
}

export function InvoiceBillingInfoCard({ detail, onEditDetails }: InvoiceBillingInfoCardProps) {
  return (
    <Card className="flex h-full flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text">Billing Information</h3>
        <button type="button" onClick={onEditDetails} className="text-sm font-medium text-primary hover:underline">
          Edit Details
        </button>
      </div>

      <div>
        <p className="text-label text-text-muted">Company Entity</p>
        <p className="mt-1 text-sm font-medium text-text">{detail.customerName}</p>
        <p className="text-xs text-text-muted">Tax ID: {detail.taxId}</p>
      </div>

      <div>
        <p className="text-label text-text-muted">Billing Address</p>
        <p className="mt-1 text-sm text-text">{detail.billingAddress}</p>
      </div>

      <div>
        <p className="text-label text-text-muted">Payment Method</p>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-text">
          <CreditCard className="h-3.5 w-3.5 text-text-muted" />
          {detail.paymentMethodLabel}
        </p>
      </div>
    </Card>
  );
}
