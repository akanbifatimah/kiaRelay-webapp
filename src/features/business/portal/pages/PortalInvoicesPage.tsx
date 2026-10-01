import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Download } from "lucide-react";
import { Card } from "../../../../components/Card";
import { DataTable, type Column } from "../../../../components/DataTable";
import { ExportMenuButton } from "../../../../components/ExportMenuButton";
import { PageHeader } from "../../../../components/PageHeader";
import { Pagination } from "../../../../components/Pagination";
import { StatTile } from "../../../../components/StatTile";
import { Tooltip } from "../../../../components/Tooltip";
import { useTableState } from "../../../../hooks/useTableState";
import { cn } from "../../../../lib/cn";
import type { Invoice } from "../../../customers/companyInvoices";
import { paymentTermsLabel } from "../../../customers/customerDetails";
import { downloadInvoicePdf } from "../../../customers/downloadInvoicePdf";
import { getInvoiceDetail } from "../../../customers/invoiceDetail";
import { formatMoney } from "../../deliveries/pricing";
import { formatDay, orderTotal, parseMoney } from "../../deliveries/invoices";
import { INVOICE_TONE } from "../paths";
import { usePortalAccount } from "../usePortalAccount";
import { usePortalBilling } from "../usePortalData";

type Filter = "all" | Invoice["status"];
type SortKey = "date" | "due" | "amount";
const SORTERS: Record<SortKey, (i: Invoice) => number> = { date: (i) => Date.parse(i.date), due: (i) => Date.parse(i.dueDate), amount: (i) => parseMoney(i.amount) };

// Invoices & Statements (2026-10-01, from the mobile design): one invoice
// per billing period (admin's Invoice Frequency) listing its deliveries —
// the same rows admin sees — plus balance, next payment and unbilled work.
export function PortalInvoicesPage() {
  const account = usePortalAccount();
  const navigate = useNavigate();
  const { invoices, terms, frequency, unbilled, nextInvoiceOn } = usePortalBilling(account);
  const [filter, setFilter] = useState<Filter>("all");
  const rows = useMemo(() => (filter === "all" ? invoices : invoices.filter((i) => i.status === filter)), [invoices, filter]);
  const table = useTableState({ rows, sorters: SORTERS, initialSort: { key: "date", direction: "desc" } });
  if (!account || !terms) return null;
  const name = account.company.legalName;
  const overdue = invoices.filter((i) => i.status === "overdue");
  const nextDue = invoices.filter((i) => i.status !== "paid").map((i) => Date.parse(i.dueDate)).sort((a, b) => a - b)[0];
  const count = (i: Invoice) => i.orderIds?.length ?? 1;

  const columns: Column<Invoice>[] = [
    { header: "Invoice", accessor: (i) => <span className="whitespace-nowrap font-semibold text-text">{i.id}</span> },
    { header: "Deliveries", accessor: (i) => <span className="whitespace-nowrap">{count(i)}</span> },
    { header: "Branch", accessor: (i) => <span className="whitespace-nowrap">{i.branch}</span> },
    { header: "Issued", sortKey: "date", accessor: (i) => <span className="whitespace-nowrap">{i.date}</span> },
    { header: "Due", sortKey: "due", accessor: (i) => <span className="whitespace-nowrap">{i.dueDate}</span> },
    { header: "Status", accessor: (i) => <span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold capitalize", INVOICE_TONE[i.status])}>{i.status}</span> },
    { header: "Amount", sortKey: "amount", align: "right", accessor: (i) => <span className="font-semibold">{i.amount}</span> },
    {
      header: "",
      align: "right",
      accessor: (i) => (
        <Tooltip label="Download PDF">
          <button type="button" aria-label={`Download ${i.id} as PDF`} onClick={(e) => { e.stopPropagation(); downloadInvoicePdf(getInvoiceDetail(i, name)); }} className="rounded p-1.5 text-text-muted hover:bg-bg hover:text-text">
            <Download className="h-4 w-4" />
          </button>
        </Tooltip>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Invoices & Statements" subtitle={`${name} · ${frequency} invoicing · ${paymentTermsLabel(terms.paymentTerms)} terms`} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile label="Outstanding Balance" value={formatMoney(terms.outstandingBalance)} accent="danger" />
        <StatTile label="Next Payment Due" value={nextDue ? formatDay(nextDue) : "—"} accent="primary" />
        <StatTile label="Available Credit" value={formatMoney(Math.max(0, terms.creditLimit - terms.outstandingBalance))} accent="success" />
        <StatTile label="Overdue" value={formatMoney(overdue.reduce((s, i) => s + parseMoney(i.amount), 0))} accent={overdue.length ? "danger" : "neutral"} delta={overdue.length ? { kind: "down", value: `${overdue.length} invoices` } : undefined} />
      </div>
      {unbilled.length > 0 && (
        <p className="rounded-lg bg-info/10 px-4 py-2 text-sm text-info">
          {unbilled.length} {unbilled.length === 1 ? "delivery" : "deliveries"} ({formatMoney(unbilled.reduce((s, o) => s + orderTotal(o), 0))}) will be on your next invoice{nextInvoiceOn ? ` on ${formatDay(nextInvoiceOn)}` : ""}.
        </p>
      )}
      <Card className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div role="tablist" className="flex rounded-lg bg-bg p-1">
            {(["all", "pending", "overdue", "paid"] as const).map((f) => (
              <button key={f} type="button" role="tab" aria-selected={filter === f} onClick={() => setFilter(f)} className={cn("rounded-md px-3 py-1.5 text-sm font-medium capitalize", filter === f ? "bg-surface text-text shadow-sm" : "text-text-muted")}>
                {f}
              </button>
            ))}
          </div>
          <ExportMenuButton
            label="Export All"
            getExport={() => ({
              title: `${name} invoices`,
              subtitle: `${table.sorted.length} invoices · ${filter}`,
              columns: [
                { header: "Invoice", value: (i: Invoice) => i.id },
                { header: "Deliveries", value: (i: Invoice) => count(i), align: "right" },
                { header: "Branch", value: (i: Invoice) => i.branch },
                { header: "Issued", value: (i: Invoice) => i.date },
                { header: "Due", value: (i: Invoice) => i.dueDate },
                { header: "Status", value: (i: Invoice) => i.status },
                { header: "Amount", value: (i: Invoice) => i.amount, align: "right" },
              ],
              rows: table.sorted,
            })}
          />
        </div>
        <DataTable columns={columns} rows={table.pageRows} rowKey={(i) => i.id} onRowClick={(i) => navigate(`/business/invoices/${i.id}`)} sort={table.sort} onSortChange={table.onSortChange} />
        {table.sorted.length === 0 && <p className="py-6 text-center text-sm text-text-muted">{invoices.length ? "No invoices with this status." : "Invoices appear here after your first delivery."}</p>}
        <Pagination {...table.pagination} itemLabel="invoices" />
      </Card>
    </div>
  );
}
