import type { AdjustmentDetail } from "./adjustmentDetail";

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function formatAmount(value: number): string {
  const sign = value < 0 ? "-" : "";
  return `${sign}$${Math.abs(value).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
}

// Client-side only — no PDF library in this project. Same zero-dependency
// window.open + .print() technique as downloadInvoicePdf.ts/
// downloadOperationalReport.ts.
export function downloadAdjustmentPdf(detail: AdjustmentDetail): void {
  const { adjustment, managedBy, createdLabel, remainingCharge, reason } = detail;
  const html = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Adjustment ${escapeHtml(adjustment.id)}</title>
    <style>
      body { font-family: Arial, sans-serif; color: #111827; padding: 40px; }
      h1 { font-size: 22px; margin-bottom: 4px; }
      .muted { color: #6B7280; font-size: 13px; }
      table { width: 100%; border-collapse: collapse; margin-top: 24px; }
      th, td { text-align: left; padding: 8px; border-bottom: 1px solid #E5E7EB; font-size: 13px; }
    </style>
  </head>
  <body>
    <h1>Adjustment ${escapeHtml(adjustment.id)}</h1>
    <p class="muted">Managed by ${escapeHtml(managedBy)} · ${escapeHtml(createdLabel)}</p>
    <table>
      <tbody>
        <tr><th>Customer</th><td>${escapeHtml(adjustment.customer)}</td></tr>
        <tr><th>Type</th><td>${escapeHtml(adjustment.type)}</td></tr>
        <tr><th>Status</th><td>${escapeHtml(adjustment.status)}</td></tr>
        <tr><th>Original Amount</th><td>${formatAmount(adjustment.original)}</td></tr>
        <tr><th>Adjustment Amount</th><td>${formatAmount(adjustment.adjustment)}</td></tr>
        <tr><th>Remaining Charge</th><td>${formatAmount(remainingCharge)}</td></tr>
        <tr><th>Reason</th><td>${escapeHtml(reason.text)}</td></tr>
      </tbody>
    </table>
  </body>
</html>`;

  const printWindow = window.open("", "_blank");
  if (!printWindow) return;
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}
