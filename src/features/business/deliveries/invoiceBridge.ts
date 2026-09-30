import type { CustomerDetail } from "../../customers/customerDetails";
import type { Invoice } from "../../customers/companyInvoices";
import type { InvoiceDetail, InvoiceTimelineEvent } from "../../customers/invoiceDetail";
import { getDeliveries } from "./deliveriesStore";
import { cityState } from "./display";
import { invoicesFromDeliveries, orderTotal } from "./invoices";
import { formatMoney } from "./pricing";

// Admin invoices for companies that book through the portal/app
// (2026-09-30): derived from their delivered orders — one invoice per
// delivery — so admin, the KiaRelay Business portal and the app list the
// same invoices. TODO: GET /customers/:id/invoices.

const termsDays = (detail: Pick<CustomerDetail, "creditTerms">) => Number(detail.creditTerms?.paymentTerms.slice(4) ?? 30);

/** The company's delivery invoices, or undefined if it has no deliveries. */
export function deliveryInvoices(detail: Pick<CustomerDetail, "id" | "creditTerms">): Invoice[] | undefined {
  const deliveries = getDeliveries().filter((order) => order.customerId === detail.id);
  return deliveries.length ? invoicesFromDeliveries(deliveries, termsDays(detail)) : undefined;
}

/** Invoice detail built from the delivery it bills, or undefined. */
export function deliveryInvoiceDetail(invoice: Invoice, customerName: string): InvoiceDetail | undefined {
  const order = getDeliveries().find((o) => o.id === `#${invoice.orderRef}`);
  if (!order) return undefined;
  const lines = order.quote.lines;
  const fuel = lines.filter((l) => /fuel/i.test(l.label)).reduce((sum, l) => sum + l.amount, 0);
  const tax = lines.filter((l) => /tax/i.test(l.label)).reduce((sum, l) => sum + l.amount, 0);
  const total = orderTotal(order);
  const timeline: InvoiceTimelineEvent[] = [
    ...(invoice.status === "paid" ? [{ label: "Payment Completed", timestamp: invoice.dueDate, tone: "success" as const }] : []),
    ...(invoice.status === "overdue" ? [{ label: "Payment Overdue", timestamp: invoice.dueDate, tone: "danger" as const }] : []),
    { label: "Invoice Generated", timestamp: invoice.date, tone: "muted" },
    { label: `Delivered — signed by ${order.pod ? `${order.pod.signedByFirstName} ${order.pod.signedByLastName}` : "recipient"}`, timestamp: invoice.date, tone: "muted" },
  ];
  return {
    id: invoice.id,
    status: invoice.status,
    customerName,
    taxId: "—",
    billingAddress: `${order.branch} branch`,
    paymentMethodLabel: order.payment.label,
    invoiceDate: invoice.date,
    invoiceGeneratedAt: "Auto-generated on delivery",
    dueDate: invoice.dueDate,
    termsLabel: order.payment.label.replace("Invoice · ", "") + " Terms",
    lineItems: [
      {
        orderId: order.id,
        description: `${order.load.description} (${order.references.po || "no PO"})`,
        route: `${cityState(order.pickup.address)} → ${cityState(order.dropoff.address)}`,
        date: invoice.date,
        amount: formatMoney(total - fuel - tax),
      },
    ],
    subtotal: formatMoney(total - fuel - tax),
    platformFeeLabel: "Tax & Fees",
    platformFee: formatMoney(tax),
    fuelSurcharge: formatMoney(fuel),
    totalDue: formatMoney(total),
    billingNotes: [order.references.bol && `BOL ${order.references.bol}`, order.references.project && `Project ${order.references.project}`].filter(Boolean).join(" · ") || "No notes on this invoice.",
    timeline,
  };
}
