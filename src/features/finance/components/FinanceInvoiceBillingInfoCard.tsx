import { CreditCard } from "lucide-react";
import { Card } from "../../../components/Card";
import type { FinanceInvoiceDetail } from "../financeInvoiceDetail";

export function FinanceInvoiceBillingInfoCard({ detail }: { detail: FinanceInvoiceDetail }) {
  return (
    <Card className="flex h-full flex-col gap-4">
      <h3 className="text-sm font-semibold text-text">Billing Information</h3>

      <div>
        <p className="text-label text-text-muted">Company Entity</p>
        <p className="mt-1 text-sm font-medium text-text">{detail.invoice.company}</p>
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

      <div>
        <p className="text-label text-text-muted">Terms</p>
        <p className="mt-1 text-sm text-text">{detail.termsLabel}</p>
      </div>
    </Card>
  );
}
