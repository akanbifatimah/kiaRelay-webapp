export type FinanceStatType =
  | "revenue"
  | "net"
  | "payouts"
  | "pending"
  | "refunds"
  | "fees"
  | "commission"
  | "credits"
  | "adjustments";

export interface FinanceStat {
  type: FinanceStatType;
  label: string;
  value: number;
  /** Defaults to true — set false for plain counts (e.g. Pending Adjustments). */
  isCurrency?: boolean;
  deltaPct?: number;
  /** For stats where a drop is the good outcome (Refunds) — colors the delta green on a negative value. */
  invertDeltaColor?: boolean;
  secondaryLabel?: string;
}

export interface RevenueSnapshotPoint {
  label: string;
  gross: number;
  net: number;
}

export interface RevenueSnapshotSeries {
  daily: RevenueSnapshotPoint[];
  weekly: RevenueSnapshotPoint[];
  monthly: RevenueSnapshotPoint[];
}

export type DeliveryTypeKey = "standard" | "express" | "scheduled";

export interface DeliveryTypeRevenue {
  type: DeliveryTypeKey;
  label: string;
  deliveries: number;
  avgOrder: number;
  totalBill: number;
}

export interface CustomerSegment {
  key: "individuals" | "companies";
  label: string;
  revenue: number;
  volume: number;
  avgOrder: number;
}

export interface UpcomingSettlement {
  id: string;
  label: string;
  date: string;
  amount: number;
}

export type FinanceRangeKey = "today" | "week" | "month" | "quarter";

export interface FinanceSnapshot {
  stats: FinanceStat[];
  netRevenueTotal: number;
  revenueDeltaAmount: number;
  revenueDeltaPct: number;
  revenue: RevenueSnapshotSeries;
  deliveryTypes: DeliveryTypeRevenue[];
  segments: CustomerSegment[];
  segmentNote: string;
  settlements: UpcomingSettlement[];
}

export interface CustomRange {
  from: string;
  to: string;
}

export function getDefaultCustomRange(): CustomRange {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - 6);
  const format = (date: Date) => date.toISOString().slice(0, 10);
  return { from: format(from), to: format(to) };
}
