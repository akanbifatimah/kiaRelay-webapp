import type { Invoice } from "../../customers/companyInvoices";
import type { DeliveryOrder } from "../deliveries/deliveryTypes";

/** "/business/deliveries/2800" for order "#ORD-2800". */
export const orderPath = (order: Pick<DeliveryOrder, "id">) => `/business/deliveries/${order.id.replace(/\D/g, "")}`;

export const INVOICE_TONE: Record<Invoice["status"], string> = { paid: "bg-success/10 text-success", pending: "bg-warning/10 text-warning", overdue: "bg-danger/10 text-danger" };
