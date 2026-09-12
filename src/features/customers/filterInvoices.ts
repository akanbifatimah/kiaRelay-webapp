import type { Invoice, InvoiceStatus } from "./companyInvoices";

export interface InvoiceFilters {
  status: InvoiceStatus | "all";
  branch: string | "all";
  dateFrom: string;
  dateTo: string;
}

export const DEFAULT_INVOICE_FILTERS: InvoiceFilters = {
  status: "all",
  branch: "all",
  dateFrom: "",
  dateTo: "",
};

export function filterInvoices(invoices: Invoice[], filters: InvoiceFilters): Invoice[] {
  const from = filters.dateFrom ? new Date(filters.dateFrom) : null;
  const to = filters.dateTo ? new Date(filters.dateTo) : null;

  return invoices.filter((invoice) => {
    if (filters.status !== "all" && invoice.status !== filters.status) return false;
    if (filters.branch !== "all" && invoice.branch !== filters.branch) return false;

    const date = new Date(invoice.date);
    if (from && date < from) return false;
    if (to && date > to) return false;

    return true;
  });
}

// Client-side only — exports whatever rows are currently filtered in memory.
// Swap for a real "export" endpoint once the Customer Management API exists.
export function exportInvoicesToCsv(invoices: Invoice[], filename = "invoices.csv"): void {
  const headers = ["Invoice No.", "Order Ref", "Branch", "Date", "Due Date", "Amount", "Status"];
  const rows = invoices.map((invoice) => [
    invoice.id,
    invoice.orderRef,
    invoice.branch,
    invoice.date,
    invoice.dueDate,
    invoice.amount,
    invoice.status,
  ]);
  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
