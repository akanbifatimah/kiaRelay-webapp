import { useMemo, useState } from "react";
import { ArrowLeft, Download } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import { Button } from "../../components/Button";
import { useToast } from "../../components/toast/ToastContext";
import { InvoiceStatusBadge } from "./components/InvoiceStatusBadge";
import { InvoiceSummaryStats } from "./components/InvoiceSummaryStats";
import { InvoiceBillingInfoCard } from "./components/InvoiceBillingInfoCard";
import { InvoiceLineItemsCard } from "./components/InvoiceLineItemsCard";
import { InvoiceNotesCard } from "./components/InvoiceNotesCard";
import { InvoiceTimelineCard } from "./components/InvoiceTimelineCard";
import { EditInvoiceBillingDetailsModal } from "./components/EditInvoiceBillingDetailsModal";
import { customers } from "./data";
import { getCustomerDetail } from "./customerDetails";
import { getCompanyInvoicingOverview } from "./companyInvoices";
import { getInvoiceDetail, type InvoiceDetail } from "./invoiceDetail";
import { exportInvoicesToCsv } from "./filterInvoices";
import { downloadInvoicePdf } from "./downloadInvoicePdf";

export function InvoiceDetailPage() {
  const { accountType, id, invoiceId } = useParams<{ accountType: string; id: string; invoiceId: string }>();
  const { showToast } = useToast();
  const [isEditOpen, setIsEditOpen] = useState(false);

  const customer = customers.find((c) => c.id === id);
  const detail = customer ? getCustomerDetail(customer) : null;
  const overview = useMemo(() => (detail ? getCompanyInvoicingOverview(detail) : null), [detail]);
  const invoice = overview?.invoices.find((i) => i.id === invoiceId);
  const invoicesHref = `/customers/${accountType}/${id}/invoices`;

  const [invoiceDetail, setInvoiceDetail] = useState<InvoiceDetail | null>(() =>
    invoice && detail ? getInvoiceDetail(invoice, detail.name) : null,
  );

  if (!customer || !detail || !overview || !invoice || !invoiceDetail) {
    return <Navigate to={invoicesHref} replace />;
  }

  return (
    <div className="flex flex-col gap-6">
      <Link to={invoicesHref} className="flex w-fit items-center gap-1.5 text-sm text-text-muted hover:text-text">
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Invoices
      </Link>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-heading-1 text-text">Invoice #{invoiceDetail.id}</h1>
            <InvoiceStatusBadge status={invoiceDetail.status} />
          </div>
          <p className="text-body mt-1 text-text-muted">{invoiceDetail.customerName}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              exportInvoicesToCsv([invoice], `${invoiceDetail.id}.csv`);
              showToast("success", "Invoice exported to CSV.");
            }}
          >
            Export
          </Button>
          <Button type="button" variant="secondary" onClick={() => downloadInvoicePdf(invoiceDetail)}>
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>

      <InvoiceSummaryStats detail={invoiceDetail} />

      <div className="grid gap-4 xl:grid-cols-[1fr_1.6fr]">
        <InvoiceBillingInfoCard detail={invoiceDetail} onEditDetails={() => setIsEditOpen(true)} />
        <InvoiceLineItemsCard detail={invoiceDetail} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <InvoiceNotesCard notes={invoiceDetail.billingNotes} />
        <InvoiceTimelineCard events={invoiceDetail.timeline} />
      </div>

      {isEditOpen && (
        <EditInvoiceBillingDetailsModal
          detail={invoiceDetail}
          onClose={() => setIsEditOpen(false)}
          onSave={(updated) => {
            setInvoiceDetail(updated);
            showToast("success", "Billing details updated.");
          }}
        />
      )}
    </div>
  );
}
