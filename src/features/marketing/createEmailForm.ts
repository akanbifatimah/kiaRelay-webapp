import { marketingAreas, EVERYWHERE_ELSE_COUNT, TOTAL_AUDIENCE_COUNT } from "./data";
import type { Template } from "./templates";

export type EmailTemplate = "simple-letter" | "big-announcement" | "special-offer";
export type RecipientType = "everyone" | "individuals" | "businesses" | "drivers";

export interface CreateEmailFormValues {
  internalName: string;
  subject: string;
  template: EmailTemplate;
  message: string;
  actionLabel: string;
  actionUrl: string;
  recipientType: RecipientType;
  sendToAllAreas: boolean;
  selectedAreaIds: string[];
  sendCondition: string;
  sendTiming: "now" | "scheduled";
  scheduledAt: string;
}

const areaCountById = new Map([
  ...marketingAreas.map((area): [string, number] => [area.id, area.customerCount]),
  ["everywhere-else", EVERYWHERE_ELSE_COUNT],
]);

export function computeRecipientCount(sendToAllAreas: boolean, selectedAreaIds: string[]): number {
  if (sendToAllAreas) return TOTAL_AUDIENCE_COUNT;
  return selectedAreaIds.reduce((sum, id) => sum + (areaCountById.get(id) ?? 0), 0);
}

// Prefilled to match the Create an Email screenshot exactly.
export const createEmailDefaultValues: CreateEmailFormValues = {
  internalName: "May Weekend Delivery Update",
  subject: "Reliable freight dispatch across Texas this weekend",
  template: "simple-letter",
  message:
    "Hi there,\n\nWe've expanded our weekend dispatch fleet across the Houston Metro and Gulf Coast industrial corridors. Whether you have scheduled pipeline transfers or last-minute commercial freight, our TWIC and HazMat-certified drivers are ready 24/7.\n\nTap below to book an on-demand driver in under 3 minutes.",
  actionLabel: "Book a delivery",
  actionUrl: "https://app.kiarelay.com/book",
  recipientType: "everyone",
  sendToAllAreas: true,
  selectedAreaIds: [],
  sendCondition: "everyone-active",
  sendTiming: "now",
  scheduledAt: "",
};

// Feeds "Use" from the Templates library — applies the template's own
// headline/message onto the standard defaults rather than starting blank.
export function buildEmailDefaultValuesFromTemplate(template: Template): CreateEmailFormValues {
  return { ...createEmailDefaultValues, internalName: template.name, subject: template.headline, message: template.message };
}
