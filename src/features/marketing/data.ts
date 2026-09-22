// Core Marketing types + the audience/area breakdown shared by the dashboard's
// "Where your customers are" card and the Create Email flow's area picker —
// both screenshots show the exact same five areas and counts, so this is
// defined once here rather than duplicated per screen.

export type MarketingEmailStatus = "sent" | "draft" | "scheduled" | "sending" | "failed";
export type PerformanceTone = "good" | "okay" | "poor";

export interface MarketingArea {
  id: string;
  name: string;
  customerCount: number;
  tone: PerformanceTone;
  lat: number;
  lng: number;
}

// tone here reflects how each area historically responds to campaigns (used
// by CustomerDistributionCard's marker coloring) — not a live metric.
// Coordinates are real Gulf Coast locations except "Zone A Corridor", a
// fictional internal dispatch zone placed along the coast between Houston
// and Beaumont — same real-Houston-center convention as dispatch/data.ts.
export const marketingAreas: MarketingArea[] = [
  { id: "houston-metro", name: "Houston Metro", customerCount: 2340, tone: "good", lat: 29.7604, lng: -95.3698 },
  { id: "zone-a", name: "Zone A Corridor", customerCount: 1120, tone: "good", lat: 29.95, lng: -93.95 },
  { id: "baton-rouge", name: "Baton Rouge", customerCount: 640, tone: "okay", lat: 30.4515, lng: -91.1871 },
  { id: "new-orleans", name: "New Orleans", customerCount: 410, tone: "okay", lat: 29.9511, lng: -90.0715 },
  { id: "beaumont-refinery", name: "Beaumont Refinery", customerCount: 285, tone: "poor", lat: 30.0802, lng: -94.1266 },
];

export const marketingMapCenter = { lat: 30.05, lng: -92.7 };

export const EVERYWHERE_ELSE_COUNT = 3446;
export const TOTAL_AUDIENCE_COUNT =
  marketingAreas.reduce((sum, area) => sum + area.customerCount, 0) + EVERYWHERE_ELSE_COUNT;

export interface PlainWordsInsight {
  id: string;
  tone: "good" | "warning";
  text: string;
}

export const dashboardInsights: PlainWordsInsight[] = [
  {
    id: "dash-insight-1",
    tone: "good",
    text: "Your 'HazMat Certified Drivers' email did great in Houston Metro and Zone A.",
  },
  {
    id: "dash-insight-2",
    tone: "warning",
    text: "Your 'Weekend Express Promo' was mostly ignored in Zone C. Maybe skip that area next time.",
  },
];

export interface RecentActivityEntry {
  id: string;
  tone: "success" | "scheduled";
  title: string;
  description: string;
  timestamp: string;
}

export const recentActivity: RecentActivityEntry[] = [
  {
    id: "activity-1",
    tone: "success",
    title: "Newsletter sent",
    description: '"Q4 Carrier Newsletter" was successfully dispatched to 4,200 recipients.',
    timestamp: "2 hours ago",
  },
  {
    id: "activity-2",
    tone: "scheduled",
    title: "Campaign scheduled",
    description: '"New Route Announcement" scheduled for dispatch on Oct 28.',
    timestamp: "5 hours ago",
  },
];

// TODO: replace with a real GET /marketing/dashboard-stats summary once the
// Marketing API exists — every field below is a flavor number, not derived.
export const dashboardStats = {
  peopleOnList: TOTAL_AUDIENCE_COUNT,
  emailsSentThisMonth: 12,
  openRate: 34,
  openRateDelta: "+3% from last month",
  clickRate: 7,
};

export interface RecentEmailWidgetEntry {
  id: string;
  subject: string;
  meta: string;
  tone: PerformanceTone;
}

// Links into EmailResultsPage via `id` — "HazMat Certified Drivers Alert"
// matches the hand-authored result in emailResults.ts, the other four fall
// back to the generic result.
export const recentEmailsWidget: RecentEmailWidgetEntry[] = [
  { id: "email-hazmat-drivers", subject: "HazMat Certified Drivers Alert", meta: "Sent Oct 20 · 8,241 people", tone: "good" },
  { id: "email-filler-1", subject: "Q3 Industrial Fleet Expansion", meta: "Sent Oct 18 · 10,340 people", tone: "good" },
  { id: "email-filler-2", subject: "Gulf Coast Demurrage Updates", meta: "Sent Oct 15", tone: "okay" },
  { id: "email-filler-3", subject: "Weekend Express Promo", meta: "Sent Oct 10 · 6,890 people", tone: "poor" },
  { id: "email-filler-4", subject: "Winter Weather Pre-Dispatch Notice", meta: "Sent Sept 28 · 2,150 people", tone: "okay" },
];
