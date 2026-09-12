import { useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import { PageHeader } from "../../components/PageHeader";
import { Card } from "../../components/Card";
import { Pagination } from "../../components/Pagination";
import { useToast } from "../../components/toast/ToastContext";
import { CompanyInvoiceStatsRow } from "./components/CompanyInvoiceStatsRow";
import { BillingTermsSection } from "./components/BillingTermsSection";
import { EditBillingTermsModal } from "./components/EditBillingTermsModal";
import { CreateInvoiceModal } from "./components/CreateInvoiceModal";
import { InvoicesSectionHeader } from "./components/InvoicesSectionHeader";
import { InvoiceFilterBar } from "./components/InvoiceFilterBar";
import { InvoicesTable } from "./components/InvoicesTable";
import { customers } from "./data";
import { getCustomerDetail } from "./customerDetails";
import { getCompanyInvoicingOverview, type BillingTermsDetail, type Invoice } from "./companyInvoices";
import { filterInvoices, exportInvoicesToCsv, DEFAULT_INVOICE_FILTERS, type InvoiceFilters } from "./filterInvoices";
import { getInvoiceDetail } from "./invoiceDetail";
import { downloadInvoicePdf } from "./downloadInvoicePdf";

const PAGE_SIZE = 6;

export function CompanyInvoicesPage() {
  const { accountType, id } = useParams<{ accountType: string; id: string }>();
  const { showToast } = useToast();
  const customer = customers.find((c) => c.id === id);
  const detail = customer ? getCustomerDetail(customer) : null;

  const overview = useMemo(() => (detail ? getCompanyInvoicingOverview(detail) : null), [detail]);
  const [invoices, setInvoices] = useState<Invoice[]>(overview?.invoices ?? []);
  const [billingTerms, setBillingTerms] = useState<BillingTermsDetail | null>(overview?.billingTerms ?? null);
  const [filters, setFilters] = useState<InvoiceFilters>(DEFAULT_INVOICE_FILTERS);
  const [page, setPage] = useState(1);
  const [isEditTermsOpen, setIsEditTermsOpen] = useState(false);
  const [isCreateInvoiceOpen, setIsCreateInvoiceOpen] = useState(false);

  const filtered = useMemo(() => filterInvoices(invoices, filters), [invoices, filters]);

  if (!customer || !detail || !overview || !billingTerms) {
    return <Navigate to={`/customers/${accountType ?? "company"}`} replace />;
  }

  const branchOptions = Array.from(new Set(invoices.map((invoice) => invoice.branch)));
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pageRows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function handleFiltersChange(next: InvoiceFilters) {
    setFilters(next);
    setPage(1);
  }

  function handleMarkPaid(invoice: Invoice) {
    setInvoices((prev) => prev.map((i) => (i.id === invoice.id ? { ...i, status: "paid" } : i)));
    showToast("success", `${invoice.id} has been marked as paid.`);
  }

  // Non-null assertion is safe here: this function is only ever invoked
  // from JSX rendered after the `!detail` early-return above, but
  // TypeScript doesn't narrow `detail` inside a hoisted function
  // declaration's own body.
  function handleDownloadPdf(invoice: Invoice) {
    downloadInvoicePdf(getInvoiceDetail(invoice, detail!.name));
  }

  return (
    <div className="flex flex-col gap-6">
      <Link
        to={`/customers/${detail.accountType}/${detail.id}`}
        className="flex w-fit items-center gap-1.5 text-sm text-text-muted hover:text-text"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Profile
      </Link>

      <PageHeader title="Company Invoice and Billing" subtitle={detail.name} />

      <CompanyInvoiceStatsRow
        totalReceivables={overview.totalReceivables}
        receivablesDeltaLabel={overview.receivablesDeltaLabel}
        paidInvoicesTotal={overview.paidInvoicesTotal}
        paidInvoicesWindowLabel={overview.paidInvoicesWindowLabel}
        overdueTotal={overview.overdueTotal}
        overdueCountLabel={overview.overdueCountLabel}
      />

      <BillingTermsSection
        terms={billingTerms}
        paymentMethods={detail.paymentMethods}
        paymentsHref={`/customers/${detail.accountType}/${detail.id}/payments`}
        onEdit={() => setIsEditTermsOpen(true)}
      />

      <InvoicesSectionHeader
        onExport={() => {
          if (filtered.length === 0) {
            showToast("error", "No invoices match the current filters — nothing to export.");
            return;
          }
          exportInvoicesToCsv(filtered, `${detail.name.replace(/\s+/g, "-").toLowerCase()}-invoices.csv`);
          showToast("success", `Exported ${filtered.length} invoice${filtered.length === 1 ? "" : "s"} to CSV.`);
        }}
        onCreate={() => setIsCreateInvoiceOpen(true)}
      />

      <Card className="flex flex-col gap-4">
        <InvoiceFilterBar filters={filters} branchOptions={branchOptions} onChange={handleFiltersChange} />
        <InvoicesTable
          rows={pageRows}
          detailHrefFor={(invoice) => `/customers/${detail.accountType}/${detail.id}/invoices/${invoice.id}`}
          onMarkPaid={handleMarkPaid}
          onDownloadPdf={handleDownloadPdf}
        />
        <Pagination
          page={currentPage}
          pageCount={pageCount}
          total={filtered.length}
          pageSize={PAGE_SIZE}
          itemLabel="invoices"
          onPageChange={setPage}
        />
      </Card>

      {isEditTermsOpen && (
        <EditBillingTermsModal
          terms={billingTerms}
          onClose={() => setIsEditTermsOpen(false)}
          onUpdated={setBillingTerms}
        />
      )}

      {isCreateInvoiceOpen && (
        <CreateInvoiceModal
          branchOptions={branchOptions}
          onClose={() => setIsCreateInvoiceOpen(false)}
          onCreate={(invoice) => {
            setInvoices((prev) => [invoice, ...prev]);
            showToast("success", `${invoice.id} created.`);
          }}
        />
      )}
    </div>
  );
}
