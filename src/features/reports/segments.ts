import { Building2, Factory, HardHat, HeartPulse, UserRound, type LucideIcon } from "lucide-react";

export type RevenueSegment = "oil-gas" | "construction" | "healthcare" | "commercial" | "individual";

export interface SegmentMeta {
  key: RevenueSegment;
  /** Full name — segment breakdown card. */
  label: string;
  /** Short name — ledger table / exports. */
  shortLabel: string;
  /** Contract/service tag chip shown next to the label. */
  tag: string;
  icon: LucideIcon;
  /** Share of daily gross revenue — the ledger generator's weighting. */
  weight: number;
  /** Accessorials (demurrage/surge/fuel/tolls) as a share of that segment's gross. */
  accessorialShare: number;
  /** Refund incidence per daily cycle (0–1). */
  refundRate: number;
}

// Industrial verticals from the Revenue Reports design (2026-09-23). The
// weights reproduce its breakdown (~41/24/18/12/5%); everything shown on the
// page is computed from the generated ledger, not from these directly.
export const SEGMENTS: SegmentMeta[] = [
  { key: "oil-gas", label: "Oil & Gas (Refinery & Pipelines)", shortLabel: "Oil & Gas (Refinery)", tag: "Contract Tier 1", icon: Factory, weight: 0.41, accessorialShare: 0.2, refundRate: 0.35 },
  { key: "construction", label: "Construction & Heavy Materials", shortLabel: "Construction & Heavy", tag: "Bulk Flatbed", icon: HardHat, weight: 0.24, accessorialShare: 0.13, refundRate: 0.25 },
  { key: "healthcare", label: "Healthcare & Pharmaceuticals", shortLabel: "Healthcare & Pharma", tag: "Cold Chain Expedited", icon: HeartPulse, weight: 0.18, accessorialShare: 0.12, refundRate: 0.3 },
  { key: "commercial", label: "General Commercial & Industrial Supply", shortLabel: "Commercial Freight", tag: "B2B Scheduled", icon: Building2, weight: 0.12, accessorialShare: 0.09, refundRate: 0.4 },
  { key: "individual", label: "Individual Direct Deliveries", shortLabel: "Individual Consumer", tag: "On-Demand Consumer", icon: UserRound, weight: 0.05, accessorialShare: 0.08, refundRate: 0.5 },
];

export const segmentMeta = (key: RevenueSegment): SegmentMeta => SEGMENTS.find((segment) => segment.key === key) as SegmentMeta;
