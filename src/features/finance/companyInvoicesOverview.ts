import type { FinanceStat } from "./data";

export type FinanceInvoiceStatus = "paid" | "overdue" | "sent";

export interface FinanceInvoice {
  id: string;
  company: string;
  periodLabel: string;
  amount: number;
  status: FinanceInvoiceStatus;
  dueDate: string;
  lateDaysLabel?: string;
  lateIsUrgent?: boolean;
}

function daysAgoDate(n: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - n);
  return date;
}

function daysFromNowDate(n: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + n);
  return date;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// TODO: replace with GET /finance/invoices once the Financial Management
// API exists. Independent from customers' own per-company invoice lists
// (companyInvoicesData.ts) — this is the all-companies aggregate, same
// documented id-space independence as Orders vs Invoices elsewhere in
// this app (see CLAUDE.md).
const handAuthored: FinanceInvoice[] = [
  { id: "INV-2023-9942", company: "SwiftLogistics Global", periodLabel: "Oct 01 - Oct 15", amount: 24500, status: "overdue", dueDate: formatDate(daysAgoDate(14)), lateDaysLabel: "14 Days", lateIsUrgent: true },
  { id: "INV-2023-9941", company: "NorthStar Carriers", periodLabel: "Oct 01 - Oct 15", amount: 12800, status: "paid", dueDate: formatDate(daysFromNowDate(5)) },
  { id: "INV-2023-9945", company: "Peak Freight Ltd.", periodLabel: "Oct 16 - Oct 31", amount: 8120, status: "sent", dueDate: formatDate(daysFromNowDate(2)), lateDaysLabel: "in 2 Days" },
  { id: "INV-2023-9938", company: "Horizon Trucking", periodLabel: "Sep 15 - Sep 30", amount: 42100, status: "overdue", dueDate: formatDate(daysAgoDate(29)), lateDaysLabel: "29 Days", lateIsUrgent: true },
];

const fillerCompanies = ["Vertex Freight Co.", "Cascade Supply Chain", "Harborline Traders", "Bright Path Retail", "Meridian Logistics"];
const fillerStatuses: FinanceInvoiceStatus[] = ["paid", "sent", "paid", "overdue", "paid"];

function buildFillerInvoices(count: number): FinanceInvoice[] {
  return Array.from({ length: count }, (_, i) => {
    const status = fillerStatuses[i % fillerStatuses.length];
    const isOverdue = status === "overdue";
    return {
      id: `INV-2023-9${900 - i}`,
      company: fillerCompanies[i % fillerCompanies.length],
      periodLabel: `${formatDate(daysAgoDate(30 + i * 15))} - ${formatDate(daysAgoDate(15 + i * 15))}`,
      amount: 6000 + ((i * 3137) % 40000),
      status,
      dueDate: isOverdue ? formatDate(daysAgoDate(3 + i)) : formatDate(daysFromNowDate(3 + i)),
      lateDaysLabel: isOverdue ? `${3 + i} Days` : undefined,
      lateIsUrgent: isOverdue,
    };
  });
}

export const financeInvoices: FinanceInvoice[] = [...handAuthored, ...buildFillerInvoices(241)];

export const companyInvoiceStats: FinanceStat[] = [
  { type: "revenue", label: "Total Invoiced", value: 1482900, deltaPct: 12.5 },
  { type: "net", label: "Paid", value: 1120450, secondaryLabel: "75.6% completion rate" },
  { type: "pending", label: "Outstanding", value: 362450, secondaryLabel: "18 Pending Approval" },
  { type: "refunds", label: "Overdue", value: 42, isCurrency: false, secondaryLabel: "$124,200.00 At Risk" },
];

export interface InvoiceFilters {
  search: string;
  status: FinanceInvoiceStatus | "all";
}

export function filterFinanceInvoices(rows: FinanceInvoice[], filters: InvoiceFilters): FinanceInvoice[] {
  const term = filters.search.trim().toLowerCase();
  return rows.filter((row) => {
    if (filters.status !== "all" && row.status !== filters.status) return false;
    if (term && !row.id.toLowerCase().includes(term) && !row.company.toLowerCase().includes(term)) return false;
    return true;
  });
}

export function exportFinanceInvoicesToCsv(rows: FinanceInvoice[], filename = "company-invoices.csv"): void {
  const headers = ["Invoice#", "Company", "Period", "Amount", "Status", "Due Date"];
  const csvRows = rows.map((r) => [r.id, r.company, r.periodLabel, r.amount.toFixed(2), r.status, r.dueDate]);
  const csv = [headers, ...csvRows].map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");

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
