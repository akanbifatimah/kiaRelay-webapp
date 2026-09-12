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
// Management / billing API exists. Only KR-77410-JW (Acme Refinery) is
// hand-authored to match the Figma reference — every other company falls
// back to the generic shape in getCompanyInvoicingOverview().
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
      cycleDescription: "Invoices generated on 1st of every month",
      contactName: "James Donovan",
      contactEmail: "j.donovan@acmerefinery.com",
      addressLabel: "HQ Refinery Way",
      addressDetail: "4300 Refinery Way, Houston, TX 77001",
      deliveryMethod: "Automated Email (PDF)",
      deliveryDescription: "Sent to contact and j.donovan@acmerefinery.com",
      lastUpdatedLabel: "Today, 08:40 AM",
    },
    invoices: [
      {
        id: "INV-88210",
        orderRef: "ORD-2034-K",
        branch: "New York Hub",
        date: "Oct 24, 2023",
        dueDate: "Nov 23, 2023",
        amount: "$12,490.00",
        status: "paid",
      },
      {
        id: "INV-88211",
        orderRef: "ORD-2035-B",
        branch: "Chicago Depot",
        date: "Oct 25, 2023",
        dueDate: "Nov 05, 2023",
        amount: "$4,820.00",
        status: "overdue",
      },
      {
        id: "INV-88212",
        orderRef: "ORD-2038-Z",
        branch: "L.A. Terminal",
        date: "Oct 25, 2023",
        dueDate: "Nov 26, 2023",
        amount: "$1,200.00",
        status: "pending",
      },
      {
        id: "INV-88213",
        orderRef: "ORD-2040-K",
        branch: "New York Hub",
        date: "Oct 27, 2023",
        dueDate: "Nov 27, 2023",
        amount: "$22,100.50",
        status: "paid",
      },
      {
        id: "INV-88214",
        orderRef: "ORD-2041-M",
        branch: "Chicago Depot",
        date: "Oct 28, 2023",
        dueDate: "Nov 28, 2023",
        amount: "$7,300.00",
        status: "pending",
      },
      {
        id: "KR-INV-8842",
        orderRef: "ORD-49221",
        branch: "Chicago Depot",
        date: "Oct 24, 2023",
        dueDate: "Nov 07, 2023",
        amount: "$12,842.50",
        status: "paid",
      },
      ...buildFillerInvoices(122),
    ],
  },
};
