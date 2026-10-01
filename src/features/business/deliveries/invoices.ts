import { eventTime, stageOf } from "./deliverySim";
import { formatMoney, sumLines } from "./pricing";
import type { Invoice, InvoiceStatus } from "../../customers/companyInvoices";
import type { DeliveryOrder } from "./deliveryTypes";

// Business invoicing (2026-10-01), same as the customer app's
// src/lib/invoices.ts. Per PRD §4.2 each delivery's charge accrues when
// it's delivered; the company is invoiced on its Invoice Frequency (admin's
// billing config): each invoice lists every delivery in its period, as the
// "Invoices & Statements" design shows. "Per Delivery" is the PRD's literal
// one-invoice-per-delivery. Deliveries in the open period are unbilled.
// TODO: replace with GET /customers/:id/invoices; the server bills.

export type InvoiceFrequency = "Per Delivery" | "Weekly" | "Monthly" | "Quarterly";
export const INVOICE_FREQUENCIES: InvoiceFrequency[] = ["Per Delivery", "Weekly", "Monthly", "Quarterly"];

export interface BillingOptions {
  frequency: InvoiceFrequency;
  termsDays: number;
  /** Invoice id → when it was paid (Pay Now). */
  payments?: Record<string, string>;
}

const DAY = 86_400_000;

export const formatDay = (ms: number) => new Date(ms).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
const pad = (n: number, width: number) => String(n).padStart(width, "0");

/** Total charged, including accrued demurrage. */
export const orderTotal = (order: DeliveryOrder) => sumLines(order.quote.lines);
/** Tax & fees within an order's total. */
export const orderTax = (order: DeliveryOrder) => sumLines(order.quote.lines.filter((l) => /tax/i.test(l.label)));

const deliveredAt = (order: DeliveryOrder) => Date.parse(eventTime(order, "delivered") ?? order.createdAt);

/** The billing period containing `ms`: key, invoice number and when it closes. */
function periodOf(ms: number, frequency: Exclude<InvoiceFrequency, "Per Delivery">): { key: string; number: string; end: number } {
  const d = new Date(ms);
  if (frequency === "Weekly") {
    const start = new Date(d.getFullYear(), d.getMonth(), d.getDate() - ((d.getDay() + 6) % 7));
    const week = Math.ceil(((start.getTime() - new Date(start.getFullYear(), 0, 1).getTime()) / DAY + 1) / 7);
    return { key: `W${start.getTime()}`, number: `${start.getFullYear()}-W${pad(week, 2)}`, end: start.getTime() + 7 * DAY - 1 };
  }
  const months = frequency === "Monthly" ? 1 : 3;
  const first = Math.floor(d.getMonth() / months) * months;
  return { key: `${frequency}${d.getFullYear()}-${first}`, number: `${d.getFullYear()}-${pad(first + 1, 3)}`, end: new Date(d.getFullYear(), first + months, 1).getTime() - 1 };
}

function statusFor(id: string, due: number, now: number, index: number, payments: Record<string, string>): InvoiceStatus {
  if (payments[id]) return "paid";
  if (due > now) return "pending";
  // Mock payment behavior: most past-due invoices were paid, one in five stays open.
  return index % 5 === 2 ? "overdue" : "paid";
}

export interface BillingSummary {
  invoices: Invoice[];
  /** Delivered but not yet invoiced (the open period). */
  unbilled: DeliveryOrder[];
  /** When the open period's invoice is issued. */
  nextInvoiceOn?: number;
}

export function buildBilling(orders: DeliveryOrder[], options: BillingOptions, now = Date.now()): BillingSummary {
  const billable = orders.filter((o) => o.payment.kind === "invoice" && stageOf(o, now) === "delivered").sort((a, b) => deliveredAt(b) - deliveredAt(a));
  const groups = new Map<string, { number: string; issued: number; orders: DeliveryOrder[] }>();
  const unbilled: DeliveryOrder[] = [];
  let nextInvoiceOn: number | undefined;
  for (const order of billable) {
    const at = deliveredAt(order);
    const period = options.frequency === "Per Delivery" ? { key: order.id, number: `${new Date(at).getFullYear()}-${order.id.replace(/\D/g, "")}`, end: at } : periodOf(at, options.frequency);
    if (period.end > now) {
      unbilled.push(order);
      nextInvoiceOn = period.end + 1;
      continue;
    }
    const group = groups.get(period.key) ?? { number: period.number, issued: period.end + 1, orders: [] };
    group.orders.push(order);
    groups.set(period.key, group);
  }
  const invoices = [...groups.values()].map((group, index) => {
    const id = `INV-${group.number}`;
    const issued = options.frequency === "Per Delivery" ? group.issued - 1 : group.issued;
    const due = issued + options.termsDays * DAY;
    const branches = [...new Set(group.orders.map((o) => o.branch))];
    return {
      id,
      orderRef: group.orders.length === 1 ? group.orders[0].id.replace(/^#/, "") : `${group.orders.length} deliveries`,
      orderIds: group.orders.map((o) => o.id),
      branch: branches.length === 1 ? branches[0] : "All branches",
      date: formatDay(issued),
      dueDate: formatDay(due),
      amount: formatMoney(group.orders.reduce((sum, o) => sum + orderTotal(o), 0)),
      status: statusFor(id, due, now, index, options.payments ?? {}),
    };
  });
  return { invoices, unbilled, nextInvoiceOn };
}

/** The invoice that bills an order, if it has been invoiced yet. */
export const invoiceForOrder = (invoices: Invoice[], orderId: string) => invoices.find((i) => i.orderIds?.includes(orderId));

/** "$1,250.00" → 1250. */
export const parseMoney = (amount: string) => Number(amount.replace(/[^0-9.]/g, "")) || 0;

/** Unpaid (pending + overdue) total. */
export const outstandingTotal = (invoices: Invoice[]) => invoices.filter((invoice) => invoice.status !== "paid").reduce((sum, invoice) => sum + parseMoney(invoice.amount), 0);

/** Days past due, for "Overdue by 5 days". */
export const daysOverdue = (invoice: Invoice, now = Date.now()) => Math.max(0, Math.floor((now - Date.parse(invoice.dueDate)) / DAY));
