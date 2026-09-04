import type { Order } from "./data";
import type { OrderStatus } from "../../components/StatusBadge";

export type DateFilter = "all" | "today" | "7d" | "30d";

const DATE_FILTER_DAYS: Record<Exclude<DateFilter, "all">, number> = {
  today: 0,
  "7d": 6,
  "30d": 29,
};

export interface OrderFilters {
  search: string;
  status: OrderStatus | "all";
  industry: string;
  dateFilter: DateFilter;
}

export function filterOrders(orders: Order[], filters: OrderFilters): Order[] {
  const term = filters.search.trim().toLowerCase();
  const cutoffDays = filters.dateFilter === "all" ? null : DATE_FILTER_DAYS[filters.dateFilter];
  const today = new Date();

  return orders.filter((order) => {
    if (term && !order.id.toLowerCase().includes(term) && !order.customer.toLowerCase().includes(term)) {
      return false;
    }
    if (filters.status !== "all" && order.status !== filters.status) return false;
    if (filters.industry !== "all" && order.industry !== filters.industry) return false;
    if (cutoffDays !== null) {
      const diffDays = Math.floor((today.getTime() - new Date(order.date).getTime()) / 86_400_000);
      if (diffDays < 0 || diffDays > cutoffDays) return false;
    }
    return true;
  });
}

// Client-side only — exports whatever rows are currently filtered in memory.
// Swap for a real "export" endpoint once the Order Monitoring API exists.
export function exportOrdersToCsv(orders: Order[], filename = "orders.csv"): void {
  const headers = ["Order ID", "Customer", "Industry", "Type", "Pickup", "Dropoff", "Driver", "Price", "Status", "Date"];
  const rows = orders.map((order) => [
    order.id,
    order.customer,
    order.industry,
    order.type,
    order.pickup,
    order.dropoff,
    order.driver,
    order.price,
    order.status,
    order.date,
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
