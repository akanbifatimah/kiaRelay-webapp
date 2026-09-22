import { newsletters } from "./newsletters";

export interface NewsletterPreviewData {
  internalName: string;
  fromName: string;
  fromEmail: string;
  toLabel: string;
  toEmail: string;
  statusLabel: string;
  subject: string;
  preheader: string;
  heroHeadline: string;
  greeting: string;
  intro: string;
  calloutTitle: string;
  calloutText: string;
  subheading: string;
  subheadingText: string;
  ctaLabel: string;
  /** A real uploaded header image (object URL) from the compose flow —
   * falls back to the default hero art when the draft didn't set one. */
  heroImageUrl: string | null;
}

// Hand-authored, matching the newsletter Preview screenshot exactly — its
// content (a distinct greeting/callout/subheading structure) doesn't fit the
// freeform message-blocks parser EmailRenderedPreview uses, so it's fully
// structured here instead.
const q3LogisticsPreview: NewsletterPreviewData = {
  internalName: "Q3 Logistics Update",
  fromName: "KiaRelay Operations",
  fromEmail: "dispatch@kiarelay.com",
  toLabel: "All Active Drivers",
  toEmail: "segment-list-active-drivers@kiarelay.com",
  statusLabel: "Draft",
  subject: "KiaRelay Q3 Update: New Routing Protocols & Efficiency Gains",
  preheader: "Important updates regarding fleet optimization and safety milestones for Q3.",
  heroHeadline: "Q3 Logistics Update & Efficiency Report",
  greeting: "Team,",
  intro:
    "As we close out Q3, we want to highlight the significant milestones we've achieved across the network. Our continued focus on fleet optimization and driver safety has yielded measurable improvements in on-time delivery metrics.",
  calloutTitle: "New Routing Protocols Active",
  calloutText:
    "Beginning next week, the updated algorithmic routing protocols will be pushed to all terminals. This update is projected to reduce idle time by 14% across key inter-state corridors.",
  subheading: "Safety Milestones",
  subheadingText:
    "We are proud to announce that our active driver segment has surpassed 2 million consecutive miles without a critical safety incident. This is a testament to the rigorous adherence to operational standards.",
  ctaLabel: "View Full Q3 Report",
  heroImageUrl: null,
};

type DraftState = Pick<NewsletterPreviewData, "internalName" | "subject" | "heroHeadline" | "intro"> & { heroImageUrl?: string | null };

function isDraftState(state: unknown): state is DraftState {
  return Boolean(state && typeof state === "object" && "intro" in state);
}

// Same one-hand-authored-plus-fallback pattern as previewData.ts.
export function resolveNewsletterPreview(id: string | undefined, state: unknown): NewsletterPreviewData {
  if (isDraftState(state)) {
    return {
      ...q3LogisticsPreview,
      internalName: state.internalName,
      subject: state.subject,
      heroHeadline: state.heroHeadline,
      intro: state.intro,
      statusLabel: "Draft",
      heroImageUrl: state.heroImageUrl ?? null,
    };
  }

  if (id === q3LogisticsPreview.internalName || id === "newsletter-q3-logistics-update") return q3LogisticsPreview;

  const newsletter = newsletters.find((n) => n.id === id);
  return {
    ...q3LogisticsPreview,
    internalName: newsletter?.name ?? "Untitled Newsletter",
    subject: newsletter?.name ?? "Untitled Newsletter",
    toLabel: newsletter?.audience ?? "Selected Audience",
    statusLabel: newsletter?.status === "sent" ? "Sent" : "Draft",
    heroHeadline: newsletter?.name ?? "Untitled Newsletter",
    intro: `A quick update for ${newsletter?.audience ?? "your recipients"} — tap through for the full details.`,
  };
}
