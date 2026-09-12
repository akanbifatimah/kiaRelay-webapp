import type { OrderStatus } from "../../components/StatusBadge";
import type { Customer } from "./data";
import type { PaymentMethod, RecentOrder } from "./customerDetails";

function daysAgoDate(n: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - n);
  return date;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

const genericOrderStatuses: OrderStatus[] = ["delivered", "in-transit", "delivered"];

// Generic fallback recentOrders — dated relative to today (not a fixed
// year), same fix shape as customerOrderHistory.ts's own generated rows.
// Was an empty array — Recent Orders / Recent Billing Activity cards
// rendered blank (or disappeared entirely, since RecentBillingActivityCard
// returns null on empty activity) for every customer except the two
// hand-authored ones.
export function buildGenericRecentOrders(customer: Customer): RecentOrder[] {
  return genericOrderStatuses.map((status, i) => ({
    id: `#${customer.id}-${i + 1}`,
    date: formatDate(daysAgoDate(i * 6 + 2)),
    status,
    amount: `$${(60 + ((i * 43) % 260)).toFixed(2)}`,
  }));
}

// Generic fallback paymentMethods — was an empty array — Payment Methods
// cards (profile, invoicing page) rendered blank for every customer except
// the two hand-authored ones. Same fix shape as
// getCompanyInvoicingOverview()'s filler invoices.
export function buildGenericPaymentMethods(customer: Customer): PaymentMethod[] {
  return [
    {
      id: `pm-${customer.id}-card`,
      type: "card",
      label: "Visa Ending in 5588",
      detail: "Expires 09/28",
      status: "verified",
      isDefault: true,
      cardholderName: customer.name,
      expiry: "09/28",
    },
    {
      id: `pm-${customer.id}-bank`,
      type: "bank",
      label: "First National ACH",
      detail: "Verified",
      status: "verified",
      bankName: "First National Bank",
      accountType: "Checking",
    },
  ];
}
