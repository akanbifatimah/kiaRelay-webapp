import { drivers, type DriverRecord } from "./driverRoster";

function daysAgoDate(n: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - n);
  return date;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export type TransactionStatus = "completed" | "processing";
export type TransactionType = "Payout" | "Bonus" | "Adjustment";

export interface DriverPayoutSummary {
  walletBalance: number;
  walletDeltaPct: number;
  pendingEarnings: number;
  pendingNote: string;
  lifetimeEarned: number;
  cycleLabel: string;
}

export interface DriverTransaction {
  id: string;
  date: string;
  txId: string;
  type: TransactionType;
  gross: number;
  net: number;
  status: TransactionStatus;
}

export interface DriverPayoutSettings {
  method: string;
  cycle: string;
  nextPayoutDate: string;
}

// TODO: replace with GET /drivers/:id/payouts once the Financial Management
// API exists. Only Marcus Thorne (DR-08190) has this exact hand-authored
// detail — every other roster driver gets the generic-but-populated
// fallback below, not empty/zeroed placeholders.
const handAuthoredSummary: Record<string, DriverPayoutSummary> = {
  "DR-08190": {
    walletBalance: 1240.5,
    walletDeltaPct: 5,
    pendingEarnings: 450.25,
    pendingNote: "In Review",
    lifetimeEarned: 42800.0,
    cycleLabel: "Bi-Weekly",
  },
};

const handAuthoredSettings: Record<string, DriverPayoutSettings> = {
  "DR-08190": {
    method: "Bank Account (ACH •••• 1234)",
    cycle: "Bi-Weekly",
    nextPayoutDate: "Oct 31, 2026",
  },
};

const handAuthoredTransactions: DriverTransaction[] = [
  { id: "tx-1", date: "Oct 15, 2026", txId: "#PY-99281", type: "Payout", gross: 3450.0, net: 3330.0, status: "completed" },
  { id: "tx-2", date: "Oct 12, 2026", txId: "#BN-44021", type: "Bonus", gross: 250.0, net: 250.0, status: "completed" },
  { id: "tx-3", date: "Oct 1, 2026", txId: "#PY-93184", type: "Payout", gross: 2110.55, net: 2065.5, status: "completed" },
  { id: "tx-4", date: "Sep 28, 2026", txId: "#AD-00122", type: "Adjustment", gross: -45.0, net: -45.0, status: "processing" },
];

function buildFillerTransactions(count: number): DriverTransaction[] {
  const types: TransactionType[] = ["Payout", "Bonus", "Adjustment"];
  return Array.from({ length: count }, (_, i) => {
    const type = types[i % types.length];
    const gross = type === "Payout" ? 1800 + i * 41.5 : type === "Bonus" ? 100 + i * 12 : -(20 + i * 3);
    return {
      id: `tx-filler-${i}`,
      date: `Sep ${Math.max(1, 27 - i)}, 2026`,
      txId: `#${type === "Payout" ? "PY" : type === "Bonus" ? "BN" : "AD"}-${90000 + i}`,
      type,
      gross,
      net: type === "Payout" ? gross - gross * 0.02 : gross,
      status: i % 6 === 0 ? "processing" : "completed",
    };
  });
}

// Generic fallback (any roster row besides Marcus Thorne) used to render
// zeroed-out/"Not configured" placeholders, which looked like the payouts
// tab was broken rather than just using mock data — same class of bug fixed
// for customers' generic fallback (see customerDetailsFallback.ts). Derives
// flavor numbers from the roster row instead, same convention as
// driverOverviewStats.
function buildGenericSummary(roster: DriverRecord): DriverPayoutSummary {
  return {
    walletBalance: Math.round(roster.earnings * 0.4 * 100) / 100,
    walletDeltaPct: roster.earningsDeltaPct,
    pendingEarnings: Math.round(roster.earnings * 0.15 * 100) / 100,
    pendingNote: "In Review",
    lifetimeEarned: Math.round(roster.earnings * 12 * 100) / 100,
    cycleLabel: "Bi-Weekly",
  };
}

function buildGenericSettings(roster: DriverRecord): DriverPayoutSettings {
  const last4 = roster.plate.replace(/\D/g, "").padStart(4, "0").slice(-4);
  return {
    method: `Bank Account (ACH ••••${last4})`,
    cycle: "Bi-Weekly",
    nextPayoutDate: formatDate(daysAgoDate(-14)),
  };
}

export function getPayoutSummary(driverId: string): DriverPayoutSummary {
  if (handAuthoredSummary[driverId]) return handAuthoredSummary[driverId];
  const roster = drivers.find((d) => d.id === driverId);
  return roster
    ? buildGenericSummary(roster)
    : { walletBalance: 0, walletDeltaPct: 0, pendingEarnings: 0, pendingNote: "No pending earnings", lifetimeEarned: 0, cycleLabel: "Not configured" };
}

export function getPayoutSettings(driverId: string): DriverPayoutSettings {
  if (handAuthoredSettings[driverId]) return handAuthoredSettings[driverId];
  const roster = drivers.find((d) => d.id === driverId);
  return roster ? buildGenericSettings(roster) : { method: "Not configured", cycle: "Not configured", nextPayoutDate: "—" };
}

export function getTransactions(driverId: string): DriverTransaction[] {
  if (handAuthoredSettings[driverId]) return [...handAuthoredTransactions, ...buildFillerTransactions(20)];
  const roster = drivers.find((d) => d.id === driverId);
  return roster ? buildFillerTransactions(14) : [];
}
