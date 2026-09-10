import type { DeliveryType } from "../../components/TagChip";
import type { OrderStatus } from "../../components/StatusBadge";
import type { CustomerOrderRecord } from "./customerOrderHistory";

export type DateRangePreset = "all" | "30d" | "90d" | "year";

export interface CustomerOrderFilters {
  deliveryType: DeliveryType | "all";
  status: OrderStatus | "all";
  dateRange: DateRangePreset;
  minAmount: string;
  maxAmount: string;
}

const DATE_RANGE_DAYS: Record<Exclude<DateRangePreset, "all">, number> = {
  "30d": 30,
  "90d": 90,
  year: 365,
};

function parseAmount(amount: string): number {
  return Number(amount.replace(/[^0-9.]/g, "")) || 0;
}

export function filterCustomerOrders(
  orders: CustomerOrderRecord[],
  filters: CustomerOrderFilters,
): CustomerOrderRecord[] {
  const min = filters.minAmount ? Number(filters.minAmount) : null;
  const max = filters.maxAmount ? Number(filters.maxAmount) : null;
  const cutoff =
    filters.dateRange === "all"
      ? null
      : new Date(Date.now() - DATE_RANGE_DAYS[filters.dateRange] * 24 * 60 * 60 * 1000);

  return orders.filter((order) => {
    if (filters.deliveryType !== "all" && order.deliveryType !== filters.deliveryType) return false;
    if (filters.status !== "all" && order.status !== filters.status) return false;

    const amount = parseAmount(order.amount);
    if (min !== null && amount < min) return false;
    if (max !== null && amount > max) return false;

    if (cutoff && new Date(order.date) < cutoff) return false;

    return true;
  });
}

// Client-side only — exports whatever rows are currently filtered in memory.
// Swap for a real "export" endpoint once the Customer Management API exists.
export function exportCustomerOrdersToCsv(orders: CustomerOrderRecord[], filename = "customer-orders.csv"): void {
  const headers = ["Order ID", "Date", "Delivery Type", "Status", "Payment Method", "Amount"];
  const rows = orders.map((order) => [
    order.id,
    order.date,
    order.deliveryType,
    order.status,
    order.paymentMethod,
    order.amount,
  ]);
  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
