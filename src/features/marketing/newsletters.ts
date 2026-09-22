export type NewsletterStatus = "sent" | "scheduled" | "sending" | "draft" | "paused";

export interface Newsletter {
  id: string;
  name: string;
  category: string; // e.g. "Internal & Partners" — shown as a subtitle under the name
  audience: string;
  status: NewsletterStatus;
  scheduledDate: string | null;
  sentDate: string | null;
  openRate: number | null;
  clickRate: number | null;
}

// The five hand-authored rows matching the Newsletters screenshot exactly —
// one per status, so every badge/column state has a real example.
const handAuthoredNewsletters: Newsletter[] = [
  {
    id: "newsletter-q3-logistics-update",
    name: "Q3 Logistics Update",
    category: "Internal & Partners",
    audience: "All Active Drivers",
    status: "sent",
    scheduledDate: null,
    sentDate: "Oct 1, 2023 09:00 AM",
    openRate: 42.8,
    clickRate: 12.4,
  },
  {
    id: "newsletter-holiday-schedule-announcement",
    name: "Holiday Schedule Announcement",
    category: "Operational Changes",
    audience: "Warehouse Staff",
    status: "scheduled",
    scheduledDate: "Nov 15, 2023 08:00 AM",
    sentDate: null,
    openRate: null,
    clickRate: null,
  },
  {
    id: "newsletter-urgent-weather-advisory",
    name: "Urgent Weather Advisory",
    category: "Safety Notice",
    audience: "Midwest Route Drivers",
    status: "sending",
    scheduledDate: null,
    sentDate: null,
    openRate: null,
    clickRate: null,
  },
  {
    id: "newsletter-new-fleet-vehicle-integration",
    name: "New Fleet Vehicle Integration",
    category: "Equipment Update",
    audience: "Unassigned",
    status: "draft",
    scheduledDate: null,
    sentDate: null,
    openRate: null,
    clickRate: null,
  },
  {
    id: "newsletter-regional-compliance-training",
    name: "Regional Compliance Training",
    category: "Required Action",
    audience: "East Coast Division",
    status: "paused",
    scheduledDate: null,
    sentDate: null,
    openRate: null,
    clickRate: null,
  },
];

const categoryPool = ["Operational Changes", "Safety Notice", "Equipment Update", "Internal & Partners", "Required Action"];
const audiencePool = ["All Active Drivers", "Warehouse Staff", "Midwest Route Drivers", "East Coast Division", "West Coast Division"];
const statusPool: NewsletterStatus[] = ["sent", "sent", "draft", "scheduled", "sent", "paused"];

// TODO: replace with a real GET /marketing/newsletters list — filler rows
// are client-side flavor data only, generated deterministically.
function buildFillerNewsletters(count: number): Newsletter[] {
  return Array.from({ length: count }, (_, i) => {
    const status = statusPool[i % statusPool.length];
    const isSent = status === "sent";
    return {
      id: `newsletter-filler-${i}`,
      name: `${categoryPool[i % categoryPool.length]} Digest #${100 + i}`,
      category: categoryPool[i % categoryPool.length],
      audience: audiencePool[i % audiencePool.length],
      status,
      scheduledDate: status === "scheduled" ? `Nov ${(i % 27) + 1}, 2023 08:00 AM` : null,
      sentDate: isSent ? `Sept ${(i % 27) + 1}, 2023 09:00 AM` : null,
      openRate: isSent ? Number((35 + ((i * 7) % 50)).toFixed(1)) : null,
      clickRate: isSent ? Number((5 + ((i * 3) % 20)).toFixed(1)) : null,
    };
  });
}

export const newsletters: Newsletter[] = [...handAuthoredNewsletters, ...buildFillerNewsletters(19)];
