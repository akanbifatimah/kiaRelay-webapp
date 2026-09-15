export type PayoutStatus = "ready" | "pending" | "on-hold";
export type TransactionStatus = "completed" | "processing" | "settled";

export interface PayoutQueueRow {
  id: string;
  driverName: string;
  walletBalance: number;
  cycle: string;
  lastPayoutLabel: string;
  nextPayoutLabel: string;
  status: PayoutStatus;
}

export interface TransactionLogEntry {
  id: string;
  title: string;
  subtitle: string;
  amount: number;
  status: TransactionStatus;
  timestamp: string;
}

// TODO: replace with GET /drivers/payouts once the Financial Management API
// exists. Marcus Thorne (DR-08190) and Elena Rodriguez (DR-08404) are the
// same drivers as driverRoster.ts's hand-authored rows — Jameson Wu has no
// roster counterpart, same "independent id space" precedent as Orders vs
// Invoices (see CLAUDE.md).
const handAuthoredQueue: PayoutQueueRow[] = [
  {
    id: "DR-08190",
    driverName: "Marcus Thorne",
    walletBalance: 2450.0,
    cycle: "Weekly",
    lastPayoutLabel: "Last: Oct 10",
    nextPayoutLabel: "Next: Oct 17",
    status: "ready",
  },
  {
    id: "DR-08404",
    driverName: "Elena Rodriguez",
    walletBalance: 892.4,
    cycle: "End of Day",
    lastPayoutLabel: "Last: Oct 14",
    nextPayoutLabel: "Next: Immediate",
    status: "pending",
  },
  {
    id: "DR-07733",
    driverName: "Jameson Wu",
    walletBalance: 4120.15,
    cycle: "End of Day",
    lastPayoutLabel: "Last: Oct 15",
    nextPayoutLabel: "Next: Blocked",
    status: "on-hold",
  },
];

const fillerNames = ["Priya Shah", "Kevin Walsh", "Tom Harrington", "Sofia Reyes", "Daniel Kim"];
const fillerStatuses: PayoutStatus[] = ["ready", "pending", "ready", "on-hold", "ready"];
const fillerCycles = ["Weekly", "End of Day", "Bi-Weekly"];

function buildFillerQueue(count: number): PayoutQueueRow[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `DR-0${8600 + i}`,
    driverName: `${fillerNames[i % fillerNames.length]} ${Math.floor(i / fillerNames.length) + 1}`,
    walletBalance: 300 + i * 87.4,
    cycle: fillerCycles[i % fillerCycles.length],
    lastPayoutLabel: `Last: Oct ${1 + (i % 20)}`,
    nextPayoutLabel: `Next: Oct ${2 + (i % 20)}`,
    status: fillerStatuses[i % fillerStatuses.length],
  }));
}

export const payoutQueue: PayoutQueueRow[] = [...handAuthoredQueue, ...buildFillerQueue(17)];

const handAuthoredLog: TransactionLogEntry[] = [
  {
    id: "TX-00112",
    title: "Bulk Batch Release #00112",
    subtitle: "All Drivers - Internal Transfer",
    amount: -112400.0,
    status: "completed",
    timestamp: "2:15 PM",
  },
  {
    id: "TX-08842",
    title: "Individual Withdrawal #DRV-8842",
    subtitle: "Elena Rodriguez - Manual Approval",
    amount: -892.4,
    status: "processing",
    timestamp: "1:52 PM",
  },
  {
    id: "TX-00113",
    title: "Merchant Fee Adjustment",
    subtitle: "Service Debit - System Generated",
    amount: -45.0,
    status: "settled",
    timestamp: "11:30 AM",
  },
];

const fillerLogTypes = [
  { title: "Individual Withdrawal", subtitle: "Manual Approval" },
  { title: "Auto-Batch Release", subtitle: "Scheduled Transfer" },
  { title: "Merchant Fee Adjustment", subtitle: "System Generated" },
];
const fillerLogStatuses: TransactionStatus[] = ["completed", "processing", "settled"];

function buildFillerLog(count: number): TransactionLogEntry[] {
  return Array.from({ length: count }, (_, i) => {
    const kind = fillerLogTypes[i % fillerLogTypes.length];
    return {
      id: `TX-0${114 + i}`,
      title: `${kind.title} #${9000 + i}`,
      subtitle: kind.subtitle,
      amount: -(50 + i * 23.5),
      status: fillerLogStatuses[i % fillerLogStatuses.length],
      timestamp: `${9 + (i % 8)}:${(i * 7) % 60 < 10 ? "0" : ""}${(i * 7) % 60} AM`,
    };
  });
}

export const transactionLog: TransactionLogEntry[] = [...handAuthoredLog, ...buildFillerLog(22)];

// Flavor numbers — not derived from the arrays above, same convention as
// driverOverviewStats/customerOverviewStats.
export const payoutSummary = {
  totalPendingVolume: 45280.0,
  totalPendingDeltaPct: 12,
  processedToday: 12450.25,
  processedTransactionCount: 3,
  scheduledPayments: 18900.0,
  scheduledWindowHours: 24,
  nextAutoBatchLabel: "Tonight, 11:00 PM",
};
