import { handAuthoredPerformance } from "./driverPerformanceData";

export interface QualifiedMetric {
  label: string;
  value: string;
  qualifier: string;
}

export interface PerformanceReview {
  reviewer: string;
  rating: number;
  orderRef: string;
  text: string;
}

export interface PerformanceTrendPoint {
  label: string;
  onTimePct: number;
  efficiencyScore: number;
}

export type TodayActivityType = "delivery" | "status" | "maintenance" | "shift";

export interface TodayActivityEntry {
  id: string;
  type: TodayActivityType;
  title: string;
  description: string;
  timestamp: string;
}

export interface DriverPerformanceDetail {
  onTimePct: number;
  onTimeDeltaPct: number;
  rating: number;
  deliveriesCount: number;
  metrics: QualifiedMetric[];
  trend: PerformanceTrendPoint[];
  reviews: PerformanceReview[];
  totalReviewCount: number;
  percentileNote: string;
  milesDrivenMtd: number;
  milesDrivenMax: number;
  fuelEfficiencyMpg: number;
  fuelEfficiencyMax: number;
  todayActivity: TodayActivityEntry[];
  /** Whether lastKnownLat/Lng reflect a real live signal — drives the map +
   * badge color instead of hardcoding "active" styling regardless of data. */
  isLive: boolean;
  lastKnownLat?: number;
  lastKnownLng?: number;
  lastKnownLocationAddress: string;
}

// TODO: replace with GET /drivers/:id/performance once the Reporting &
// Analytics API exists. Hand-authored data lives in driverPerformanceData.ts
// — only Marcus Thorne (DR-08190) has real detail, generic fallback below
// for every other driver id.
function buildGenericDetail(): DriverPerformanceDetail {
  return {
    onTimePct: 0,
    onTimeDeltaPct: 0,
    rating: 0,
    deliveriesCount: 0,
    metrics: [
      { label: "Acceptance Rate", value: "—", qualifier: "No data" },
      { label: "Cancellation Rate", value: "—", qualifier: "No data" },
      { label: "Proof of Delivery", value: "—", qualifier: "No data" },
      { label: "Avg Completion Time", value: "—", qualifier: "No data" },
    ],
    trend: [],
    reviews: [],
    totalReviewCount: 0,
    percentileNote: "No performance history yet.",
    milesDrivenMtd: 0,
    milesDrivenMax: 5000,
    fuelEfficiencyMpg: 0,
    fuelEfficiencyMax: 12,
    todayActivity: [],
    isLive: false,
    lastKnownLocationAddress: "No location data yet.",
  };
}

export function getPerformanceDetail(driverId: string): DriverPerformanceDetail {
  return handAuthoredPerformance[driverId] ?? buildGenericDetail();
}

const fillerReviewers = ["Priya Anand", "Marcus Lee", "Dana Whitfield", "Carlos Ibarra", "Emily Tran"];
const fillerTexts = [
  "On time and communicated well throughout the delivery window.",
  "Package arrived in great condition, no complaints.",
  "Friendly and professional — would request again.",
  "Kept us updated via the app the whole way. Smooth handoff.",
  "Handled a tight loading dock schedule without any issues.",
];

function buildFillerReviews(count: number): PerformanceReview[] {
  return Array.from({ length: count }, (_, i) => ({
    reviewer: fillerReviewers[i % fillerReviewers.length],
    rating: 4 + (i % 2),
    orderRef: `#ORD-${88600 + i}`,
    text: fillerTexts[i % fillerTexts.length],
  }));
}

// AllReviewsModal shows a representative page of reviews, not literally all
// totalReviewCount — same "generated filler for a fuller list" approach used
// throughout this feature (e.g. driverRoster.ts's buildFillerDrivers).
export function getAllReviews(driverId: string): PerformanceReview[] {
  const detail = handAuthoredPerformance[driverId];
  if (!detail) return [];
  return [...detail.reviews, ...buildFillerReviews(13)];
}
