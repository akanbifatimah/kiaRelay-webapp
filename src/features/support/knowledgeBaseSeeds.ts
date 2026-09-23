import type { ArticleAudience, ArticleCategory, ArticleStatus, KnowledgeArticle } from "./knowledgeBase";
import { HAZMAT_SOP_CONTENT } from "./knowledgeBaseHazmat";

type Seed = [title: string, summary: string, category: ArticleCategory, author: string, updatedDaysAgo: number, status: ArticleStatus, audiences: ArticleAudience[], tags: string[]];

// First five rows copied from the Knowledge Base screenshot; the rest give
// every category pill and status filter something to show.
const seeds: Seed[] = [
  ["How to reset your driver app password", "Troubleshooting login issues for external drivers.", "driver-help", "Jane Doe", 1, "published", ["drivers", "support-staff"], ["Login", "Driver App"]],
  ["Understanding Freight Billing Cycles", "Overview of net-30 and net-60 payment terms.", "billing", "Mark Rivera", 3, "published", ["customers", "support-staff"], ["Billing", "Net Terms"]],
  ["Safety Protocol: Hazardous Materials Handling 2024", "Updated guidelines for hazmat transport and reporting.", "safety", "Alex Smith", 5, "draft", ["support-staff", "drivers"], ["HazMat", "Safety"]],
  ["How to Report a Missing Delivery Item", "Customer guide for initiating an OS&D claim.", "deliveries", "Jane Doe", 7, "published", ["customers"], ["Claims", "OS&D"]],
  ["Q3 Holiday Surcharge Policy", "Internal documentation on temporary rate increases.", "policies", "Mark Rivera", 10, "in-review", ["support-staff"], ["Pricing", "Surcharge"]],
  ["Tracking a Shipment in Real Time", "Using the customer portal's live map and ETA alerts.", "customer-help", "Jane Doe", 12, "published", ["customers"], ["Tracking"]],
  ["Updating Your Company's Billing Contact", "Where to change invoice recipients and tax details.", "customer-help", "Mark Rivera", 14, "published", ["customers"], ["Billing", "Account"]],
  ["Submitting Proof of Delivery Photos", "Required angles and lighting for accepted POD photos.", "driver-help", "Alex Smith", 16, "published", ["drivers"], ["POD", "Photos"]],
  ["Requesting a Route Detour", "How drivers request alternate routing from dispatch.", "driver-help", "Jane Doe", 18, "published", ["drivers", "support-staff"], ["Routing", "Dispatch"]],
  ["Handling Delayed Delivery Escalations", "SLA thresholds and when to escalate to Tier 2.", "deliveries", "Alex Mercer", 20, "published", ["support-staff"], ["SLA", "Escalation"]],
  ["Temperature-Controlled Load Checklist", "Pre-trip checks for healthcare and cold-chain loads.", "safety", "Alex Smith", 23, "published", ["drivers", "support-staff"], ["Cold Chain", "Healthcare"]],
  ["Disputing an Invoice Line Item", "Steps for customers contesting a charge.", "billing", "Mark Rivera", 26, "published", ["customers", "support-staff"], ["Billing", "Disputes"]],
  ["Driver Payout Schedule Explained", "Weekly vs. on-demand payout timing and fees.", "billing", "Mark Rivera", 30, "published", ["drivers"], ["Payouts"]],
  ["Customer Data Retention Policy", "How long order and PII data is kept, and why.", "policies", "Alex Mercer", 34, "published", ["support-staff"], ["Privacy", "Compliance"]],
  ["Hours-of-Service Rules for Owner-Operators", "FMCSA HOS limits and ELD requirements summarized.", "policies", "Alex Smith", 38, "in-review", ["drivers", "support-staff"], ["HOS", "FMCSA"]],
  ["Scheduling a Recurring Pickup", "Setting up weekly or daily pickups for a branch.", "customer-help", "Jane Doe", 45, "published", ["customers"], ["Pickups"]],
  ["What to Do After a Minor Collision", "Immediate steps, photos to capture, and who to call.", "safety", "Alex Smith", 52, "published", ["drivers"], ["Incidents", "Safety"]],
  ["Cancelling an Order Before Dispatch", "Refund rules and cut-off times for cancellations.", "deliveries", "Jane Doe", 60, "draft", ["customers", "support-staff"], ["Cancellation", "Refunds"]],
];

function bodyFor(title: string, summary: string): string {
  return `${summary}\n\n## Overview\n\nThis article explains **${title.toLowerCase()}** for KiaRelay teams and partners.\n\n## Steps\n\n1. Review the requirements below.\n2. Follow the process in the order listed.\n3. Contact Support if anything doesn't match what you see.\n\n## Need more help?\n\n- Open a ticket from the Support portal.\n- Call the 24/7 operations line for urgent issues.`;
}

// TODO: GET /support/knowledge-base — see knowledgeBase.ts.
export const seedArticles: KnowledgeArticle[] = [
  {
    id: "KB-1001",
    title: "Standard Operating Procedure: Hazardous Materials Handling",
    summary: "Protocols for handling, storing and transporting HazMat freight across KiaRelay hubs.",
    category: "safety",
    author: "Alex Mercer",
    authorRole: "Logistics Analyst",
    updatedDaysAgo: 0,
    status: "draft",
    audiences: ["support-staff"],
    tags: ["HazMat", "SOP", "Routing"],
    content: HAZMAT_SOP_CONTENT,
    helpfulYes: 48,
    helpfulNo: 2,
    views: 1200,
  },
  ...seeds.map(([title, summary, category, author, updatedDaysAgo, status, audiences, tags], i): KnowledgeArticle => ({
    id: `KB-${1002 + i}`,
    title,
    summary,
    category,
    author,
    authorRole: "Support Specialist",
    updatedDaysAgo,
    status,
    audiences,
    tags,
    content: bodyFor(title, summary),
    helpfulYes: status === "published" ? 20 + ((i * 17) % 80) : 0,
    helpfulNo: status === "published" ? 1 + ((i * 7) % 9) : 0,
    views: status === "published" ? 150 + ((i * 97) % 2400) : 0,
  })),
];
