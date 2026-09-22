import type { Template } from "./templates";

export type NewsletterAudienceType = "all" | "company" | "individual" | "custom";

export interface CreateNewsletterFormValues {
  newsletterName: string;
  subject: string;
  previewText: string;
  senderName: string;
  audienceType: NewsletterAudienceType;
  headline: string;
  message: string;
  /** An object URL from a real, locally-picked file (URL.createObjectURL) —
   * valid for this browser tab's lifetime, same trade-off as every other
   * client-only mock in this app with no upload endpoint to persist to. */
  headerImageUrl: string | null;
}

// TODO: replace with a real GET /marketing/audience-estimate?type=... call —
// flavor numbers per audience segment, not derived from a real customer count.
export const audienceEstimates: Record<NewsletterAudienceType, number> = {
  all: 2450,
  company: 640,
  individual: 1810,
  custom: 0,
};

// Prefilled to match the Create Newsletter screenshot exactly.
export const createNewsletterDefaultValues: CreateNewsletterFormValues = {
  newsletterName: "",
  subject: "Q3 Logistics Optimization Report",
  previewText: "Discover new routing efficiencies...",
  senderName: "KiaRelay Updates",
  audienceType: "all",
  headline: "Q3 Logistics Optimization",
  message:
    "Hello {{first_name}},\n\nWe've identified key areas in the North American corridor where routing efficiency can be improved by up to 14% this quarter.",
  headerImageUrl: null,
};

// Feeds "Use" from the Templates library — applies the template's own
// headline/message onto the standard defaults rather than starting blank.
export function buildNewsletterDefaultValuesFromTemplate(template: Template): CreateNewsletterFormValues {
  return { ...createNewsletterDefaultValues, headline: template.headline, message: template.message };
}
