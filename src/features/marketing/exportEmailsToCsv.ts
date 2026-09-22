import type { MarketingEmail } from "./emails";

// Client-side only, mirrors exportCustomersToCsv.ts — swap for a real export
// endpoint once the Marketing API exists.
export function exportEmailsToCsv(emails: MarketingEmail[], filename = "emails.csv"): void {
  const headers = ["Subject", "Context", "Recipient", "Status", "Sent At", "Opened %", "Clicked %"];
  const rows = emails.map((email) => [
    email.subject,
    email.context,
    email.recipient,
    email.status,
    email.sentAt ?? "",
    email.openedPct ?? "",
    email.clickedPct ?? "",
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
