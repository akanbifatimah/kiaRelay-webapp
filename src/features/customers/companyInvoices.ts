import type { CustomerDetail } from "./customerDetails";
import { companyInvoicingOverviews, buildFillerInvoices } from "./companyInvoicesData";

export type InvoiceStatus = "paid" | "overdue" | "pending";

export interface Invoice {
  id: string;
  orderRef: string;
  branch: string;
  date: string;
  dueDate: string;
  amount: string;
  status: InvoiceStatus;
}

export interface BillingTermsDetail {
  cycle: string;
  cycleDescription: string;
  contactName: string;
  contactEmail: string;
  addressLabel: string;
  addressDetail: string;
  deliveryMethod: string;
  deliveryDescription: string;
  lastUpdatedLabel: string;
}

export interface CompanyInvoicingOverview {
  totalReceivables: string;
  receivablesDeltaLabel: string;
  paidInvoicesTotal: string;
  paidInvoicesWindowLabel: string;
  overdueTotal: string;
  overdueCountLabel: string;
  billingTerms: BillingTermsDetail;
  invoices: Invoice[];
}

function parseAmount(amount: string): number {
  return Number(amount.replace(/[^0-9.]/g, "")) || 0;
}

function formatCurrency(value: number): string {
  return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
}

// TODO: replace with GET /customers/:id/invoices once the Customer
// Management / billing API exists. Only KR-77410-JW (Acme Refinery) is
// hand-authored to match the Figma reference — see companyInvoicesData.ts.
// Every other company used to fall back to an empty invoice list and blank
// billing terms, which left the Invoices table and Payment Methods card
// with nothing to show — generates real filler invoices instead, same
// `buildFillerInvoices()` used to pad Acme's own list.
export function getCompanyInvoicingOverview(detail: CustomerDetail): CompanyInvoicingOverview {
  const existing = companyInvoicingOverviews[detail.id];
  if (existing) return existing;

  const invoices = buildFillerInvoices(24);
  const overdueInvoices = invoices.filter((invoice) => invoice.status === "overdue");
  const paidTotal = invoices
    .filter((invoice) => invoice.status === "paid")
    .reduce((sum, invoice) => sum + parseAmount(invoice.amount), 0);
  const overdueTotal = overdueInvoices.reduce((sum, invoice) => sum + parseAmount(invoice.amount), 0);
  const totalReceivables = invoices.reduce((sum, invoice) => sum + parseAmount(invoice.amount), 0);

  return {
    totalReceivables: formatCurrency(totalReceivables),
    receivablesDeltaLabel: "—",
    paidInvoicesTotal: formatCurrency(paidTotal),
    paidInvoicesWindowLabel: "Last 30 Days",
    overdueTotal: formatCurrency(overdueTotal),
    overdueCountLabel: `${overdueInvoices.length} Invoice${overdueInvoices.length === 1 ? "" : "s"}`,
    billingTerms: {
      cycle: "Monthly",
      cycleDescription: "Invoices generated on 1st of every month",
      contactName: detail.name,
      contactEmail: detail.email,
      addressLabel: "—",
      addressDetail: "—",
      deliveryMethod: "Automated Email (PDF)",
      deliveryDescription: `Sent to ${detail.email}`,
      lastUpdatedLabel: "—",
    },
    invoices,
  };
}
