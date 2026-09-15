function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

interface OperationalReportInput {
  driverName: string;
  percentileNote: string;
  milesDrivenMtd: number;
  fuelEfficiencyMpg: number;
  onTimePct: number;
  rating: number;
  deliveriesCount: number;
}

// Client-side only — no PDF library in this project (see CLAUDE.md Tech
// Stack). Same zero-dependency window.open + .print() technique as
// downloadInvoicePdf.ts. TODO: replace with a real GET
// /drivers/:id/operational-report once the backend can render one.
export function downloadOperationalReport(input: OperationalReportInput): void {
  const html = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Operational Report - ${escapeHtml(input.driverName)}</title>
    <style>
      body { font-family: Arial, sans-serif; color: #111827; padding: 40px; }
      h1 { font-size: 22px; margin-bottom: 4px; }
      .muted { color: #6B7280; font-size: 13px; }
      table { width: 100%; border-collapse: collapse; margin-top: 24px; }
      th, td { text-align: left; padding: 8px; border-bottom: 1px solid #E5E7EB; font-size: 13px; }
    </style>
  </head>
  <body>
    <h1>Operational Report</h1>
    <p class="muted">${escapeHtml(input.driverName)}</p>
    <p>${escapeHtml(input.percentileNote)}</p>
    <table>
      <tbody>
        <tr><th>Miles Driven (MTD)</th><td>${input.milesDrivenMtd.toLocaleString()} mi</td></tr>
        <tr><th>Fuel Efficiency</th><td>${input.fuelEfficiencyMpg} mpg</td></tr>
        <tr><th>On-Time Performance</th><td>${input.onTimePct}%</td></tr>
        <tr><th>Rating</th><td>${input.rating.toFixed(1)} (${input.deliveriesCount.toLocaleString()} deliveries)</td></tr>
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
