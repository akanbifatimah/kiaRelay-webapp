import type { Invoice } from "./companyInvoices";
import { handAuthoredInvoiceDetails } from "./invoiceDetailData";

export interface InvoiceLineItem {
  orderId: string;
  description: string;
  route: string;
  date: string;
  amount: string;
}

// Historical event log, not a forward-progress tracker (see Timeline in
// src/components) — tone reflects event type, not done/active/pending
// sequence, since every listed event already happened.
export type InvoiceTimelineTone = "success" | "warning" | "muted" | "danger";

export interface InvoiceTimelineEvent {
  label: string;
  timestamp: string;
  tone: InvoiceTimelineTone;
}

export interface InvoiceDetail {
  id: string;
  status: Invoice["status"];
  customerName: string;
  taxId: string;
  billingAddress: string;
  paymentMethodLabel: string;
  invoiceDate: string;
  invoiceGeneratedAt: string;
  dueDate: string;
  termsLabel: string;
  lineItems: InvoiceLineItem[];
  subtotal: string;
  platformFeeLabel: string;
  platformFee: string;
  fuelSurcharge: string;
  totalDue: string;
  billingNotes: string;
  timeline: InvoiceTimelineEvent[];
}

function parseAmount(amount: string): number {
  return Number(amount.replace(/[^0-9.]/g, "")) || 0;
}

function currency(value: number): string {
  return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
}

const timelineByStatus: Record<Invoice["status"], (invoice: Invoice) => InvoiceTimelineEvent[]> = {
  paid: (invoice) => [
    { label: "Payment Completed", timestamp: invoice.dueDate, tone: "success" },
    { label: "Invoice Viewed by Client", timestamp: invoice.date, tone: "warning" },
    { label: "Invoice Generated", timestamp: invoice.date, tone: "muted" },
  ],
  pending: (invoice) => [
    { label: "Invoice Viewed by Client", timestamp: invoice.date, tone: "warning" },
    { label: "Invoice Generated", timestamp: invoice.date, tone: "muted" },
  ],
  overdue: (invoice) => [
    { label: "Payment Overdue", timestamp: invoice.dueDate, tone: "danger" },
    { label: "Invoice Viewed by Client", timestamp: invoice.date, tone: "warning" },
    { label: "Invoice Generated", timestamp: invoice.date, tone: "muted" },
  ],
};

// TODO: replace with GET /invoices/:id once the Customer Management /
// billing API exists. Only KR-INV-8842 is hand-authored (multi-line-item
// breakdown, timeline) to match the Figma reference — every other invoice
// (including every row on the Company Invoices list) synthesizes a
// single-line-item detail from its own list row so every row is clickable.
export function getInvoiceDetail(invoice: Invoice, customerName: string): InvoiceDetail {
  const handAuthored = handAuthoredInvoiceDetails[invoice.id];
  if (handAuthored) return handAuthored;

  const amount = parseAmount(invoice.amount);

  return {
    id: invoice.id,
    status: invoice.status,
    customerName,
    taxId: "—",
    billingAddress: "—",
    paymentMethodLabel: "—",
    invoiceDate: invoice.date,
    invoiceGeneratedAt: "Auto-generated",
    dueDate: invoice.dueDate,
    termsLabel: "Net 30 Terms",
    lineItems: [
      {
        orderId: invoice.orderRef,
        description: `Shipment — ${invoice.branch}`,
        route: invoice.branch,
        date: invoice.date,
        amount: invoice.amount,
      },
    ],
    subtotal: currency(amount),
    platformFeeLabel: "Platform Fee (0%)",
    platformFee: "$0.00",
    fuelSurcharge: "$0.00",
    totalDue: currency(amount),
    billingNotes: "No notes on this invoice.",
    timeline: timelineByStatus[invoice.status](invoice),
  };
}
