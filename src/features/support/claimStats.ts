import { claimCategoryLabels, type ClaimCategory, type ClaimInvestigation, type ClaimStatus } from "./claimInvestigation";

export interface ClaimTileStat {
  key: "open" | "in-review" | "escalated" | "resolved" | "month";
  label: string;
  value: number;
  /** e.g. "+12" / "-3" / "Steady" / "+8%". */
  delta: string;
  trend: "up" | "down" | "flat";
}

// Everything below is derived from the claim records themselves (never a
// separate static number), so creating/resolving a claim moves the tiles,
// chart and donut together.
const inWindow = (claim: ClaimInvestigation, from: number, to: number) => claim.createdDaysAgo >= from && claim.createdDaysAgo < to;

function countDelta(claims: ClaimInvestigation[], status: ClaimStatus): Pick<ClaimTileStat, "delta" | "trend"> {
  const recent = claims.filter((claim) => claim.status === status && inWindow(claim, 0, 7)).length;
  const prior = claims.filter((claim) => claim.status === status && inWindow(claim, 7, 14)).length;
  const diff = recent - prior;
  if (diff === 0) return { delta: "Steady", trend: "flat" };
  return { delta: `${diff > 0 ? "+" : ""}${diff}`, trend: diff > 0 ? "up" : "down" };
}

export function buildClaimTiles(all: ClaimInvestigation[]): ClaimTileStat[] {
  const claims = all.filter((claim) => claim.status !== "draft");
  const count = (status: ClaimStatus) => claims.filter((claim) => claim.status === status).length;
  const dayOfMonth = new Date().getDate();
  const thisMonth = claims.filter((claim) => claim.createdDaysAgo < dayOfMonth).length;
  const lastMonthSoFar = claims.filter((claim) => inWindow(claim, 30, 30 + dayOfMonth)).length;
  const monthPct = lastMonthSoFar === 0 ? 0 : Math.round(((thisMonth - lastMonthSoFar) / lastMonthSoFar) * 100);
  return [
    { key: "open", label: "Open Claims", value: count("open"), ...countDelta(claims, "open") },
    { key: "in-review", label: "In Review", value: count("in-review"), ...countDelta(claims, "in-review") },
    { key: "escalated", label: "Escalated", value: count("escalated"), ...countDelta(claims, "escalated") },
    { key: "resolved", label: "Resolved", value: count("resolved"), ...countDelta(claims, "resolved") },
    { key: "month", label: "This Month", value: thisMonth, delta: `${monthPct >= 0 ? "+" : ""}${monthPct}%`, trend: monthPct > 0 ? "up" : monthPct < 0 ? "down" : "flat" },
  ];
}

export interface VolumePoint {
  label: string;
  incoming: number;
  resolved: number;
}

export const VOLUME_RANGES = [
  { days: 7, label: "Last 7 Days" },
  { days: 30, label: "Last 30 Days" },
  { days: 90, label: "Last 90 Days" },
];

function dayLabel(daysAgo: number, range: number): string {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return range <= 7
    ? date.toLocaleDateString("en-US", { weekday: "short" })
    : date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/** Daily incoming (created) vs resolved counts, oldest → newest. 90 days is
 * bucketed by week so the x-axis stays readable. */
export function buildVolumeSeries(all: ClaimInvestigation[], range: number): VolumePoint[] {
  const claims = all.filter((claim) => claim.status !== "draft");
  const bucket = range > 30 ? 7 : 1;
  const points: VolumePoint[] = [];
  for (let start = range - bucket; start >= 0; start -= bucket) {
    const end = start + bucket;
    points.push({
      label: bucket === 1 ? dayLabel(start, range) : `Wk of ${dayLabel(end - 1, range)}`,
      incoming: claims.filter((claim) => claim.createdDaysAgo >= start && claim.createdDaysAgo < end).length,
      resolved: claims.filter((claim) => claim.resolvedDaysAgo !== undefined && claim.resolvedDaysAgo >= start && claim.resolvedDaysAgo < end).length,
    });
  }
  return points;
}

export interface CategorySlice {
  category: ClaimCategory;
  label: string;
  value: number;
  pct: number;
}

export function buildCategoryDistribution(all: ClaimInvestigation[]): CategorySlice[] {
  const claims = all.filter((claim) => claim.status !== "draft");
  const total = claims.length || 1;
  return (Object.keys(claimCategoryLabels) as ClaimCategory[]).map((category) => {
    const value = claims.filter((claim) => claim.category === category).length;
    return { category, label: claimCategoryLabels[category], value, pct: Math.round((value / total) * 100) };
  });
}
