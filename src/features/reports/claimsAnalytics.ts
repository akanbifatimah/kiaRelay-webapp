import { claimCategoryLabels, type ClaimCategory, type ClaimInvestigation } from "../support/claimInvestigation";
import { addDays, daysBetween, startOfDay, type RangeBounds } from "./reportRange";

export const CLAIM_CATEGORIES = Object.keys(claimCategoryLabels) as ClaimCategory[];

// Same four-tone category scheme as Claims Management's donut, so a category
// reads as the same color across both screens.
export const CATEGORY_FILL: Record<ClaimCategory, string> = {
  "transit-damage": "var(--color-sidebar)",
  loss: "var(--color-primary)",
  delay: "var(--color-sidebar-fg)",
  billing: "var(--color-border)",
};

/** Non-draft claims created inside `bounds` (claims store dates are relative to today). */
export function claimsInRange(claims: ClaimInvestigation[], bounds: RangeBounds): ClaimInvestigation[] {
  const today = startOfDay(new Date());
  const newest = daysBetween(bounds.to, today);
  const oldest = daysBetween(bounds.from, today);
  return claims.filter((claim) => claim.status !== "draft" && claim.createdDaysAgo >= newest && claim.createdDaysAgo <= oldest);
}

export interface ClaimsSummary {
  total: number;
  claimedValue: number;
  resolved: number;
  resolutionRate: number;
  avgResolutionDays: number;
  escalated: number;
}

export function summarizeClaims(claims: ClaimInvestigation[]): ClaimsSummary {
  const resolved = claims.filter((claim) => claim.status === "resolved");
  const durations = resolved.map((claim) => claim.createdDaysAgo - (claim.resolvedDaysAgo ?? claim.createdDaysAgo));
  return {
    total: claims.length,
    claimedValue: claims.reduce((sum, claim) => sum + claim.amount, 0),
    resolved: resolved.length,
    resolutionRate: claims.length === 0 ? 0 : (resolved.length / claims.length) * 100,
    avgResolutionDays: durations.length === 0 ? 0 : durations.reduce((sum, days) => sum + days, 0) / durations.length,
    escalated: claims.filter((claim) => claim.status === "escalated").length,
  };
}

export type CategoryVolumePoint = { label: string } & Record<ClaimCategory, number>;

/** Daily buckets up to a month, weekly beyond — stacked by category. */
export function buildCategoryVolume(claims: ClaimInvestigation[], bounds: RangeBounds): CategoryVolumePoint[] {
  const today = startOfDay(new Date());
  const step = bounds.days <= 31 ? 1 : 7;
  const points: CategoryVolumePoint[] = [];
  for (let start = startOfDay(bounds.from); start <= bounds.to; start = addDays(start, step)) {
    const end = addDays(start, step - 1);
    const newest = Math.max(0, daysBetween(end < bounds.to ? end : bounds.to, today));
    const oldest = daysBetween(start, today);
    const bucket = claims.filter((claim) => claim.createdDaysAgo >= newest && claim.createdDaysAgo <= oldest);
    const point = { label: start.toLocaleDateString("en-US", { month: "short", day: "numeric" }) } as CategoryVolumePoint;
    CLAIM_CATEGORIES.forEach((category) => {
      point[category] = bucket.filter((claim) => claim.category === category).length;
    });
    points.push(point);
  }
  return points;
}

export interface CategoryRow extends ClaimsSummary {
  category: ClaimCategory;
  label: string;
  share: number;
  avgClaim: number;
}

export function buildCategoryRows(claims: ClaimInvestigation[]): CategoryRow[] {
  return CLAIM_CATEGORIES.map((category) => {
    const subset = claims.filter((claim) => claim.category === category);
    const summary = summarizeClaims(subset);
    return {
      ...summary,
      category,
      label: claimCategoryLabels[category],
      share: claims.length === 0 ? 0 : (subset.length / claims.length) * 100,
      avgClaim: subset.length === 0 ? 0 : summary.claimedValue / subset.length,
    };
  });
}
