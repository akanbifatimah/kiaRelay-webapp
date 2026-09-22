import { newsletters } from "./newsletters";

export interface OpenPerformancePoint {
  hour: string; // "0h", "4h", ... label
  opens: number;
}

export interface ClickDistributionLink {
  label: string;
  clicks: number;
}

export interface NewsletterPerformance {
  id: string;
  name: string;
  sentLabel: string; // "Dispatched on Oct 12, 2023 at 08:30 AM EST to Segment: 'East Coast Fleet Ops'"
  sent: number;
  delivered: number;
  deliveredRate: number;
  opened: number;
  openRate: number;
  clicked: number;
  clickRate: number;
  unsubscribed: number;
  unsubscribeRate: number;
  openPerformance: OpenPerformancePoint[];
  clickDistribution: ClickDistributionLink[];
}

// Hand-authored, matching the Newsletter Performance Detail screenshot
// exactly — every other sent newsletter falls back to the generic builder.
const q3EastCoastPerformance: NewsletterPerformance = {
  id: "newsletter-q3-logistics-update",
  name: "Q3 Logistics Update - East Coast",
  sentLabel: "Dispatched on Oct 12, 2023 at 08:30 AM EST to Segment: 'East Coast Fleet Ops'",
  sent: 12450,
  delivered: 12301,
  deliveredRate: 98.8,
  opened: 8412,
  openRate: 68.4,
  clicked: 3204,
  clickRate: 25.9,
  unsubscribed: 18,
  unsubscribeRate: 0.1,
  openPerformance: [
    { hour: "0h", opens: 620 },
    { hour: "4h", opens: 1480 },
    { hour: "8h", opens: 2150 },
    { hour: "12h", opens: 1720 },
    { hour: "16h", opens: 980 },
    { hour: "20h", opens: 560 },
    { hour: "24h", opens: 340 },
    { hour: "32h", opens: 220 },
    { hour: "40h", opens: 180 },
    { hour: "48h", opens: 162 },
  ],
  clickDistribution: [
    { label: "/text-updates-q3", clicks: 1402 },
    { label: "/safety-guidelines", clicks: 890 },
    { label: "/contact-dispatch", clicks: 654 },
    { label: "Other Links", clicks: 258 },
  ],
};

// TODO: replace with a real GET /marketing/newsletters/:id/performance
// endpoint — this generic fallback derives a plausible funnel from the
// newsletter's own list-page numbers so every "sent" row has somewhere to land.
function buildGenericPerformance(id: string): NewsletterPerformance {
  const newsletter = newsletters.find((n) => n.id === id);
  const sent = 8000 + (id.length % 9) * 400;
  const delivered = Math.round(sent * 0.985);
  const opened = Math.round(delivered * ((newsletter?.openRate ?? 45) / 100));
  const clicked = Math.round(opened * ((newsletter?.clickRate ?? 15) / 100));

  return {
    id,
    name: newsletter?.name ?? "Newsletter",
    sentLabel: `Dispatched ${newsletter?.sentDate ?? "recently"} to '${newsletter?.audience ?? "Selected Audience"}'`,
    sent,
    delivered,
    deliveredRate: 98.5,
    opened,
    openRate: newsletter?.openRate ?? 45,
    clicked,
    clickRate: newsletter?.clickRate ?? 15,
    unsubscribed: Math.round(sent * 0.0015),
    unsubscribeRate: 0.15,
    openPerformance: [620, 1400, 2000, 1600, 900, 520, 300, 210, 170, 150].map((opens, i) => ({
      hour: `${i * 4 === 0 ? 0 : i <= 5 ? i * 4 : 24 + (i - 5) * 8}h`,
      opens: Math.round((opens / 2150) * opened * 0.26),
    })),
    clickDistribution: [
      { label: "/view-details", clicks: Math.round(clicked * 0.45) },
      { label: "/learn-more", clicks: Math.round(clicked * 0.3) },
      { label: "/contact-us", clicks: Math.round(clicked * 0.15) },
      { label: "Other Links", clicks: Math.round(clicked * 0.1) },
    ],
  };
}

export function getNewsletterPerformance(id: string): NewsletterPerformance {
  if (id === q3EastCoastPerformance.id) return q3EastCoastPerformance;
  return buildGenericPerformance(id);
}
