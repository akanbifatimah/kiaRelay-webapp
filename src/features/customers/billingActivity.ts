import type { CustomerDetail, PaymentMethod } from "./customerDetails";

export interface BillingActivityRecord {
  id: string;
  description: string;
  method: string;
  date: string;
  amount: string;
}

// TODO: replace with GET /customers/:id/billing-activity once the
// Customer Management / billing API exists. Derives entries from the
// customer's own recentOrders so it stays consistent with the rest of the
// profile rather than generating unrelated numbers.
export function buildBillingActivity(detail: CustomerDetail): BillingActivityRecord[] {
  const methods: PaymentMethod[] = detail.paymentMethods;

  return detail.recentOrders.map((order, i) => ({
    id: `bill-${order.id}`,
    description: `Order ${order.id}`,
    method: methods.length > 0 ? methods[i % methods.length].label : "—",
    date: order.date,
    amount: order.amount,
  }));
}
