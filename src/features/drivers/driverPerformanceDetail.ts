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

// TODO: replace with GET /drivers/:id/performance once the Reporting &
// Analytics API exists. Hand-authored data lives in driverPerformanceData.ts
// — only Marcus Thorne (DR-08190) has bespoke detail. Every other driver id
// gets this generic-but-real-looking fallback rather than empty arrays —
// an empty chart/review list/activity feed reads as a broken page, not just
// "backed by mock data" (same class of bug already fixed for Recent Orders
// and for customers' own generic fallback).
function buildGenericDetail(): DriverPerformanceDetail {
  return {
    onTimePct: 88,
    onTimeDeltaPct: 1.2,
    rating: 4.3,
    deliveriesCount: 340,
    metrics: [
      { label: "Acceptance Rate", value: "89%", qualifier: "Good" },
      { label: "Cancellation Rate", value: "5%", qualifier: "Moderate" },
      { label: "Proof of Delivery", value: "95%", qualifier: "Consistent" },
      { label: "Avg Completion Time", value: "48 min", qualifier: "Steady" },
    ],
    trend: [
      { label: "Jan", onTimePct: 80, efficiencyScore: 76 },
      { label: "Feb", onTimePct: 82, efficiencyScore: 78 },
      { label: "Mar", onTimePct: 83, efficiencyScore: 79 },
      { label: "Apr", onTimePct: 85, efficiencyScore: 81 },
      { label: "May", onTimePct: 87, efficiencyScore: 83 },
      { label: "Jun", onTimePct: 88, efficiencyScore: 85 },
    ],
    reviews: buildFillerReviews(2),
    totalReviewCount: 12,
    percentileNote: "Still building a full delivery history — performance data will grow more detailed over time.",
    milesDrivenMtd: 1200,
    milesDrivenMax: 5000,
    fuelEfficiencyMpg: 7.5,
    fuelEfficiencyMax: 12,
    todayActivity: [
      {
        id: "generic-today-1",
        type: "shift",
        title: "Shift Started",
        description: "Driver clocked in for today's route.",
        timestamp: "8:00 AM",
      },
    ],
    isLive: false,
    lastKnownLocationAddress: "No location data yet.",
  };
}

export function getPerformanceDetail(driverId: string): DriverPerformanceDetail {
  return handAuthoredPerformance[driverId] ?? buildGenericDetail();
}

// AllReviewsModal shows a representative page of reviews, not literally all
// totalReviewCount — same "generated filler for a fuller list" approach used
// throughout this feature (e.g. driverRoster.ts's buildFillerDrivers). Works
// for generic drivers too, not just hand-authored ones, so it agrees with
// the preview card instead of showing zero reviews underneath a populated one.
export function getAllReviews(driverId: string): PerformanceReview[] {
  const { reviews } = getPerformanceDetail(driverId);
  return [...reviews, ...buildFillerReviews(13)];
}
