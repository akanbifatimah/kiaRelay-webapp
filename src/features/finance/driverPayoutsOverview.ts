import type { FinanceStat } from "./data";

export type PayoutRegisterStatus = "pending" | "paid" | "processed" | "failed";
export type PayoutSchedule = "Weekly" | "Bi-Weekly" | "End of Day";

export interface PayoutRegisterRow {
  id: string;
  driverId: string;
  driverName: string;
  completedDeliveries: number;
  gross: number;
  deductions: number;
  net: number;
  schedule: PayoutSchedule;
  nextPayoutDate: string;
  status: PayoutRegisterStatus;
}

export interface OnDemandRequest {
  id: string;
  driverName: string;
  note: string;
  amount: number;
  urgent: boolean;
}

function daysFromNowDate(n: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + n);
  return date;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// TODO: replace with GET /finance/payouts once the Financial Management API
// exists. This is the Finance-side payout register, independent from Driver
// Management's own Payouts tab (features/drivers/driverPayouts.ts) — same
// documented independent-id-space precedent as Orders vs Invoices.
const handAuthored: PayoutRegisterRow[] = [
  { id: "PYT-88104", driverId: "DR-08190", driverName: "Marcus Thorne", completedDeliveries: 42, gross: 3120.0, deductions: 187.2, net: 2932.8, schedule: "Weekly", nextPayoutDate: formatDate(daysFromNowDate(2)), status: "pending" },
  { id: "PYT-88097", driverId: "DR-08404", driverName: "Elena Rodriguez", completedDeliveries: 18, gross: 1240.5, deductions: 74.4, net: 1166.1, schedule: "End of Day", nextPayoutDate: formatDate(daysFromNowDate(0)), status: "processed" },
  { id: "PYT-88052", driverId: "DR-07733", driverName: "Jameson Wu", completedDeliveries: 51, gross: 4380.75, deductions: 262.8, net: 4117.95, schedule: "Bi-Weekly", nextPayoutDate: formatDate(daysFromNowDate(-1)), status: "paid" },
  { id: "PYT-87911", driverId: "DR-08561", driverName: "Priya Shah", completedDeliveries: 9, gross: 612.0, deductions: 36.7, net: 575.3, schedule: "Weekly", nextPayoutDate: formatDate(daysFromNowDate(2)), status: "failed" },
];

const fillerNames = ["Kevin Walsh", "Tom Harrington", "Sofia Reyes", "Daniel Kim", "Carla Nguyen"];
const fillerSchedules: PayoutSchedule[] = ["Weekly", "Bi-Weekly", "End of Day"];
const fillerStatuses: PayoutRegisterStatus[] = ["pending", "processed", "paid", "pending", "failed"];

function buildFillerRegister(count: number): PayoutRegisterRow[] {
  return Array.from({ length: count }, (_, i) => {
    const gross = 400 + ((i * 173) % 4000);
    const deductions = Math.round(gross * 0.06 * 100) / 100;
    return {
      id: `PYT-8${7800 - i}`,
      driverId: `DR-0${8700 + i}`,
      driverName: `${fillerNames[i % fillerNames.length]} ${Math.floor(i / fillerNames.length) + 1}`,
      completedDeliveries: 4 + (i % 45),
      gross,
      deductions,
      net: Math.round((gross - deductions) * 100) / 100,
      schedule: fillerSchedules[i % fillerSchedules.length],
      nextPayoutDate: formatDate(daysFromNowDate((i % 7) - 2)),
      status: fillerStatuses[i % fillerStatuses.length],
    };
  });
}

export const payoutRegister: PayoutRegisterRow[] = [...handAuthored, ...buildFillerRegister(31)];

export const onDemandRequests: OnDemandRequest[] = [
  { id: "OD-4471", driverName: "Marcus Thorne", note: "12 completed deliveries, wallet balance $840.00", amount: 840.0, urgent: true },
  { id: "OD-4468", driverName: "Sofia Reyes", note: "5 completed deliveries, wallet balance $312.50", amount: 312.5, urgent: false },
  { id: "OD-4460", driverName: "Daniel Kim", note: "9 completed deliveries, wallet balance $601.20", amount: 601.2, urgent: true },
];

export const driverPayoutStats: FinanceStat[] = [
  { type: "payouts", label: "Total Payouts (This Period)", value: 128450.0, deltaPct: 8.2 },
  { type: "pending", label: "Pending Approval", value: 14280.5, secondaryLabel: "6 drivers waiting" },
  { type: "net", label: "Processed Today", value: 9640.3, secondaryLabel: "11 transactions" },
  { type: "fees", label: "Average Payout", value: 612.4, secondaryLabel: "per driver, this cycle" },
];

export const onDemandStat = {
  label: "On-Demand Withdrawals",
  value: onDemandRequests.reduce((sum, r) => sum + r.amount, 0),
  urgentCount: onDemandRequests.filter((r) => r.urgent).length,
};

export interface PayoutRegisterFilters {
  search: string;
  status: PayoutRegisterStatus | "all";
  schedule: PayoutSchedule | "all";
}

export function filterPayoutRegister(rows: PayoutRegisterRow[], filters: PayoutRegisterFilters): PayoutRegisterRow[] {
  const term = filters.search.trim().toLowerCase();
  return rows.filter((row) => {
    if (filters.status !== "all" && row.status !== filters.status) return false;
    if (filters.schedule !== "all" && row.schedule !== filters.schedule) return false;
    if (term && !row.id.toLowerCase().includes(term) && !row.driverName.toLowerCase().includes(term)) return false;
    return true;
  });
}

export function exportPayoutRegisterToCsv(rows: PayoutRegisterRow[], filename = "driver-payouts.csv"): void {
  const headers = ["Payout#", "Driver", "Deliveries", "Gross", "Deductions", "Net", "Schedule", "Next Payout", "Status"];
  const csvRows = rows.map((r) => [r.id, r.driverName, r.completedDeliveries, r.gross.toFixed(2), r.deductions.toFixed(2), r.net.toFixed(2), r.schedule, r.nextPayoutDate, r.status]);
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
