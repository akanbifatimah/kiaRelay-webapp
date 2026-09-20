import type { FinanceInvoice, FinanceInvoiceStatus } from "./companyInvoicesOverview";

export interface FinanceInvoiceLineItem {
  orderId: string;
  description: string;
  route: string;
  date: string;
  amount: string;
}

export type FinanceInvoiceTimelineTone = "success" | "warning" | "muted" | "danger";

export interface FinanceInvoiceTimelineEvent {
  label: string;
  timestamp: string;
  tone: FinanceInvoiceTimelineTone;
}

export interface FinanceInvoiceDetail {
  invoice: FinanceInvoice;
  taxId: string;
  billingAddress: string;
  paymentMethodLabel: string;
  termsLabel: string;
  lineItems: FinanceInvoiceLineItem[];
  subtotal: string;
  platformFeeLabel: string;
  platformFee: string;
  fuelSurcharge: string;
  billingNotes: string;
  timeline: FinanceInvoiceTimelineEvent[];
}

function pick<T>(list: T[], seed: string): T {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  return list[Math.abs(hash) % list.length];
}

function currency(value: number): string {
  return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
}

const routes = ["Chicago, IL to Detroit, MI", "Dallas, TX to Houston, TX", "Seattle, WA to Portland, OR", "Miami, FL to Orlando, FL"];
const addresses = [
  "4820 Industrial Pkwy, Suite 200, Chicago, IL 60607",
  "1150 Freight Rd, Dallas, TX 75201",
  "302 Harbor Ave, Seattle, WA 98134",
  "77 Commerce Blvd, Miami, FL 33101",
];
const paymentMethods = ["ACH — Bank of America ••4821", "Wire Transfer — Chase ••1190", "ACH — Wells Fargo ••3307"];

const timelineByStatus: Record<FinanceInvoiceStatus, (invoice: FinanceInvoice) => FinanceInvoiceTimelineEvent[]> = {
  paid: (invoice) => [
    { label: "Payment Received", timestamp: invoice.dueDate, tone: "success" },
    { label: "Invoice Viewed by Company", timestamp: invoice.periodLabel, tone: "warning" },
    { label: "Invoice Generated", timestamp: invoice.periodLabel, tone: "muted" },
  ],
  sent: (invoice) => [
    { label: "Invoice Viewed by Company", timestamp: invoice.periodLabel, tone: "warning" },
    { label: "Invoice Generated", timestamp: invoice.periodLabel, tone: "muted" },
  ],
  overdue: (invoice) => [
    { label: "Payment Overdue", timestamp: invoice.dueDate, tone: "danger" },
    { label: "Invoice Viewed by Company", timestamp: invoice.periodLabel, tone: "warning" },
    { label: "Invoice Generated", timestamp: invoice.periodLabel, tone: "muted" },
  ],
};

// TODO: replace with GET /finance/invoices/:id once the Financial
// Management API exists. Billing/line-item/timeline detail is computed
// deterministically from the base FinanceInvoice row rather than a second
// hand-authored dataset, same "compute, don't hand-author every row"
// technique as transactionDetail.ts/adjustmentDetail.ts.
export function getFinanceInvoiceDetail(invoice: FinanceInvoice): FinanceInvoiceDetail {
  const platformFeeRate = 0.03;
  const platformFee = Math.round(invoice.amount * platformFeeRate * 100) / 100;
  const fuelSurcharge = Math.round(invoice.amount * 0.015 * 100) / 100;
  const subtotal = Math.round((invoice.amount - platformFee - fuelSurcharge) * 100) / 100;
  const route = pick(routes, invoice.id);
  const lineItemCount = 1 + (Math.abs(invoice.id.charCodeAt(invoice.id.length - 1)) % 3);

  return {
    invoice,
    taxId: `${20 + (Math.abs(invoice.id.charCodeAt(4)) % 79)}-${1000000 + (Math.abs(invoice.id.charCodeAt(5)) % 8999999)}`,
    billingAddress: pick(addresses, invoice.company),
    paymentMethodLabel: pick(paymentMethods, invoice.id),
    termsLabel: "Net 30 Terms",
    lineItems: Array.from({ length: lineItemCount }, (_, i) => ({
      orderId: `ORD-${2800 + (Math.abs(invoice.id.charCodeAt(i + 3)) % 999)}`,
      description: `Shipment — ${invoice.company}`,
      route,
      date: invoice.periodLabel,
      amount: currency(Math.round((invoice.amount / lineItemCount) * 100) / 100),
    })),
    subtotal: currency(subtotal),
    platformFeeLabel: `Platform Fee (${(platformFeeRate * 100).toFixed(0)}%)`,
    platformFee: currency(platformFee),
    fuelSurcharge: currency(fuelSurcharge),
    billingNotes: `Invoice covers all deliveries dispatched for ${invoice.company} during ${invoice.periodLabel}.`,
    timeline: timelineByStatus[invoice.status](invoice),
  };
}
