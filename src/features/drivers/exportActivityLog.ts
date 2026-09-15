import type { ActivityLogEntry } from "./driverActivityFullLog";

// Real export, same blob/anchor-download pattern as exportDriversToCsv/exportCustomersToCsv.
export function exportActivityLogToCsv(entries: ActivityLogEntry[], filename = "activity-log.csv"): void {
  const headers = ["Timestamp", "Type", "Title", "Description", "Status"];
  const rows = entries.map((entry) => [entry.timestamp, entry.type, entry.title, entry.description, entry.statusLabel ?? ""]);
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
