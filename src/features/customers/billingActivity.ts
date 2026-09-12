import type { CustomerDetail, PaymentMethod } from "./customerDetails";

export interface BillingActivityRecord {
  id: string;
  description: string;
  chargedTo: string;
  date: string;
  amount: string;
  status: "paid" | "pending" | "failed";
}

const serviceLabels = ["Express Courier", "Bulk Haul", "Freight Shipment", "Standard Delivery", "Overnight Parcel"];

function chargeLabel(method: PaymentMethod): string {
  return method.label.replace(/Ending in/i, "ending");
}

// TODO: replace with GET /customers/:id/billing-activity once the
// Customer Management / billing API exists. Derives entries from the
// customer's own recentOrders so it stays consistent with the rest of the
// profile rather than generating unrelated numbers; billing status mirrors
// the order's own status (delivered → paid, in-transit → pending,
// cancelled → failed) instead of a separate invented field.
export function buildBillingActivity(detail: CustomerDetail): BillingActivityRecord[] {
  const methods: PaymentMethod[] = detail.paymentMethods;

  return detail.recentOrders.map((order, i) => ({
    id: `bill-${order.id}`,
    description: `${serviceLabels[i % serviceLabels.length]} #${order.id.replace(/[^0-9]/g, "")}`,
    chargedTo: methods.length > 0 ? chargeLabel(methods[i % methods.length]) : "—",
    date: order.date,
    amount: order.amount,
    status: order.status === "delivered" ? "paid" : order.status === "cancelled" ? "failed" : "pending",
  }));
}
