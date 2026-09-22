export type CampaignStatus = "sent" | "scheduled" | "draft";

export interface Campaign {
  id: string;
  name: string;
  type: string; // "Email" | "Newsletter"
  audience: string;
  openRate: number | null;
  clickRate: number | null;
  status: CampaignStatus;
  sentLabel: string; // "Sent Oct 20, 2025" / "Scheduled for Oct 28" / "Draft"
}

// Hand-authored, matching the Marketing Overview (Campaigns) screenshot's
// Recent Campaigns table exactly.
export const campaigns: Campaign[] = [
  {
    id: "campaign-holiday-logistics-promo",
    name: "Holiday Logistics Promo",
    type: "Email",
    audience: "All Carriers",
    openRate: 72,
    clickRate: 28,
    status: "sent",
    sentLabel: "Sent Oct 20, 2025",
  },
  {
    id: "campaign-q4-carrier-newsletter",
    name: "Q4 Carrier Newsletter",
    type: "Newsletter",
    audience: "Active Drivers",
    openRate: 65,
    clickRate: 19,
    status: "sent",
    sentLabel: "Sent Oct 15, 2025",
  },
  {
    id: "campaign-new-route-announcement",
    name: "New Route Announcement",
    type: "Email",
    audience: "Midwest Region",
    openRate: null,
    clickRate: null,
    status: "scheduled",
    sentLabel: "Scheduled for Oct 28",
  },
  {
    id: "campaign-platform-maintenance-update",
    name: "Platform Maintenance Update",
    type: "Email",
    audience: "System Admins",
    openRate: null,
    clickRate: null,
    status: "draft",
    sentLabel: "Draft",
  },
];

// TODO: replace with a real GET /marketing/campaign-stats summary once the
// Marketing API exists — flavor numbers, not derived from `campaigns` above.
export const campaignStats = {
  emailsSent: 12480,
  emailsSentDelta: "+12%",
  openRate: 68.4,
  openRateDelta: "+5.2%",
  clickRate: 24.7,
  clickRateDelta: "-4%",
  activeCampaigns: 4,
};
