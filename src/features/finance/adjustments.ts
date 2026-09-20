import type { FinanceStat } from "./data";

export type AdjustmentType = "refund" | "credit";
export type AdjustmentStatus = "pending" | "processed" | "failed";

export interface Adjustment {
  id: string;
  type: AdjustmentType;
  customer: string;
  orderRef: string;
  reasonTag: string;
  original: number;
  adjustment: number;
  status: AdjustmentStatus;
  date: string;
}

function daysAgoDate(n: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - n);
  return date;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// TODO: replace with GET /finance/adjustments once the Financial Management
// API exists. Dates generated relative to today, same fix already applied
// to every other mock date generator in this app.
const handAuthored: Adjustment[] = [
  { id: "#ADJ-94821", type: "refund", customer: "Global Materials Co.", orderRef: "#ORD-8321", reasonTag: "Damaged", original: 17450.0, adjustment: -1250.0, status: "pending", date: formatDate(daysAgoDate(1)) },
  { id: "#ADJ-94819", type: "credit", customer: "Precision Steel Works", orderRef: "#ORD-4381", reasonTag: "Promo Credit", original: 8200.0, adjustment: 470.0, status: "processed", date: formatDate(daysAgoDate(2)) },
  { id: "#ADJ-94815", type: "refund", customer: "Eco Logistics Ltd", orderRef: "#ORD-4365", reasonTag: "Refund", original: 1500.0, adjustment: -350.0, status: "failed", date: formatDate(daysAgoDate(3)) },
  { id: "#ADJ-94812", type: "credit", customer: "North Health Org", orderRef: "#ORD-4360", reasonTag: "Account Credit", original: 4600.0, adjustment: 350.0, status: "processed", date: formatDate(daysAgoDate(4)) },
  { id: "#ADJ-94808", type: "refund", customer: "Skyline Ventures", orderRef: "#ORD-4372", reasonTag: "Cold Chain Failure", original: 32000.0, adjustment: -2100.0, status: "processed", date: formatDate(daysAgoDate(5)) },
];

const fillerCustomers = ["Apex Global Tech", "Vertex Freight Co.", "Bright Path Retail", "Cascade Supply Chain", "Harborline Traders"];
const fillerReasons = ["Damaged", "Late Delivery", "Promo Credit", "Account Credit", "Billing Correction"];
const fillerStatuses: AdjustmentStatus[] = ["processed", "processed", "pending", "processed", "failed"];

function buildFillerAdjustments(count: number): Adjustment[] {
  return Array.from({ length: count }, (_, i) => {
    const type: AdjustmentType = i % 3 === 0 ? "credit" : "refund";
    const original = 800 + ((i * 613) % 15000);
    const adjustmentAmount = Math.round(original * (0.05 + ((i * 7) % 20) / 100));
    return {
      id: `#ADJ-9${4700 - i}`,
      type,
      customer: fillerCustomers[i % fillerCustomers.length],
      orderRef: `#ORD-${4400 + i}`,
      reasonTag: fillerReasons[i % fillerReasons.length],
      original,
      adjustment: type === "credit" ? adjustmentAmount : -adjustmentAmount,
      status: fillerStatuses[i % fillerStatuses.length],
      date: formatDate(daysAgoDate(6 + i)),
    };
  });
}

export const adjustments: Adjustment[] = [...handAuthored, ...buildFillerAdjustments(37)];

export const adjustmentStats: FinanceStat[] = [
  { type: "refunds", label: "Total Refunds", value: 142820, deltaPct: 12.5 },
  { type: "credits", label: "Total Credits", value: 89420.5, secondaryLabel: "Last 30 Days" },
  { type: "pending", label: "Pending Adjustments", value: 42, isCurrency: false },
  { type: "adjustments", label: "Adjustments This Period", value: -24110, deltaPct: -4.2, invertDeltaColor: true },
];

export interface AdjustmentFilters {
  search: string;
  type: AdjustmentType | "all";
  status: AdjustmentStatus | "all";
}

export function filterAdjustments(rows: Adjustment[], filters: AdjustmentFilters): Adjustment[] {
  const term = filters.search.trim().toLowerCase();
  return rows.filter((row) => {
    if (filters.type !== "all" && row.type !== filters.type) return false;
    if (filters.status !== "all" && row.status !== filters.status) return false;
    if (term && !row.id.toLowerCase().includes(term) && !row.customer.toLowerCase().includes(term) && !row.orderRef.toLowerCase().includes(term)) {
      return false;
    }
    return true;
  });
}

export function exportAdjustmentsToCsv(rows: Adjustment[], filename = "adjustments.csv"): void {
  const headers = ["Adjustment ID", "Type", "Customer", "Order/Claim", "Original", "Adjustment", "Status", "Date"];
  const csvRows = rows.map((r) => [r.id, r.type, r.customer, r.orderRef, r.original.toFixed(2), r.adjustment.toFixed(2), r.status, r.date]);
  const csv = [headers, ...csvRows].map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");

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
