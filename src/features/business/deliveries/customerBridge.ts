import type { RecentOrder } from "../../customers/customerDetails";
import type { CustomerOrderRecord } from "../../customers/customerOrderHistory";
import { toAdminOrder } from "./adminBridge";
import { getDeliveries } from "./deliveriesStore";
import { cityState, formatDay } from "./display";
import type { DeliveryOrder } from "./deliveryTypes";

// Customer Management views of portal/app deliveries (2026-09-30): the
// profile's Recent Orders and the Order History page list the company's real
// deliveries instead of generated rows. TODO: GET /customers/:id/orders.

const forCustomer = (customerId: string): DeliveryOrder[] => getDeliveries().filter((order) => order.customerId === customerId);

export function deliveryRecentOrders(customerId: string): RecentOrder[] | undefined {
  const orders = forCustomer(customerId);
  if (!orders.length) return undefined;
  return orders.slice(0, 5).map((order) => {
    const row = toAdminOrder(order);
    return { id: order.id, date: formatDay(order.createdAt), status: row.status, amount: row.price, route: `${cityState(order.pickup.address)} to ${cityState(order.dropoff.address)}` };
  });
}

export function deliveryOrderHistory(customerId: string): CustomerOrderRecord[] | undefined {
  const orders = forCustomer(customerId);
  if (!orders.length) return undefined;
  return orders.map((order) => {
    const row = toAdminOrder(order);
    return { id: order.id, date: formatDay(order.createdAt), deliveryType: row.type, status: row.status, paymentMethod: order.payment.label, amount: row.price };
  });
}
