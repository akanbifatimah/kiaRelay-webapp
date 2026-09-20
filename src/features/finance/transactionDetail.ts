import type { TimelineStep } from "../../components/Timeline";
import { drivers } from "../drivers/driverRoster";
import { customers } from "../customers/data";
import type { FinanceTransaction } from "./financeTransactions";

export interface BreakdownLine {
  label: string;
  sublabel: string;
  amount: number;
}

export interface FinanceTransactionDetail {
  transaction: FinanceTransaction;
  createdLabel: string;
  processedLabel: string;
  paymentMethod: string;
  driverId?: string;
  driverName?: string;
  customerId?: string;
  customerAccountType?: "individual" | "company";
  customerName?: string;
  orderRef: string;
  breakdown: BreakdownLine[];
  netRevenue: number;
  activityLog: TimelineStep[];
}

function pick<T>(list: T[], seed: string): T {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  return list[Math.abs(hash) % list.length];
}

const paymentMethods = ["Bank Transfer", "Visa •••• 4242", "Kia Wallet", "ACH"];

// TODO: replace with GET /finance/transactions/:id once the Financial
// Management API exists. Breakdown/driver/customer are computed
// deterministically from the transaction rather than stored per-row in
// financeTransactions.ts — keeps that file lean and works for every filler
// row too, not just the 5 hand-authored ones.
export function getTransactionDetail(transaction: FinanceTransaction): FinanceTransactionDetail {
  const amount = Math.abs(transaction.amount);
  const driver = pick(drivers, transaction.id);
  const customer = pick(customers, transaction.id + "c");
  const orderRef = `#ORD-${8000 + (Math.abs(transaction.id.charCodeAt(1) * 37) % 2000)}`;

  let breakdown: BreakdownLine[];
  let netRevenue: number;

  if (transaction.type === "delivery-payment") {
    const driverEarnings = Math.round(amount * 0.7 * 100) / 100;
    const processingFees = Math.round(amount * 0.032 * 100) / 100;
    netRevenue = Math.round((amount - driverEarnings - processingFees) * 100) / 100;
    breakdown = [
      { label: "Order Revenue", sublabel: "Original billing total - customer", amount },
      { label: "Driver Earnings", sublabel: `70% payout to ${driver.name}`, amount: -driverEarnings },
      { label: "Third-party Processing Fees", sublabel: "Stripe/Payment Gateway", amount: -processingFees },
    ];
  } else if (transaction.type === "driver-payout") {
    const processingFees = Math.round(amount * 0.01 * 100) / 100;
    netRevenue = -amount - processingFees;
    breakdown = [
      { label: "Payout Amount", sublabel: `Weekly earnings disbursed to ${driver.name}`, amount: -amount },
      { label: "Transfer Fees", sublabel: "Bank/ACH processing", amount: -processingFees },
    ];
  } else if (transaction.type === "company-invoice") {
    const processingFees = Math.round(amount * 0.01 * 100) / 100;
    netRevenue = Math.round((amount - processingFees) * 100) / 100;
    breakdown = [
      { label: "Invoice Amount", sublabel: `Billed to ${transaction.party}`, amount },
      { label: "Processing Fees", sublabel: "Invoicing platform fee", amount: -processingFees },
    ];
  } else {
    netRevenue = -amount;
    breakdown = [{ label: "Refund Amount", sublabel: `Returned to ${transaction.party}`, amount: -amount }];
  }

  return {
    transaction,
    createdLabel: `${transaction.date}, 2026 · ${transaction.time}`,
    processedLabel: `${transaction.date}, 2026 · ${transaction.time}`,
    paymentMethod: pick(paymentMethods, transaction.id + "pm"),
    driverId: transaction.type === "delivery-payment" || transaction.type === "driver-payout" ? driver.id : undefined,
    driverName: transaction.type === "delivery-payment" || transaction.type === "driver-payout" ? driver.name : undefined,
    customerId: transaction.type === "delivery-payment" ? customer.id : undefined,
    customerAccountType: transaction.type === "delivery-payment" ? customer.accountType : undefined,
    customerName: transaction.type === "delivery-payment" ? transaction.party : undefined,
    orderRef,
    breakdown,
    netRevenue,
    activityLog: [
      { label: "Settlement Completed", timestamp: "Today, 11:30 AM", status: "done" },
      { label: "Invoice Generated", timestamp: "Today, 09:40 AM", status: "done" },
      { label: "Order Dispatched", timestamp: `${transaction.date}, 09:10 PM`, status: "done" },
    ],
  };
}
