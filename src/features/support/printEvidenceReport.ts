import { downloadFile } from "../../lib/downloadFile";
import type { ClaimInvestigation } from "./claimInvestigation";

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// Same zero-dependency approach as downloadInvoicePdf.ts: build a print-
// ready HTML document and open the browser's print dialog, which can save
// straight to PDF. The inline colors below live in a standalone print
// document (not the app's DOM), so there are no theme tokens to reference.
export function printEvidenceReport(claim: ClaimInvestigation): void {
  const origin = window.location.origin;
  const photos = claim.photos
    .map(
      (photo) => `<figure><img src="${origin}${photo.src}" alt="${photo.kind}" />
        <figcaption><strong>${photo.kind === "pickup" ? "Pickup" : "Delivery"} — ${escapeHtml(photo.timestamp)}</strong><br/>
        ${photo.lat.toFixed(4)}, ${photo.lng.toFixed(4)}<br/>${escapeHtml(photo.caption)}</figcaption></figure>`,
    )
    .join("");
  const gps = claim.gps
    .map((p) => `<tr><td>${escapeHtml(p.label)}</td><td>${escapeHtml(p.time)}</td><td>${p.lat.toFixed(4)}, ${p.lng.toFixed(4)}</td><td>${escapeHtml(p.note)}</td></tr>`)
    .join("");
  const signatures = claim.signatures
    .map((s) => `<tr><td>${escapeHtml(s.signer)} (${escapeHtml(s.role)})</td><td>${escapeHtml(s.time)}</td><td>${s.status}</td><td>${escapeHtml(s.note)}</td></tr>`)
    .join("");

  const html = `<!doctype html><html><head><title>Evidence Report ${escapeHtml(claim.id)}</title>
  <style>
    body { font-family: Inter, system-ui, sans-serif; color: #111827; margin: 32px; font-size: 13px; }
    h1 { font-size: 20px; margin: 0; } h2 { font-size: 14px; margin: 24px 0 8px; }
    .meta { color: #6b7280; margin-top: 4px; }
    .photos { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    img { width: 100%; border-radius: 8px; border: 1px solid #e5e7eb; }
    figure { margin: 0; } figcaption { margin-top: 6px; color: #374151; }
    table { width: 100%; border-collapse: collapse; } th, td { text-align: left; padding: 6px 8px; border-bottom: 1px solid #e5e7eb; }
    th { color: #6b7280; font-weight: 500; }
  </style></head><body onload="window.print()">
    <h1>Evidence Report — ${escapeHtml(claim.id)}</h1>
    <p class="meta">${escapeHtml(claim.serviceTag)} • ${escapeHtml(claim.type)} • Order ${escapeHtml(claim.order.ref)} • ${escapeHtml(claim.customer.name)} • Driver ${escapeHtml(claim.driver.name)}</p>
    <h2>Photos</h2><div class="photos">${photos}</div>
    <h2>GPS Data</h2><table><thead><tr><th>Point</th><th>Time</th><th>Coordinates</th><th>Note</th></tr></thead><tbody>${gps}</tbody></table>
    <h2>Signatures</h2><table><thead><tr><th>Signer</th><th>Time</th><th>Status</th><th>Note</th></tr></thead><tbody>${signatures}</tbody></table>
  </body></html>`;

  const printWindow = window.open("", "_blank");
  if (!printWindow) return;
  printWindow.document.write(html);
  printWindow.document.close();
  // Printing is triggered by the document's own body onload (above), so the
  // dialog waits for the photos to load instead of printing empty boxes.
  printWindow.focus();
}

export function exportEvidenceMedia(claim: ClaimInvestigation): void {
  claim.photos.forEach((photo) => {
    const extension = photo.src.split(".").pop() ?? "svg";
    downloadFile(photo.src, `${claim.id}-${photo.kind}.${extension}`);
  });
}
