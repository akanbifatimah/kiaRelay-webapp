import type { CompanyInvoicingOverview, Invoice, InvoiceStatus } from "./companyInvoices";

const branches = ["New York Hub", "Chicago Depot", "L.A. Terminal"];
const fillerStatuses: InvoiceStatus[] = ["paid", "paid", "pending", "paid", "overdue"];

function daysAgoDate(n: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - n);
  return date;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// Padding rows for realistic pagination — dated relative to today (not a
// fixed year) so a future date-range filter has something real to match.
// Exported since getCompanyInvoicingOverview()'s generic fallback also uses
// it, for the same reason it exists here: an empty table for every company
// except the one hand-authored one.
export function buildFillerInvoices(count: number): Invoice[] {
  return Array.from({ length: count }, (_, i) => {
    const date = daysAgoDate(6 + i * 3);
    const due = daysAgoDate(6 + i * 3 - 30);
    return {
      id: `INV-${88300 + i}`,
      orderRef: `ORD-${2050 + i}-${String.fromCharCode(65 + (i % 26))}`,
      branch: branches[i % branches.length],
      date: formatDate(date),
      dueDate: formatDate(due),
      amount: `$${(800 + ((i * 137) % 24000)).toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      status: fillerStatuses[i % fillerStatuses.length],
    };
  });
}

// TODO: replace with GET /customers/:id/invoices once the Customer
// Management / billing API exists. KR-77410-JW (Acme Refinery) keeps its
// Figma billing terms; its invoices come from its deliveries — see
// getCompanyInvoicingOverview().
export const companyInvoicingOverviews: Record<string, CompanyInvoicingOverview> = {
  "KR-77410-JW": {
    totalReceivables: "$1,428,902",
    receivablesDeltaLabel: "+12.5%",
    paidInvoicesTotal: "$892,400",
    paidInvoicesWindowLabel: "Last 30 Days",
    overdueTotal: "$142,500",
    overdueCountLabel: "3 Invoices",
    billingTerms: {
      cycle: "Monthly",
      cycleDescription: "Completed deliveries invoiced monthly (Net 15)",
      contactName: "James Donovan",
      contactEmail: "j.donovan@acmerefinery.com",
      addressLabel: "HQ Refinery Way",
      addressDetail: "4300 Refinery Way, Houston, TX 77001",
      deliveryMethod: "Automated Email (PDF)",
      deliveryDescription: "Sent to contact and j.donovan@acmerefinery.com",
      lastUpdatedLabel: "Today, 08:40 AM",
    },
    // Acme books through the KiaRelay Business portal/app (2026-09-30): its
    // invoices and the three totals above are derived from its deliveries in
    // getCompanyInvoicingOverview(); only the billing terms here are used.
    invoices: [],
  },
};
