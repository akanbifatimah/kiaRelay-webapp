import type { InvoiceDetail } from "./invoiceDetail";

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Client-side only — no PDF library in this project (see CLAUDE.md Tech
// Stack: dependencies need to be called out first, not added silently).
// Opens a print-ready HTML document in a new tab and triggers the
// browser's native print dialog, which every major browser can save
// directly as a PDF — same zero-dependency approach as
// filterInvoices.ts's exportInvoicesToCsv, just a document instead of a
// CSV. TODO: replace with a real GET /invoices/:id/pdf once the backend
// can render one server-side.
export function downloadInvoicePdf(detail: InvoiceDetail): void {
  const rows = detail.lineItems
    .map(
      (item) => `
        <tr>
          <td>${escapeHtml(item.orderId)}</td>
          <td>${escapeHtml(item.description)}</td>
          <td>${escapeHtml(item.route)}</td>
          <td>${escapeHtml(item.date)}</td>
          <td style="text-align:right">${escapeHtml(item.amount)}</td>
        </tr>`,
    )
    .join("");

  const html = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Invoice ${escapeHtml(detail.id)}</title>
    <style>
      body { font-family: Arial, sans-serif; color: #111827; padding: 40px; }
      h1 { font-size: 22px; margin-bottom: 4px; }
      .muted { color: #6B7280; font-size: 13px; }
      table { width: 100%; border-collapse: collapse; margin-top: 24px; }
      th, td { text-align: left; padding: 8px; border-bottom: 1px solid #E5E7EB; font-size: 13px; }
      .totals { margin-top: 16px; width: 260px; margin-left: auto; font-size: 13px; }
      .totals div { display: flex; justify-content: space-between; padding: 4px 0; }
      .totals .total { font-weight: 700; border-top: 1px solid #E5E7EB; margin-top: 6px; padding-top: 6px; }
      .grid { display: flex; justify-content: space-between; margin-top: 24px; }
      .grid div { font-size: 13px; }
      .grid p { margin: 2px 0; }
    </style>
  </head>
  <body>
    <h1>Invoice ${escapeHtml(detail.id)}</h1>
    <p class="muted">${escapeHtml(detail.customerName)}</p>

    <div class="grid">
      <div>
        <p><strong>Billing Address</strong></p>
        <p>${escapeHtml(detail.billingAddress)}</p>
        <p><strong>Tax ID</strong></p>
        <p>${escapeHtml(detail.taxId)}</p>
      </div>
      <div>
        <p><strong>Invoice Date</strong></p>
        <p>${escapeHtml(detail.invoiceDate)}</p>
        <p><strong>Due Date</strong></p>
        <p>${escapeHtml(detail.dueDate)}</p>
        <p><strong>Terms</strong></p>
        <p>${escapeHtml(detail.termsLabel)}</p>
      </div>
    </div>

    <table>
      <thead>
        <tr><th>Order</th><th>Description</th><th>Route</th><th>Date</th><th style="text-align:right">Amount</th></tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>

    <div class="totals">
      <div><span>Subtotal</span><span>${escapeHtml(detail.subtotal)}</span></div>
      <div><span>${escapeHtml(detail.platformFeeLabel)}</span><span>${escapeHtml(detail.platformFee)}</span></div>
      <div><span>Fuel Surcharge</span><span>${escapeHtml(detail.fuelSurcharge)}</span></div>
      <div class="total"><span>Total Due</span><span>${escapeHtml(detail.totalDue)}</span></div>
    </div>
  </body>
</html>`;

  const printWindow = window.open("", "_blank");
  if (!printWindow) return;
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}
