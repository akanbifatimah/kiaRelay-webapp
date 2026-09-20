import { ArrowLeft, Download, ExternalLink } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import { Button } from "../../components/Button";
import { useToast } from "../../components/toast/ToastContext";
import { FinanceInvoiceStatusBadge } from "./components/FinanceInvoiceStatusBadge";
import { FinanceInvoiceBillingInfoCard } from "./components/FinanceInvoiceBillingInfoCard";
import { InvoiceDeliveryChargesCard } from "./components/InvoiceDeliveryChargesCard";
import { FinanceInvoiceNotesCard } from "./components/FinanceInvoiceNotesCard";
import { FinanceInvoiceTimelineCard } from "./components/FinanceInvoiceTimelineCard";
import { financeInvoices, exportFinanceInvoicesToCsv } from "./companyInvoicesOverview";
import { getFinanceInvoiceDetail } from "./financeInvoiceDetail";
import { downloadFinanceInvoicePdf } from "./downloadFinanceInvoicePdf";

export function FinanceInvoicePage() {
  const { id } = useParams<{ id: string }>();
  const { showToast } = useToast();

  const invoice = financeInvoices.find((i) => i.id === id);
  if (!invoice) return <Navigate to="/finance/invoices" replace />;

  const detail = getFinanceInvoiceDetail(invoice);

  return (
    <div className="flex flex-col gap-6">
      <Link to="/finance/invoices" className="flex w-fit items-center gap-1.5 text-sm text-text-muted hover:text-text">
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Company Invoices
      </Link>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-heading-1 text-text">Invoice #{invoice.id}</h1>
            <FinanceInvoiceStatusBadge status={invoice.status} />
          </div>
          <p className="text-body mt-1 text-text-muted">{invoice.company}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              exportFinanceInvoicesToCsv([invoice], `${invoice.id}.csv`);
              showToast("success", "Invoice exported to CSV.");
            }}
          >
            Export
          </Button>
          <Button type="button" variant="secondary" onClick={() => downloadFinanceInvoicePdf(detail)}>
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => showToast("error", "TODO: no shared ID space between finance invoices and orders yet.")}
          >
            <ExternalLink className="h-4 w-4" />
            View Related Order
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-[var(--radius-card)] border border-border bg-sidebar p-5 text-white shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-label text-white/70">Total Amount Due</p>
          <p className="text-2xl font-semibold">${invoice.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="text-right text-sm text-white/70">
          <p>Billing Period: {invoice.periodLabel}</p>
          <p>Due: {invoice.dueDate}</p>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_1.6fr]">
        <FinanceInvoiceBillingInfoCard detail={detail} />
        <InvoiceDeliveryChargesCard detail={detail} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <FinanceInvoiceNotesCard notes={detail.billingNotes} />
        <FinanceInvoiceTimelineCard events={detail.timeline} />
      </div>
    </div>
  );
}
