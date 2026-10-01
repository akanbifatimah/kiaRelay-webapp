import type { OrderStatus } from "../../../components/StatusBadge";
import type { DeliveryType } from "../../../components/TagChip";
import type { Order } from "../../orders/data";
import type { OrderDetail } from "../../orders/orderDetails";
import { findCustomer } from "../../customers/data";
import { trackingSteps, stageOf } from "./deliverySim";
import { cityLine, formatWhen, loadSize } from "./display";
import { orderTotal } from "./invoices";
import { formatMoney } from "./pricing";
import type { DeliveryOrder } from "./deliveryTypes";
import type { DeliveryStage } from "./trackingTypes";

// Customer deliveries as admin sees them (2026-09-30): one record, two
// views. Order Monitoring's rows and order panel are derived from the same
// DeliveryOrder the customer booked, so nothing drifts apart.
// TODO: goes away once admin and customers read the same Orders API.

const STATUS: Record<DeliveryStage, OrderStatus> = {
  searching: "pending",
  choosing: "pending",
  requested: "pending",
  unavailable: "pending",
  accepted: "in-transit",
  "at-pickup": "in-transit",
  "in-transit": "in-transit",
  delivered: "delivered",
  cancelled: "cancelled",
};

function deliveryType(order: DeliveryOrder): DeliveryType {
  if (order.load.category === "Medical Supplies") return "healthcare";
  if (order.speed === "express") return "express";
  if (order.load.weightLbs * order.load.quantity >= 1000) return "freight";
  return "standard";
}

export const customerName = (customerId: string) => findCustomer(customerId)?.name ?? customerId;

export function toAdminOrder(order: DeliveryOrder, now = Date.now()): Order {
  const driver = order.driver;
  return {
    id: order.id,
    customerId: order.customerId,
    customer: customerName(order.customerId),
    plan: "Enterprise Plan",
    industry: order.load.category,
    type: deliveryType(order),
    pickup: order.pickup.address.name || order.pickup.address.city,
    dropoff: order.dropoff.address.name || order.dropoff.address.city,
    driver: driver ? `${driver.firstName} ${driver.lastName[0]}.` : "Unassigned",
    driverId: driver?.id,
    driverVehicle: driver ? `${driver.vehicle} · ${driver.plate}` : undefined,
    price: formatMoney(orderTotal(order)),
    status: STATUS[stageOf(order, now)],
    date: order.createdAt.slice(0, 10),
  };
}

/** The order panel's detail, minus the map route (orderDetails adds it). */
export function toOrderDetail(order: DeliveryOrder, now = Date.now()): Omit<OrderDetail, "route"> {
  const total = formatMoney(orderTotal(order));
  const { pickup, dropoff, load, driver } = order;
  return {
    id: order.id,
    status: STATUS[stageOf(order, now)],
    customer: customerName(order.customerId),
    accountNumber: order.customerId,
    verified: true,
    phone: pickup.contactPhone || "—",
    dimensions: `${load.quantity} × ${loadSize(load)}`,
    weightLbs: load.weightLbs * load.quantity,
    tags: order.handling,
    pickupAddress: [pickup.address.name ? `${pickup.address.name}, ${pickup.address.street}` : pickup.address.street, cityLine(pickup.address)],
    dropoffAddress: [dropoff.address.name ? `${dropoff.address.name}, ${dropoff.address.street}` : dropoff.address.street, cityLine(dropoff.address)],
    driverName: driver ? `${driver.firstName} ${driver.lastName}` : "Unassigned",
    driverVehicle: driver ? `${driver.vehicle} · ${driver.plate}` : "—",
    driverRating: driver?.rating ?? 0,
    timeline: trackingSteps(order, now).map((step, i) => ({
      label: i === 0 ? "Order Placed" : step.label,
      timestamp: step.at ? `${formatWhen(step.at)}${i === 0 ? ` · By ${order.placedByFirstName} ${order.placedByLastName} (Customer Portal)` : ""}` : undefined,
      status: step.state,
      badge: i === 3 && order.pod ? "Photo" : undefined,
    })),
    payment: order.quote.lines.map((line) => ({ label: line.label, amount: formatMoney(line.amount) })),
    totalPaid: total,
    invoiceNote: order.payment.kind === "invoice" ? `Billed to the company account · ${order.payment.label}` : `Charged to ${order.payment.label}`,
  };
}
