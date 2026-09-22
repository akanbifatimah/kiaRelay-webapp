import { marketingEmails } from "./emails";

export interface PreviewData {
  internalName: string;
  fromName: string;
  fromEmail: string;
  toLabel: string;
  toEmail: string;
  sentLabel: string;
  subject: string;
  headline: string;
  message: string;
  actionLabel: string;
  actionUrl: string;
}

// Partial shape CreateEmailPage's in-progress draft hands over via router
// state — it only collects subject/message/action fields, not a separate
// envelope (from/to) or in-body headline, so resolvePreview below fills
// those in with sensible defaults for that path.
export type DraftPreviewState = Pick<PreviewData, "internalName" | "subject" | "message" | "actionLabel" | "actionUrl">;

// Hand-authored, matching the Email Preview screenshot exactly.
const hazmatPreview: PreviewData = {
  internalName: "Q3 Driver Incentive Program",
  fromName: "KiaRelay Operations",
  fromEmail: "dispatch@kiarelay.com",
  toLabel: "Independent Operators",
  toEmail: "segment-list-04@kiarelay.com",
  sentLabel: "Oct 24, 10:30 AM (Draft)",
  subject: "Action Required: New Q3 Route Incentive Program Available Now",
  headline: "Maximize Your Earnings This Quarter",
  message:
    "Hello Driver,\n\nAs we enter Q3, operational demands across the Eastern seaboard are increasing. To maintain our commitment to rapid fulfillment, we are rolling out a new localized incentive program for all active operators.\n\nKey Program Details:\n15% bonus on all completed routes in Zone A.\nPriority loading access at Hub 4 and Hub 7.\nProgram runs from Oct 25 to Nov 15.\n\nPlease review the updated route matrices in your command portal to opt-in to eligible manifests.",
  actionLabel: "View Eligible Routes",
  actionUrl: "https://app.kiarelay.com/routes",
};

function isDraftState(state: unknown): state is DraftPreviewState {
  return Boolean(state && typeof state === "object" && "message" in state);
}

// No screenshot shows a "sent" email's own message body stored anywhere
// (MarketingEmail only tracks subject/recipient/metrics), so any id other
// than the one hand-authored case above falls back to a generic body built
// from its list-row subject — same one-hand-authored-plus-fallback pattern
// used across the rest of this app.
export function resolvePreview(id: string | undefined, state: unknown): PreviewData {
  if (isDraftState(state)) {
    return {
      ...state,
      fromName: "KiaRelay Operations",
      fromEmail: "dispatch@kiarelay.com",
      toLabel: "Selected Recipients",
      toEmail: "recipients@kiarelay.com",
      sentLabel: "Draft",
      headline: state.subject,
    };
  }

  if (id === hazmatPreview.internalName || id === "email-hazmat-drivers") return hazmatPreview;

  const email = marketingEmails.find((e) => e.id === id);
  return {
    internalName: email?.subject ?? "Untitled Email",
    fromName: "KiaRelay Operations",
    fromEmail: "dispatch@kiarelay.com",
    toLabel: email?.recipient ?? "Your Recipients",
    toEmail: "recipients@kiarelay.com",
    sentLabel: email?.sentAt ?? "Draft",
    subject: email?.subject ?? "Untitled Email",
    headline: email?.subject ?? "Untitled Email",
    message: `Hello,\n\nThis is a preview of "${email?.subject ?? "your email"}" for ${email?.recipient ?? "your recipients"}.`,
    actionLabel: "View Details",
    actionUrl: "https://app.kiarelay.com",
  };
}
