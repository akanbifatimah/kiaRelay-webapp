import type { PerformanceTone } from "./data";
import { marketingEmails } from "./emails";

export interface EmailAreaResult {
  id: string;
  name: string;
  openedPct: number;
  clickedPct: number;
  clicks: number;
  tone: PerformanceTone;
}

export interface TopClickedLink {
  label: string;
  clicks: number;
  pct: number;
}

// The "what people saw" ad-style mock — a mobile push/in-app card, distinct
// from the full HTML email rendered on EmailPreviewPage.
export interface EmailAdPreview {
  tagLabel: string;
  headline: string;
  description: string;
  ctaLabel: string;
  secondaryLabel: string;
  footer: string;
}

export interface EmailResult {
  id: string;
  subject: string;
  sentLabel: string; // "Sent May 12 · 8,241 people · Newsletter"
  sentTo: number;
  arrived: number;
  opened: number;
  clicked: number;
  unsubscribed: number;
  bookedDelivery: number;
  areas: EmailAreaResult[];
  insights: { tone: "good" | "warning"; text: string }[];
  topLinks: TopClickedLink[];
  preview: EmailAdPreview;
}

// Hand-authored, matching the Email Results screenshot exactly — every other
// sent email falls back to buildGenericEmailResult below.
const hazmatResult: EmailResult = {
  id: "email-hazmat-drivers",
  subject: "HazMat Certified Drivers Alert",
  sentLabel: "Sent May 12 · 8,241 people · Newsletter",
  sentTo: 8241,
  arrived: 4050,
  opened: 3402,
  clicked: 612,
  unsubscribed: 19,
  bookedDelivery: 38,
  areas: [
    { id: "houston-metro", name: "Houston Metro", openedPct: 58, clickedPct: 11, clicks: 342, tone: "good" },
    { id: "zone-a", name: "Zone A", openedPct: 41, clickedPct: 9, clicks: 146, tone: "good" },
    { id: "baton-rouge", name: "Baton Rouge", openedPct: 37, clickedPct: 4, clicks: 62, tone: "okay" },
    { id: "new-orleans", name: "New Orleans", openedPct: 26, clickedPct: 3, clicks: 44, tone: "okay" },
    { id: "beaumont-refinery", name: "Beaumont", openedPct: 15, clickedPct: 1, clicks: 11, tone: "poor" },
  ],
  insights: [
    { tone: "good", text: "This email worked really well in Houston Metro and Zone A. Send more like this." },
    {
      tone: "warning",
      text: "People in Beaumont and Zone C mostly ignored it. Next time, either skip those areas or try a different subject line.",
    },
  ],
  topLinks: [
    { label: "Book a delivery", clicks: 360, pct: 58.8 },
    { label: "View pricing & specs", clicks: 120, pct: 19.6 },
    { label: "TWIC & HazMat verification records", clicks: 62, pct: 10.1 },
    { label: "Gulf Coast corridor schedules", clicks: 45, pct: 7.3 },
    { label: "Contact dispatch coordinator", clicks: 15, pct: 2.4 },
  ],
  preview: {
    tagLabel: "HAZMAT CERTIFIED",
    headline: "HazMat certified drivers ready 24/7 across Texas & Louisiana",
    description:
      "Need certified HazMat or TWIC drivers for chemical or pipeline logistics? Our vetted fleet is on-demand with zero dispatch latency.",
    ctaLabel: "Book a delivery",
    secondaryLabel: "View pricing & specs",
    footer: "FMCSA Regulated · Port Clearance Certified · KiaRelay Inc.",
  },
};

// TODO: replace with a real GET /marketing/emails/:id/results endpoint —
// this generic fallback derives a plausible funnel from the email's own
// list-page numbers so every "sent" row has somewhere to land.
function buildGenericEmailResult(id: string): EmailResult {
  const email = marketingEmails.find((e) => e.id === id);
  const sentTo = 6000 + (id.length % 7) * 500;
  const opened = Math.round(sentTo * ((email?.openedPct ?? 45) / 100));
  const clicked = Math.round(opened * ((email?.clickedPct ?? 10) / 100));

  return {
    id,
    subject: email?.subject ?? "Email",
    sentLabel: `${email?.sentAt ?? "Recently"} · ${sentTo.toLocaleString()} people · ${email?.context ?? "Email"}`,
    sentTo,
    arrived: Math.round(sentTo * 0.92),
    opened,
    clicked,
    unsubscribed: Math.round(sentTo * 0.002),
    bookedDelivery: Math.round(clicked * 0.06),
    areas: [
      { id: "houston-metro", name: "Houston Metro", openedPct: 48, clickedPct: 8, clicks: Math.round(clicked * 0.4), tone: "good" },
      { id: "zone-a", name: "Zone A", openedPct: 35, clickedPct: 6, clicks: Math.round(clicked * 0.25), tone: "okay" },
      { id: "baton-rouge", name: "Baton Rouge", openedPct: 22, clickedPct: 3, clicks: Math.round(clicked * 0.2), tone: "okay" },
      { id: "beaumont-refinery", name: "Beaumont", openedPct: 10, clickedPct: 1, clicks: Math.round(clicked * 0.15), tone: "poor" },
    ],
    insights: [{ tone: "good", text: "Houston Metro and Zone A responded best to this send." }],
    topLinks: [
      { label: "Book a delivery", clicks: Math.round(clicked * 0.5), pct: 50 },
      { label: "View pricing & specs", clicks: Math.round(clicked * 0.3), pct: 30 },
      { label: "Contact dispatch coordinator", clicks: Math.round(clicked * 0.2), pct: 20 },
    ],
    preview: {
      tagLabel: (email?.context ?? "Update").toUpperCase(),
      headline: email?.subject ?? "Email update",
      description: `A quick update for ${email?.recipient ?? "your recipients"} — tap through for the full details.`,
      ctaLabel: "Book a delivery",
      secondaryLabel: "View details",
      footer: "FMCSA Regulated · Port Clearance Certified · KiaRelay Inc.",
    },
  };
}

export function getEmailResult(id: string): EmailResult {
  if (id === hazmatResult.id) return hazmatResult;
  return buildGenericEmailResult(id);
}
