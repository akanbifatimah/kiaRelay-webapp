import type { Customer } from "./data";

// Client-side only — exports whatever rows are currently filtered in memory.
// Swap for a real "export" endpoint once the Customer Management API exists.
export function exportCustomersToCsv(customers: Customer[], filename = "customers.csv"): void {
  const headers = ["ID", "Name", "Account Type", "Status", "Verification", "Orders", "Last Activity"];
  const rows = customers.map((customer) => [
    customer.id,
    customer.name,
    customer.accountType,
    customer.status,
    customer.verification,
    customer.orders,
    customer.lastActivity,
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
