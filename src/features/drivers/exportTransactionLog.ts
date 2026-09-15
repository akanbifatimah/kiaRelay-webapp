import type { TransactionLogEntry } from "./driverPayouts";

// Real export, same blob/anchor-download pattern as exportDriversToCsv.
// Replaces the fleet-wide Payouts tab's "View Full History" stub — the
// table above it already paginates the entire log, so a genuinely distinct
// action here is exporting it, not opening a redundant duplicate view.
export function exportTransactionLogToCsv(entries: TransactionLogEntry[], filename = "transaction-log.csv"): void {
  const headers = ["Timestamp", "Title", "Subtitle", "Amount", "Status"];
  const rows = entries.map((entry) => [entry.timestamp, entry.title, entry.subtitle, entry.amount.toFixed(2), entry.status]);
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
