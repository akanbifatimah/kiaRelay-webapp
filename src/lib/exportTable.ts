import { cssVar } from "./cssVar";

export interface ExportColumn<T> {
  header: string;
  value: (row: T) => string | number;
  align?: "left" | "right";
}

export interface TableExport<T> {
  /** Report name — becomes the PDF heading and the file name's stem. */
  title: string;
  /** e.g. the active date range / filters, printed under the title. */
  subtitle?: string;
  columns: ExportColumn<T>[];
  rows: T[];
  /** Optional totals row, one cell per column (same order). */
  footer?: (string | number)[];
}

function csvCell(value: string | number): string {
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function escapeHtml(value: string | number): string {
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function fileStem(title: string): string {
  return `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}-${new Date().toISOString().slice(0, 10)}`;
}

// Generic versions of the per-feature exporters (exportClaimsToCsv,
// downloadFinanceReport, ...), added for the Reports module (2026-09-23)
// where every table exports. Callers pass the FULL filtered+sorted set, not
// the visible page — a report export is the report, not a screenshot of it.
export function exportRowsToCsv<T>({ title, columns, rows, footer }: TableExport<T>): void {
  const lines = [
    columns.map((col) => csvCell(col.header)).join(","),
    ...rows.map((row) => columns.map((col) => csvCell(col.value(row))).join(",")),
  ];
  if (footer) lines.push(footer.map(csvCell).join(","));
  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${fileStem(title)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

// No PDF library in this project (see CLAUDE.md Tech Stack) — same
// print-to-PDF technique as downloadInvoicePdf.ts: open a styled document and
// call print(), whose dialog saves straight to PDF. Colors are resolved from
// the theme tokens via cssVar() rather than hardcoded (working rule 6).
// TODO: swap for a server-rendered GET /reports/:id/export?format=pdf once
// the Reporting API exists.
export function printRowsAsPdf<T>({ title, subtitle, columns, rows, footer }: TableExport<T>): boolean {
  const text = cssVar("--color-text");
  const muted = cssVar("--color-text-muted");
  const border = cssVar("--color-border");
  const dark = cssVar("--color-sidebar");
  const cell = (value: string | number, index: number, tag: "td" | "th") =>
    `<${tag} style="text-align:${columns[index]?.align ?? "left"}">${escapeHtml(value)}</${tag}>`;

  const html = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(fileStem(title))}</title>
    <style>
      body { font-family: Arial, sans-serif; color: ${text}; padding: 32px; }
      h1 { font-size: 20px; margin: 0 0 4px; }
      .muted { color: ${muted}; font-size: 12px; margin: 0; }
      table { width: 100%; border-collapse: collapse; margin-top: 20px; }
      th, td { padding: 6px 8px; border-bottom: 1px solid ${border}; font-size: 11px; }
      th { color: ${muted}; text-transform: uppercase; letter-spacing: 0.4px; font-weight: 600; }
      tfoot td { background: ${dark}; color: white; font-weight: 700; }
      @page { size: landscape; margin: 12mm; }
    </style>
  </head>
  <body>
    <h1>${escapeHtml(title)}</h1>
    <p class="muted">${escapeHtml(subtitle ?? "")}</p>
    <p class="muted">Generated ${escapeHtml(new Date().toLocaleString("en-US"))} · ${rows.length} rows · KiaRelay Admin</p>
    <table>
      <thead><tr>${columns.map((col, i) => cell(col.header, i, "th")).join("")}</tr></thead>
      <tbody>${rows.map((row) => `<tr>${columns.map((col, i) => cell(col.value(row), i, "td")).join("")}</tr>`).join("")}</tbody>
      ${footer ? `<tfoot><tr>${footer.map((value, i) => cell(value, i, "td")).join("")}</tr></tfoot>` : ""}
    </table>
  </body>
</html>`;

  const printWindow = window.open("", "_blank");
  if (!printWindow) return false;
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  return true;
}
