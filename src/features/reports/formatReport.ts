/** "$1,428,950" — whole dollars, for tiles and chart labels. */
export function formatMoney(value: number): string {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

/** "$148,220.00" / "-$1,420.00" — ledger-style, always two decimals. */
export function formatMoneyExact(value: number): string {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/** "$214k" / "$1.4M" — compact axis ticks. */
export function formatMoneyCompact(value: number): string {
  if (Math.abs(value) >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (Math.abs(value) >= 1_000) return `$${Math.round(value / 1_000)}k`;
  return `$${Math.round(value)}`;
}

export function formatPct(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/** "+14.2%" / "-0.3%" — period-over-period change. */
export function formatDeltaPct(current: number, previous: number): { label: string; direction: "up" | "down" | "flat" } {
  if (previous === 0) return { label: "—", direction: "flat" };
  const pct = ((current - previous) / previous) * 100;
  const rounded = Math.round(pct * 10) / 10;
  if (rounded === 0) return { label: "0.0%", direction: "flat" };
  return { label: `${rounded > 0 ? "+" : ""}${rounded.toFixed(1)}%`, direction: rounded > 0 ? "up" : "down" };
}

/** Green / amber / red thresholds shared by every OTD figure in Reports. */
export function otdTone(rate: number): string {
  if (rate >= 93) return "text-success";
  if (rate >= 90) return "text-warning";
  return "text-danger";
}

export function claimTone(rate: number): string {
  return rate >= 2.5 ? "text-warning" : "text-text";
}
