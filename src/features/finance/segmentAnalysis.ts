import { customers, type CustomerAccountType } from "../customers/data";
import type { CustomerSegment } from "./data";

export interface SegmentTopCustomer {
  id: string;
  accountType: CustomerAccountType;
  name: string;
  revenue: number;
}

export interface SegmentAnalysisEntry {
  key: CustomerSegment["key"];
  label: string;
  trend: number[];
  topCustomers: SegmentTopCustomer[];
}

const accountTypeByKey: Record<CustomerSegment["key"], CustomerAccountType> = {
  individuals: "individual",
  companies: "company",
};

function buildTrend(finalValue: number): number[] {
  return Array.from({ length: 6 }, (_, i) => Math.round(finalValue * (0.6 + i * 0.08)));
}

// TODO: replace with GET /finance/segments/:key once the reporting API
// exists. Top customers reuse the Dashboard's synthetic-revenue technique
// (orders × $37.50 — the real customers dataset doesn't track revenue per
// customer, see CLAUDE.md's "Top Customers (Dashboard)" note) so every
// listed customer links to a real profile.
export function getSegmentAnalyses(segments: CustomerSegment[]): SegmentAnalysisEntry[] {
  return segments.map((segment) => {
    const accountType = accountTypeByKey[segment.key];
    const topCustomers = customers
      .filter((c) => c.accountType === accountType)
      .sort((a, b) => b.orders - a.orders)
      .slice(0, 3)
      .map((c) => ({ id: c.id, accountType: c.accountType, name: c.name, revenue: Math.round(c.orders * 37.5) }));

    return {
      key: segment.key,
      label: segment.label,
      trend: buildTrend(segment.revenue),
      topCustomers,
    };
  });
}
