import { eventTime, stageOf } from "./deliverySim";
import { formatMoney, sumLines } from "./pricing";
import type { Invoice, InvoiceStatus } from "../../customers/companyInvoices";
import type { DeliveryOrder } from "./deliveryTypes";

// Business invoices derived from delivered orders (2026-09-30), one per
// delivery, same as the customer app's src/lib/invoices.ts — so admin's
// invoice list, the portal and this app all show the same rows.
// TODO: replace with GET /customers/:id/invoices; the server bills.

const DAY = 86_400_000;

export const formatDay = (ms: number) => new Date(ms).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

export const orderRef = (orderId: string) => orderId.replace(/^#/, "");
export const invoiceIdFor = (orderId: string) => `INV-${86000 + Number(orderId.replace(/\D/g, ""))}`;

/** Total charged, including accrued demurrage. */
export const orderTotal = (order: DeliveryOrder) => sumLines(order.quote.lines);

function statusFor(due: number, now: number, index: number): InvoiceStatus {
  if (due > now) return "pending";
  // Mock payment behavior: most are paid, one in five past due stays open.
  return index % 5 === 2 ? "overdue" : "paid";
}

export function invoicesFromDeliveries(orders: DeliveryOrder[], termsDays: number, now = Date.now()): Invoice[] {
  return orders
    .filter((order) => order.payment.kind === "invoice" && stageOf(order, now) === "delivered")
    .map((order, index) => {
      const billed = Date.parse(eventTime(order, "delivered") ?? order.createdAt);
      const due = billed + termsDays * DAY;
      return {
        id: invoiceIdFor(order.id),
        orderRef: orderRef(order.id),
        branch: order.branch,
        date: formatDay(billed),
        dueDate: formatDay(due),
        amount: formatMoney(orderTotal(order)),
        status: statusFor(due, now, index),
      };
    });
}

/** "$1,250.00" → 1250. */
export const parseMoney = (amount: string) => Number(amount.replace(/[^0-9.]/g, "")) || 0;

/** Unpaid (pending + overdue) total. */
export const outstandingTotal = (invoices: Invoice[]) => invoices.filter((invoice) => invoice.status !== "paid").reduce((sum, invoice) => sum + parseMoney(invoice.amount), 0);
