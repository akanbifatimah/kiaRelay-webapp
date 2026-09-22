export type TemplateType = "email" | "newsletter";

export interface Template {
  id: string;
  type: TemplateType;
  name: string;
  description: string;
  updatedLabel: string;
  headline: string;
  message: string;
}

// Hand-authored, matching the Templates Library screenshot's names and
// descriptions exactly. headline/message are an inferred first pass — no
// screenshot showed a template's actual body content, only its thumbnail
// card — so this content follows each template's own stated purpose.
export const templates: Template[] = [
  {
    id: "template-q3-logistics-update",
    type: "email",
    name: "Q3 Logistics Update",
    description: "Standard format for quarterly stakeholder updates.",
    updatedLabel: "2 days ago",
    headline: "Q3 Logistics Update",
    message:
      "Hello {{first_name}},\n\nHere's a summary of this quarter's logistics performance across the network, along with what's changing next quarter.\n\nKey Highlights:\nOn-time delivery rate improved quarter over quarter.\nNew routing protocols reduced average idle time.\nFleet utilization remained above target across all regions.",
  },
  {
    id: "template-monthly-fleet-dispatch",
    type: "newsletter",
    name: "Monthly Fleet Dispatch",
    description: "Comprehensive template for monthly driver performance and safety metrics.",
    updatedLabel: "1 week ago",
    headline: "Monthly Fleet Dispatch Report",
    message:
      "Hello {{first_name}},\n\nHere is this month's fleet performance and safety summary, covering on-time delivery, driver ratings, and incident-free miles across every active route.",
  },
  {
    id: "template-urgent-route-advisory",
    type: "email",
    name: "Urgent Route Advisory",
    description: "High-priority template for immediate weather or traffic-related reroutes.",
    updatedLabel: "2 weeks ago",
    headline: "Urgent Route Advisory",
    message:
      "Hello {{first_name}},\n\nDue to current weather and traffic conditions, several routes require immediate rerouting. Please review the updated dispatch instructions before your next departure.",
  },
];
