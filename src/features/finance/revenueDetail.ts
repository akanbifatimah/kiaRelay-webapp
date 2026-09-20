import type { FinanceStat } from "./data";

export interface RevenueSegment {
  key: string;
  label: string;
  revenue: number;
  sharePct: number;
}

export interface CommissionOutlook {
  note: string;
  projectedIncreasePct: number;
}

export interface CommissionTier {
  name: string;
  volumeRangeLabel: string;
  ratePct: number;
  isCurrent: boolean;
}

// TODO: replace with GET /finance/revenue once the reporting API exists.
export const revenueStats: FinanceStat[] = [
  { type: "revenue", label: "Gross Revenue", value: 4200000, deltaPct: 12 },
  { type: "net", label: "Net Revenue", value: 1800000, deltaPct: 4.4 },
  { type: "payouts", label: "Driver Payouts", value: 2100000, secondaryLabel: "50% of Gross" },
  { type: "refunds", label: "Refunds/Adj", value: -42500, deltaPct: 2, secondaryLabel: "vs last period" },
  { type: "commission", label: "Commission", value: 242000, secondaryLabel: "Tier 1 Avg" },
  { type: "fees", label: "Platform Fees", value: 18900, secondaryLabel: "Fixed Cost" },
];

export const revenueSegments: RevenueSegment[] = [
  { key: "enterprise", label: "Enterprise", revenue: 2400000, sharePct: 57 },
  { key: "smb", label: "SMB Logistics", revenue: 1200000, sharePct: 28 },
  { key: "public", label: "Public Sector", revenue: 600000, sharePct: 15 },
];

export const commissionOutlook: CommissionOutlook = {
  note: "Optimizing commission tiers based on driver performance and market density.",
  projectedIncreasePct: 14.2,
};

export const commissionTiers: CommissionTier[] = [
  { name: "Tier 1", volumeRangeLabel: "0 – 500 deliveries / mo", ratePct: 12, isCurrent: true },
  { name: "Tier 2", volumeRangeLabel: "501 – 1,500 deliveries / mo", ratePct: 10, isCurrent: false },
  { name: "Tier 3", volumeRangeLabel: "1,501+ deliveries / mo", ratePct: 8, isCurrent: false },
];

export const revenueFilterOptions = {
  dateRanges: ["Last 7 Days", "Last 30 Days", "Last 90 Days", "This Year"],
  segments: ["All Segments", "Enterprise", "SMB Logistics", "Public Sector"],
  deliveryTypes: ["All Types", "Standard", "Express", "Scheduled"],
  regions: ["Global", "North America", "Europe", "APAC"],
  verticals: ["All Verticals", "Healthcare", "Retail", "Manufacturing"],
};
