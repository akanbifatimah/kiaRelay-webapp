export type FinanceTransactionType = "delivery-payment" | "company-invoice" | "driver-payout" | "refund";
export type FinanceTransactionStatus = "paid" | "pending" | "overdue";

export interface FinanceTransaction {
  id: string;
  type: FinanceTransactionType;
  party: string;
  amount: number;
  status: FinanceTransactionStatus;
  date: string;
  time: string;
}

function daysAgoDate(n: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - n);
  return date;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const signForType: Record<FinanceTransactionType, 1 | -1> = {
  "delivery-payment": 1,
  "company-invoice": 1,
  "driver-payout": -1,
  refund: -1,
};

// TODO: replace with GET /finance/transactions once the Financial
// Management API exists. Dates generated relative to today rather than a
// fixed year — same fix already applied to every other mock date generator
// in this app once a hardcoded year broke "recent activity" framing.
const handAuthored: FinanceTransaction[] = [
  { id: "#TXN-94021", type: "delivery-payment", party: "Jonathan Wick", amount: 158.6, status: "paid", date: formatDate(daysAgoDate(2)), time: "14:20" },
  { id: "#INV-C-2201", type: "company-invoice", party: "Cyberdyne Systems", amount: 4210.0, status: "pending", date: formatDate(daysAgoDate(2)), time: "11:45" },
  { id: "#PAY-D-8832", type: "driver-payout", party: "Marcus Holloway", amount: 842.1, status: "paid", date: formatDate(daysAgoDate(2)), time: "09:13" },
  { id: "#REF-44201", type: "refund", party: "Sarah Connor", amount: 45.0, status: "paid", date: formatDate(daysAgoDate(3)), time: "17:30" },
  { id: "#INV-C-2199", type: "company-invoice", party: "Weyland-Yutani", amount: 12850.0, status: "overdue", date: formatDate(daysAgoDate(6)), time: "10:00" },
];

const fillerParties = ["Ellen Ripley", "John Connor", "Rick Deckard", "Dana Scully", "Alex Murphy", "Sydney Bristow"];
const fillerTypes: FinanceTransactionType[] = ["delivery-payment", "company-invoice", "driver-payout", "refund"];
const fillerStatuses: FinanceTransactionStatus[] = ["paid", "paid", "pending", "paid", "overdue"];

function buildFillerTransactions(count: number): FinanceTransaction[] {
  return Array.from({ length: count }, (_, i) => {
    const type = fillerTypes[i % fillerTypes.length];
    const prefix = type === "delivery-payment" ? "TXN" : type === "company-invoice" ? "INV-C" : type === "driver-payout" ? "PAY-D" : "REF";
    return {
      id: `#${prefix}-${90000 + i}`,
      type,
      party: fillerParties[i % fillerParties.length],
      amount: Math.round((30 + ((i * 53) % 900)) * 100) / 100,
      status: fillerStatuses[i % fillerStatuses.length],
      date: formatDate(daysAgoDate(7 + i)),
      time: `${8 + (i % 10)}:${(i * 7) % 60 < 10 ? "0" : ""}${(i * 7) % 60}`,
    };
  });
}

export const financeTransactions: FinanceTransaction[] = [...handAuthored, ...buildFillerTransactions(35)];

export function signedAmount(transaction: FinanceTransaction): number {
  return transaction.amount * signForType[transaction.type];
}

export function filterFinanceTransactions(rows: FinanceTransaction[], search: string): FinanceTransaction[] {
  const term = search.trim().toLowerCase();
  if (!term) return rows;
  return rows.filter((row) => row.id.toLowerCase().includes(term) || row.party.toLowerCase().includes(term));
}

// Real export, same blob/anchor-download pattern as exportDriversToCsv.
export function exportFinanceTransactionsToCsv(rows: FinanceTransaction[], filename = "finance-transactions.csv"): void {
  const headers = ["Reference", "Type", "Party", "Amount", "Status", "Date", "Time"];
  const csvRows = rows.map((row) => [row.id, row.type, row.party, signedAmount(row).toFixed(2), row.status, row.date, row.time]);
  const csv = [headers, ...csvRows]
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
