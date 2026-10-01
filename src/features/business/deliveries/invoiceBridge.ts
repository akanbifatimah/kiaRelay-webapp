import { getCustomerDetail, type CustomerDetail } from "../../customers/customerDetails";
import type { Invoice } from "../../customers/companyInvoices";
import type { InvoiceDetail, InvoiceTimelineEvent } from "../../customers/invoiceDetail";
import { getCompanyOverview } from "../../customers/companyOverview";
import { findCustomer } from "../../customers/data";
import { getBillingState, paidInvoices, paymentFor, toFrequency } from "./billingStore";
import { getDeliveries } from "./deliveriesStore";
import { cityState } from "./display";
import { buildBilling, orderTax, orderTotal, type BillingSummary, type InvoiceFrequency } from "./invoices";
import { formatMoney } from "./pricing";

// Invoices for companies that book through the portal/app (2026-10-01):
// built from their delivered orders on the company's Invoice Frequency
// (admin's Billing Configuration), so admin, the KiaRelay Business portal
// and the app list the same invoices. TODO: GET /customers/:id/invoices.

/** Admin's Invoice Frequency for a company; portal sign-ups default to Per
 * Delivery (PRD §4.2), the hand-authored Acme record is Monthly. */
export function companyFrequency(customerId: string, getDetail: (id: string) => CustomerDetail | undefined): InvoiceFrequency {
  const override = getBillingState().frequency[customerId];
  if (override) return override;
  const detail = getDetail(customerId);
  return toFrequency(detail ? getCompanyOverview(detail).billingConfig.invoiceFrequency : undefined);
}

export function companyBilling(customerId: string, termsDays: number, frequency: InvoiceFrequency): BillingSummary {
  const deliveries = getDeliveries().filter((order) => order.customerId === customerId);
  return buildBilling(deliveries, { frequency, termsDays, payments: paidInvoices(getBillingState(), customerId) });
}

/** A company's admin detail by id (incl. portal sign-ups). */
export function detailOf(customerId: string): CustomerDetail | undefined {
  const customer = findCustomer(customerId);
  return customer ? getCustomerDetail(customer) : undefined;
}

const termsDaysOf = (detail: Pick<CustomerDetail, "creditTerms">) => Number(detail.creditTerms?.paymentTerms.slice(4) ?? 30);

/** The company's delivery invoices, or undefined if it has no deliveries. */
export function deliveryInvoices(detail: CustomerDetail): Invoice[] | undefined {
  if (!getDeliveries().some((order) => order.customerId === detail.id)) return undefined;
  return companyBilling(detail.id, termsDaysOf(detail), companyFrequency(detail.id, () => detail)).invoices;
}

/** Invoice detail itemizing every delivery it bills, or undefined. */
export function deliveryInvoiceDetail(invoice: Invoice, customerName: string): InvoiceDetail | undefined {
  const orders = getDeliveries().filter((o) => invoice.orderIds?.includes(o.id));
  if (!orders.length) return undefined;
  const fuel = orders.reduce((sum, o) => sum + o.quote.lines.filter((l) => /fuel/i.test(l.label)).reduce((s, l) => s + l.amount, 0), 0);
  const tax = orders.reduce((sum, o) => sum + orderTax(o), 0);
  const total = orders.reduce((sum, o) => sum + orderTotal(o), 0);
  const payment = paymentFor(getBillingState(), orders[0].customerId, invoice.id);
  const timeline: InvoiceTimelineEvent[] = [
    ...(payment ? [{ label: `Paid with ${payment.methodLabel}`, timestamp: new Date(payment.paidAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }), tone: "success" as const }] : invoice.status === "paid" ? [{ label: "Payment Completed", timestamp: invoice.dueDate, tone: "success" as const }] : []),
    ...(invoice.status === "overdue" ? [{ label: "Payment Overdue", timestamp: invoice.dueDate, tone: "danger" as const }] : []),
    { label: `Invoice Generated — ${orders.length} ${orders.length === 1 ? "delivery" : "deliveries"}`, timestamp: invoice.date, tone: "muted" },
  ];
  return {
    id: invoice.id,
    status: invoice.status,
    customerName,
    taxId: "—",
    billingAddress: invoice.branch,
    paymentMethodLabel: payment?.methodLabel ?? "ACH or card on file",
    invoiceDate: invoice.date,
    invoiceGeneratedAt: `${companyFrequency(orders[0].customerId, detailOf)} billing`,
    dueDate: invoice.dueDate,
    termsLabel: orders[0].payment.label.replace("Invoice · ", "") + " Terms",
    lineItems: orders.map((o) => ({
      orderId: o.id,
      description: `${o.load.description}${o.references.po ? ` (${o.references.po})` : ""}`,
      route: `${cityState(o.pickup.address)} → ${cityState(o.dropoff.address)}`,
      date: new Date(o.events.find((e) => e.stage === "delivered")?.at ?? o.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      amount: formatMoney(orderTotal(o) - orderTax(o) - o.quote.lines.filter((l) => /fuel/i.test(l.label)).reduce((s, l) => s + l.amount, 0)),
    })),
    subtotal: formatMoney(total - fuel - tax),
    platformFeeLabel: "Tax & Fees",
    platformFee: formatMoney(tax),
    fuelSurcharge: formatMoney(fuel),
    totalDue: invoice.status === "paid" ? formatMoney(0) : formatMoney(total),
    billingNotes: `${orders.length} ${orders.length === 1 ? "delivery" : "deliveries"} completed in the billing period.`,
    timeline,
  };
}
