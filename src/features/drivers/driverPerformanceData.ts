import type { DriverPerformanceDetail } from "./driverPerformanceDetail";

// TODO: replace with GET /drivers/:id/performance once the Reporting &
// Analytics API exists. Only Marcus Thorne (DR-08190) has real detail — split
// out from driverPerformanceDetail.ts once the todayActivity/review fields
// pushed it past the 150-line limit (same split already done for
// driverRoster.ts/driverRosterData.ts).
export const handAuthoredPerformance: Record<string, DriverPerformanceDetail> = {
  "DR-08190": {
    onTimePct: 94,
    onTimeDeltaPct: 2.4,
    rating: 4.8,
    deliveriesCount: 1240,
    metrics: [
      { label: "Acceptance Rate", value: "92%", qualifier: "Excellent" },
      { label: "Cancellation Rate", value: "3%", qualifier: "Low Risk" },
      { label: "Proof of Delivery", value: "98%", qualifier: "Consistent" },
      { label: "Avg Completion Time", value: "42 min", qualifier: "Optimized" },
    ],
    trend: [
      { label: "Jan", onTimePct: 86, efficiencyScore: 80 },
      { label: "Feb", onTimePct: 88, efficiencyScore: 82 },
      { label: "Mar", onTimePct: 87, efficiencyScore: 84 },
      { label: "Apr", onTimePct: 90, efficiencyScore: 88 },
      { label: "May", onTimePct: 93, efficiencyScore: 91 },
      { label: "Jun", onTimePct: 94, efficiencyScore: 93 },
    ],
    reviews: [
      {
        reviewer: "Jane Smith",
        rating: 5,
        orderRef: "#ORD-88219",
        text: "Marcus was extremely professional and handled our fragile equipment with great care. Arrived 10 minutes early and called ahead to confirm the loading dock was ready.",
      },
      {
        reviewer: "Robert King",
        rating: 4,
        orderRef: "#ORD-88512",
        text: "Very efficient delivery. Marcus updated the ETA through the app consistently, which helped our warehouse team prepare the intake area on time. Highly recommended.",
      },
    ],
    totalReviewCount: 86,
    percentileNote: "Marcus is currently in the top 5% of regional drivers for Express Delivery Accuracy.",
    milesDrivenMtd: 4120,
    milesDrivenMax: 5000,
    fuelEfficiencyMpg: 6.8,
    fuelEfficiencyMax: 12,
    todayActivity: [
      {
        id: "today-1",
        type: "delivery",
        title: "Delivery Completed",
        description: "Order #ORD-88219 - Austin Terminal. POD uploaded successfully.",
        timestamp: "2:20 PM",
      },
      {
        id: "today-2",
        type: "status",
        title: "Status Updated",
        description: "Departed from Dallas Logistics Hub. En-route to Austin.",
        timestamp: "11:05 AM",
      },
      {
        id: "today-3",
        type: "maintenance",
        title: "Maintenance Alert",
        description: "Vehicle #V-202 inspection logged. Low tire pressure reported on rear axle.",
        timestamp: "9:45 AM",
      },
      {
        id: "today-4",
        type: "shift",
        title: "Shift Started",
        description: "Marcus clocked in at Dallas Main Facility.",
        timestamp: "7:00 AM",
      },
    ],
    isLive: true,
    lastKnownLat: 30.1499,
    lastKnownLng: -97.7511,
    lastKnownLocationAddress: "Interstate 35 Southbound, TX",
  },
};
