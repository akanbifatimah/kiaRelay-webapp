import type { DriverTransaction } from "./driverPayoutHistory";

// Real export, same blob/anchor-download pattern as exportDriversToCsv.
// "Export Ledger"/"Export Log" both replaced a "View Full ___" stub that
// would have just duplicated the already-paginated table above it — this
// gives the button a genuinely distinct, real purpose instead.
export function exportDriverTransactionsToCsv(transactions: DriverTransaction[], filename = "transactions.csv"): void {
  const headers = ["Date", "Transaction ID", "Type", "Gross", "Net Payout", "Status"];
  const rows = transactions.map((tx) => [tx.date, tx.txId, tx.type, tx.gross.toFixed(2), tx.net.toFixed(2), tx.status]);
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
