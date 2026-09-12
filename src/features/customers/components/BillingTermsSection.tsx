import { Button } from "../../../components/Button";
import { ActiveBillingConfigCard } from "./ActiveBillingConfigCard";
import { InvoicePaymentMethodsSummaryCard } from "./InvoicePaymentMethodsSummaryCard";
import type { BillingTermsDetail } from "../companyInvoices";
import type { PaymentMethod } from "../customerDetails";

interface BillingTermsSectionProps {
  terms: BillingTermsDetail;
  paymentMethods: PaymentMethod[];
  paymentsHref: string;
  onEdit: () => void;
}

export function BillingTermsSection({ terms, paymentMethods, paymentsHref, onEdit }: BillingTermsSectionProps) {
  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-text">Billing Terms</h2>
        <Button type="button" onClick={onEdit}>
          Edit Billing Terms
        </Button>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <ActiveBillingConfigCard terms={terms} />
        <InvoicePaymentMethodsSummaryCard methods={paymentMethods} paymentsHref={paymentsHref} />
      </div>
    </>
  );
}
