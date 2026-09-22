import type { Template, TemplateType } from "./templates";

export interface CreateTemplateFormValues {
  templateName: string;
  templateType: TemplateType;
  defaultSubject: string;
  contentHeadline: string;
  contentSubtitle: string;
  message: string;
}

// Prefilled to match the Create Template screenshot exactly.
export const createTemplateDefaultValues: CreateTemplateFormValues = {
  templateName: "",
  templateType: "email",
  defaultSubject: "",
  contentHeadline: "Monthly Performance Report",
  contentSubtitle: "August 2024",
  message:
    "Hello {{DriverName}},\n\nHere is your summary of operations and key metrics for the past month. Your dedication ensures our supply chain remains resilient.\n\nKey Highlights:\nTotal Miles Driven: {{TotalMiles}}\nOn-Time Delivery Rate: {{OTDRate}}%",
};

// Feeds "Edit template" — a real existing template has no separate
// subject/subtitle fields of its own, so those start blank for the editor
// to fill in.
export function buildFormValuesFromTemplate(template: Template): CreateTemplateFormValues {
  return {
    templateName: template.name,
    templateType: template.type,
    defaultSubject: "",
    contentHeadline: template.headline,
    contentSubtitle: "",
    message: template.message,
  };
}
