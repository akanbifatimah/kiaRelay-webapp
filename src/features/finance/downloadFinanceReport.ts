import type { FinanceSnapshot } from "./data";

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function formatCurrency(value: number): string {
  return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
}

// Client-side only — no PDF library in this project (see CLAUDE.md Tech
// Stack). Same zero-dependency window.open + .print() technique as
// downloadInvoicePdf.ts/downloadOperationalReport.ts. TODO: replace with a
// real GET /finance/report once the backend can render one server-side.
export function downloadFinanceReport(snapshot: FinanceSnapshot, rangeLabel: string): void {
  const rows = snapshot.stats
    .map(
      (stat) => `
        <tr>
          <td>${escapeHtml(stat.label)}</td>
          <td style="text-align:right">${formatCurrency(stat.value)}</td>
        </tr>`,
    )
    .join("");

  const html = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Finance Report - ${escapeHtml(rangeLabel)}</title>
    <style>
      body { font-family: Arial, sans-serif; color: #111827; padding: 40px; }
      h1 { font-size: 22px; margin-bottom: 4px; }
      .muted { color: #6B7280; font-size: 13px; }
      table { width: 100%; border-collapse: collapse; margin-top: 24px; }
      th, td { text-align: left; padding: 8px; border-bottom: 1px solid #E5E7EB; font-size: 13px; }
    </style>
  </head>
  <body>
    <h1>Finance Report</h1>
    <p class="muted">${escapeHtml(rangeLabel)}</p>
    <table>
      <thead><tr><th>Metric</th><th style="text-align:right">Value</th></tr></thead>
      <tbody>${rows}</tbody>
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
