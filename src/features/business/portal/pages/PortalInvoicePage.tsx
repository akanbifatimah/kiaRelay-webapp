import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Download, Mail } from "lucide-react";
import { Button } from "../../../../components/Button";
import { Card } from "../../../../components/Card";
import { InvoiceLineItemsCard } from "../../../customers/components/InvoiceLineItemsCard";
import { InvoiceNotesCard } from "../../../customers/components/InvoiceNotesCard";
import { InvoiceStatusBadge } from "../../../customers/components/InvoiceStatusBadge";
import { InvoiceSummaryStats } from "../../../customers/components/InvoiceSummaryStats";
import { InvoiceTimelineCard } from "../../../customers/components/InvoiceTimelineCard";
import { downloadInvoicePdf } from "../../../customers/downloadInvoicePdf";
import { getInvoiceDetail } from "../../../customers/invoiceDetail";
import { useToast } from "../../../../components/toast/ToastContext";
import { findCustomer } from "../../../customers/data";
import { getCustomerDetail } from "../../../customers/customerDetails";
import { recordInvoicePayment } from "../../deliveries/billingStore";
import { daysOverdue } from "../../deliveries/invoices";
import { PayInvoiceModal } from "../billing/PayInvoiceModal";
import { usePortalAccount } from "../usePortalAccount";
import { usePortalBilling } from "../usePortalData";

const SUPPORT_EMAIL = "support@kiarelay.com";

// Invoice Details (2026-10-01 design): admin's own invoice cards (the same
// detail admins see, one line per delivery) plus Download and Pay Now.
export function PortalInvoicePage() {
  const { invoiceId } = useParams<{ invoiceId: string }>();
  const account = usePortalAccount();
  const { invoices } = usePortalBilling(account);
  const { showToast } = useToast();
  const [paying, setPaying] = useState(false);
  if (!account) return null;
  const invoice = invoices.find((i) => i.id === invoiceId);
  if (!invoice) return <Navigate to="/business/invoices" replace />;
  const detail = getInvoiceDetail(invoice, account.company.legalName);
  const customer = findCustomer(account.id);
  const methods = customer ? getCustomerDetail(customer).paymentMethods : [];
  const late = invoice.status === "overdue" ? daysOverdue(invoice) : 0;

  return (
    <div className="flex flex-col gap-6">
      <Link to="/business/invoices" className="flex w-fit items-center gap-1.5 text-sm text-text-muted hover:text-text">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Invoices
      </Link>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-text">Invoice {detail.id}</h1>
          <InvoiceStatusBadge status={detail.status} />
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => downloadInvoicePdf(detail)} className="flex items-center gap-2">
            <Download className="h-4 w-4" /> Download
          </Button>
          {invoice.status !== "paid" && (
            <Button onClick={() => setPaying(true)} className="flex items-center gap-2">
              Pay Now <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      {late > 0 && <p className="w-fit rounded-full bg-warning/10 px-3 py-1 text-xs font-bold uppercase text-warning">Overdue by {late} days</p>}
      <InvoiceSummaryStats detail={detail} />
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="flex flex-col gap-2 text-sm">
          <h2 className="text-base font-semibold text-text">Billing Information</h2>
          <p className="text-text-muted">Billed to</p>
          <p className="font-medium text-text">{detail.customerName} · {detail.billingAddress}</p>
          <p className="text-text-muted">Payment</p>
          <p className="font-medium text-text">{detail.paymentMethodLabel} · {detail.termsLabel}</p>
          {detail.status !== "paid" && (
            <a href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(`Invoice ${detail.id}`)}`} className="mt-2 flex items-center gap-1.5 font-medium text-primary hover:underline">
              <Mail className="h-4 w-4" /> Questions? Email billing
            </a>
          )}
        </Card>
        <div className="lg:col-span-2">
          <InvoiceLineItemsCard detail={detail} />
        </div>
        <InvoiceNotesCard notes={detail.billingNotes} />
        <div className="lg:col-span-2">
          <InvoiceTimelineCard events={detail.timeline} />
        </div>
      </div>
      {paying && (
        <PayInvoiceModal
          invoice={invoice}
          methods={methods}
          onClose={() => setPaying(false)}
          onPay={(methodLabel) => {
            recordInvoicePayment(account.id, invoice.id, methodLabel);
            setPaying(false);
            showToast("success", `${invoice.amount} paid with ${methodLabel}.`);
          }}
        />
      )}
    </div>
  );
}
