import type { CustomRange } from "../../components/CustomDateRangePicker";

export type ReportRangeKey = "today" | "7d" | "30d" | "90d" | "ytd" | "custom";

export interface ReportRange {
  key: ReportRangeKey;
  /** Only read when key === "custom". */
  custom: CustomRange;
}

export const REPORT_RANGE_PRESETS: { key: Exclude<ReportRangeKey, "custom">; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "7d", label: "7D" },
  { key: "30d", label: "30D" },
  { key: "90d", label: "90D" },
  { key: "ytd", label: "YTD" },
];

export interface RangeBounds {
  from: Date;
  to: Date;
  /** Inclusive day count — used to scale per-period metrics. */
  days: number;
}

const DAY_MS = 86_400_000;

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

/** Local-time YYYY-MM-DD (toISOString would shift by the UTC offset). */
export function isoDate(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function parseIsoDate(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function daysBetween(from: Date, to: Date): number {
  return Math.round((startOfDay(to).getTime() - startOfDay(from).getTime()) / DAY_MS);
}

const PRESET_DAYS: Record<"today" | "7d" | "30d" | "90d", number> = { today: 1, "7d": 7, "30d": 30, "90d": 90 };

export function rangeBounds(range: ReportRange): RangeBounds {
  const today = startOfDay(new Date());
  if (range.key === "custom") {
    const from = parseIsoDate(range.custom.from);
    const to = parseIsoDate(range.custom.to);
    return { from, to, days: daysBetween(from, to) + 1 };
  }
  if (range.key === "ytd") {
    const from = new Date(today.getFullYear(), 0, 1);
    return { from, to: today, days: daysBetween(from, today) + 1 };
  }
  const days = PRESET_DAYS[range.key];
  return { from: addDays(today, -(days - 1)), to: today, days };
}

/** The equally-long window immediately before `bounds` — for period deltas. */
export function previousBounds(bounds: RangeBounds): RangeBounds {
  const to = addDays(bounds.from, -1);
  return { from: addDays(to, -(bounds.days - 1)), to, days: bounds.days };
}

export function isWithin(dateIso: string, bounds: RangeBounds): boolean {
  return dateIso >= isoDate(bounds.from) && dateIso <= isoDate(bounds.to);
}

const shortDate = (date: Date) => date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

export function rangeLabel(range: ReportRange): string {
  const { from, to } = rangeBounds(range);
  const preset = REPORT_RANGE_PRESETS.find((p) => p.key === range.key)?.label ?? "Custom";
  return from.getTime() === to.getTime() ? `${preset} · ${shortDate(to)}` : `${preset} · ${shortDate(from)} – ${shortDate(to)}`;
}

export function defaultCustomRange(): CustomRange {
  const today = startOfDay(new Date());
  return { from: isoDate(addDays(today, -13)), to: isoDate(today) };
}

export const DEFAULT_RANGE: ReportRange = { key: "30d", custom: defaultCustomRange() };
