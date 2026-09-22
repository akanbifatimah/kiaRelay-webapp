import type { MarketingEmailStatus, PerformanceTone } from "./data";

export interface MarketingEmail {
  id: string;
  subject: string;
  context: string; // e.g. "Campaign: Q3 General Newsletter", "Transactional"
  recipient: string;
  status: MarketingEmailStatus;
  sentAt: string | null;
  openedPct: number | null;
  clickedPct: number | null;
}

// The six hand-authored rows matching the Email Management screenshot
// exactly, one per status this table needs to demonstrate.
const handAuthoredEmails: MarketingEmail[] = [
  {
    id: "email-q3-logistics-update",
    subject: "Q3 Logistics Update & Route Changes",
    context: "Campaign: Q3 General Newsletter",
    recipient: "All Active Drivers",
    status: "sent",
    sentAt: "Oct 24, 09:00 AM",
    openedPct: 84.2,
    clickedPct: 12.5,
  },
  {
    id: "email-holiday-schedule-reminder",
    subject: "Holiday Schedule Reminder",
    context: "Standalone Alert",
    recipient: "Warehouse Staff - East Coast",
    status: "draft",
    sentAt: null,
    openedPct: null,
    clickedPct: null,
  },
  {
    id: "email-new-safety-protocols",
    subject: "New Safety Protocols Training",
    context: "Campaign: Annual Compliance",
    recipient: "Fleet Operators",
    status: "scheduled",
    sentAt: "Nov 01, 08:00 AM",
    openedPct: null,
    clickedPct: null,
  },
  {
    id: "email-weather-advisory-route-95",
    subject: "Urgent: Weather Advisory Route 95",
    context: "Automated Alert",
    recipient: "Affected Segment (Dynamic)",
    status: "sending",
    sentAt: "Today, 10:45 AM",
    openedPct: null,
    clickedPct: null,
  },
  {
    id: "email-vendor-remittance-notice",
    subject: "Vendor Remittance Notice #4492",
    context: "Transactional",
    recipient: "External Vendors List A",
    status: "failed",
    sentAt: "Oct 20, 02:30 PM",
    openedPct: null,
    clickedPct: null,
  },
  {
    id: "email-monthly-performance-report",
    subject: "Monthly Performance Report - September",
    context: "Internal Comms",
    recipient: "Management Tier 1 & 2",
    status: "sent",
    sentAt: "Oct 05, 09:00 AM",
    openedPct: 95.5,
    clickedPct: 45.2,
  },
  {
    id: "email-hazmat-drivers",
    subject: "HazMat Certified Drivers Alert",
    context: "Campaign: Newsletter",
    recipient: "All Active Drivers",
    status: "sent",
    sentAt: "Oct 20, 08:15 AM",
    openedPct: 41.3,
    clickedPct: 7.4,
  },
];

const statusPool: MarketingEmailStatus[] = ["sent", "sent", "sent", "draft", "scheduled", "failed"];
const contextPool = ["Standalone Alert", "Automated Alert", "Transactional", "Internal Comms", "Campaign: Regional Update"];
const recipientPool = ["All Active Drivers", "Fleet Operators", "Warehouse Staff - East Coast", "Management Tier 1 & 2", "Independent Operators"];

// TODO: replace with a real GET /marketing/emails list — filler rows are
// client-side flavor data only, generated deterministically so pagination
// stays stable across renders.
function buildFillerEmails(count: number): MarketingEmail[] {
  return Array.from({ length: count }, (_, i) => {
    const status = statusPool[i % statusPool.length];
    const isSent = status === "sent";
    return {
      id: `email-filler-${i}`,
      subject: `${contextPool[i % contextPool.length]} #${1000 + i}`,
      context: contextPool[i % contextPool.length],
      recipient: recipientPool[i % recipientPool.length],
      status,
      sentAt: status === "draft" ? null : `Oct ${(i % 27) + 1}, ${8 + (i % 4)}:00 AM`,
      openedPct: isSent ? Number((40 + ((i * 7) % 55)).toFixed(1)) : null,
      clickedPct: isSent ? Number((5 + ((i * 3) % 30)).toFixed(1)) : null,
    };
  });
}

export const marketingEmails: MarketingEmail[] = [...handAuthoredEmails, ...buildFillerEmails(136)];

export const performanceToneForEmail = (email: MarketingEmail): PerformanceTone | null => {
  if (email.openedPct == null) return null;
  if (email.openedPct >= 60) return "good";
  if (email.openedPct >= 30) return "okay";
  return "poor";
};
