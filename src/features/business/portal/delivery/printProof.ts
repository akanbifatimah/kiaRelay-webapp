import { cssVar } from "../../../../lib/cssVar";
import { cityLine, cityState, formatWhen } from "../../deliveries/display";
import type { DeliveryOrder } from "../../deliveries/deliveryTypes";

const esc = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/**
 * "Download Proof": a print-ready proof-of-delivery page, saved as PDF from
 * the browser's print dialog (same zero-dependency approach as
 * downloadInvoicePdf). Colors come from the theme tokens.
 * TODO: GET /deliveries/:id/proof.pdf once the backend renders it.
 */
export function printProof(order: DeliveryOrder): boolean {
  const pod = order.pod;
  if (!pod) return false;
  const win = window.open("", "_blank");
  if (!win) return false;
  const text = cssVar("--color-text");
  const muted = cssVar("--color-text-muted");
  const border = cssVar("--color-border");
  const photo = pod.photo === "delivery-door" ? `${window.location.origin}/business/delivery-door.webp` : pod.photo;
  const rows: [string, string][] = [
    ["Order", order.id],
    ["Delivered", formatWhen(pod.signedAt)],
    ["From", `${order.pickup.address.name || order.pickup.address.street}, ${cityLine(order.pickup.address)}`],
    ["To", `${order.dropoff.address.name || order.dropoff.address.street}, ${cityLine(order.dropoff.address)}`],
    ["Signed by", `${pod.signedByFirstName} ${pod.signedByLastName}, ${pod.signedByTitle}`],
    ["Location verified", `${cityState(order.dropoff.address)} · ${pod.lat.toFixed(4)}° N, ${Math.abs(pod.lng).toFixed(4)}° W`],
    ["Driver", order.driver ? `${order.driver.firstName} ${order.driver.lastName} (${order.driver.id})` : "—"],
    ["PO / BOL", [order.references.po, order.references.bol].filter(Boolean).join(" / ") || "—"],
  ];
  win.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8" /><title>Proof of delivery ${esc(order.id)}</title>
<style>body{font-family:Arial,sans-serif;color:${text};padding:40px}h1{font-size:22px;margin:0 0 4px}p{color:${muted};font-size:13px;margin:0 0 20px}
img{width:100%;max-height:340px;object-fit:cover;border-radius:8px}table{width:100%;border-collapse:collapse;margin-top:20px}
td{padding:8px;border-bottom:1px solid ${border};font-size:13px}td:first-child{color:${muted};width:160px}</style></head>
<body onload="window.print()"><h1>Proof of Delivery — ${esc(order.id)}</h1><p>KiaRelay Business · ${esc(order.customerId)}</p>
<img src="${esc(photo)}" alt="Delivery photo" /><table>${rows.map(([k, v]) => `<tr><td>${esc(k)}</td><td>${esc(v)}</td></tr>`).join("")}</table></body></html>`);
  win.document.close();
  return true;
}
