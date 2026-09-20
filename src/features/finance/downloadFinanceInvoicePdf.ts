import type { FinanceInvoiceDetail } from "./financeInvoiceDetail";

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Client-side only — no PDF library in this project. Same zero-dependency
// window.open + .print() technique as downloadInvoicePdf.ts (customers) /
// downloadAdjustmentPdf.ts.
export function downloadFinanceInvoicePdf(detail: FinanceInvoiceDetail): void {
  const { invoice } = detail;
  const totalDue = `$${invoice.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

  const lineItemRows = detail.lineItems
    .map(
      (item) =>
        `<tr><td>${escapeHtml(item.orderId)}</td><td>${escapeHtml(item.description)}</td><td>${escapeHtml(item.route)}</td><td>${escapeHtml(item.amount)}</td></tr>`,
    )
    .join("");

  const html = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Invoice ${escapeHtml(invoice.id)}</title>
    <style>
      body { font-family: Arial, sans-serif; color: #111827; padding: 40px; }
      h1 { font-size: 22px; margin-bottom: 4px; }
      .muted { color: #6B7280; font-size: 13px; }
      table { width: 100%; border-collapse: collapse; margin-top: 24px; }
      th, td { text-align: left; padding: 8px; border-bottom: 1px solid #E5E7EB; font-size: 13px; }
      .total { text-align: right; font-size: 16px; font-weight: 700; margin-top: 16px; }
    </style>
  </head>
  <body>
    <h1>Invoice ${escapeHtml(invoice.id)}</h1>
    <p class="muted">${escapeHtml(invoice.company)} · ${escapeHtml(invoice.periodLabel)} · Due ${escapeHtml(invoice.dueDate)}</p>
    <table>
      <thead><tr><th>Order ID</th><th>Details</th><th>Route</th><th>Amount</th></tr></thead>
      <tbody>${lineItemRows}</tbody>
    </table>
    <p class="total">Total Due: ${escapeHtml(totalDue)}</p>
  </body>
</html>`;

  const printWindow = window.open("", "_blank");
  if (!printWindow) return;
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}
