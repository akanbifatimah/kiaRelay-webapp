import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { Card } from "../../../components/Card";
import { Button } from "../../../components/Button";
import { Pagination } from "../../../components/Pagination";
import { useToast } from "../../../components/toast/ToastContext";
import { InvoicesFilterBar } from "./InvoicesFilterBar";
import { CompanyInvoicesTable } from "./CompanyInvoicesTable";
import { GenerateInvoiceModal } from "./GenerateInvoiceModal";
import {
  financeInvoices,
  filterFinanceInvoices,
  exportFinanceInvoicesToCsv,
  type FinanceInvoice,
  type InvoiceFilters,
} from "../companyInvoicesOverview";

const PAGE_SIZE = 10;
const DEFAULT_FILTERS: InvoiceFilters = { search: "", status: "all" };

export function CompanyInvoicesSection() {
  const { showToast } = useToast();
  const [invoices, setInvoices] = useState<FinanceInvoice[]>(financeInvoices);
  const [filters, setFilters] = useState<InvoiceFilters>(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [showGenerate, setShowGenerate] = useState(false);

  const filtered = useMemo(() => filterFinanceInvoices(invoices, filters), [invoices, filters]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pageRows = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <InvoicesFilterBar
          filters={filters}
          onChange={(next) => {
            setFilters(next);
            setPage(1);
          }}
          onExport={() => {
            if (filtered.length === 0) {
              showToast("error", "No invoices match the current filters — nothing to export.");
              return;
            }
            exportFinanceInvoicesToCsv(filtered);
            showToast("success", `Exported ${filtered.length} invoice${filtered.length === 1 ? "" : "s"} to CSV.`);
          }}
        />
        <Button type="button" onClick={() => setShowGenerate(true)}>
          <Plus className="h-4 w-4" />
          Generate New Invoice
        </Button>
      </div>
      <CompanyInvoicesTable rows={pageRows} />
      <Pagination
        page={currentPage}
        pageCount={pageCount}
        total={filtered.length}
        pageSize={pageSize}
        itemLabel="invoices"
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
      />
      {showGenerate && (
        <GenerateInvoiceModal
          onClose={() => setShowGenerate(false)}
          onCreate={(invoice) => {
            setInvoices((prev) => [invoice, ...prev]);
            setPage(1);
            showToast("success", `Invoice ${invoice.id} generated for ${invoice.company}.`);
          }}
        />
      )}
    </Card>
  );
}
