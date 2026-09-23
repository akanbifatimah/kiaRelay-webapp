export type TicketPriority = "critical" | "high" | "medium" | "low";

export type TicketCategory =
  | "compliance"
  | "technical"
  | "billing"
  | "finance"
  | "support"
  | "marketing"
  | "account"
  | "delivery"
  | "claims"
  | "infrastructure"
  | "access"
  | "routing"
  | "maintenance";

/** Matches the SLA Status column's labels on Unassigned Tickets exactly. */
export type SlaStatus = "breached" | "at-risk" | "healthy" | "pending" | "resolved" | "open";

/** The four tabs on My Open Tickets. */
export type TicketStatus = "open" | "awaiting-customer" | "awaiting-internal" | "resolved";

/** Team Monitoring's Status column ("Online"/"High Load"/"Away"), plus the
 * Manual Assignment list's "Offline" (greyed out, not selectable). */
export type AgentAvailability = "online" | "high-load" | "away" | "offline";

export interface SupportAgent {
  id: string;
  name: string;
  role: string;
  team: string;
  avatar?: string;
  availability: AgentAvailability;
  openTickets: number;
  slaAtRisk: number;
  breached: number;
  resolvedToday: number;
}

export interface TicketRequester {
  kind: "driver" | "customer";
  id: string;
  /** Driver/customer-facing summary, e.g. "Driver reported road closure ahead…". */
  summary?: string;
  /** Who's handling it on the requester's side, e.g. "Dispatch: Sarah J." */
  handler?: string;
}

export interface SupportTicket {
  /** Stored without the leading "#" so it's URL-safe — tables add it back. */
  id: string;
  subject: string;
  customer: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  sla: SlaStatus;
  /** Negative once breached (e.g. -60 renders "-1h"). */
  slaMinutesLeft: number;
  createdMinutesAgo: number;
  lastActivityMinutesAgo: number;
  assigneeId?: string;
  /** Set when the ticket was raised by a real driver/customer record — powers
   * the Driver/Customer Support Views and their "View All" ticket lists. */
  requester?: TicketRequester;
  /** Set only on claims-category tickets — routes to the claim investigation
   * screen instead of the conversation workspace. */
  claimId?: string;
}

export const categoryLabels: Record<TicketCategory, string> = {
  compliance: "Compliance",
  technical: "Technical",
  billing: "Billing",
  finance: "Finance",
  support: "Support",
  marketing: "Marketing",
  account: "Account",
  delivery: "Delivery Issue",
  claims: "Claims",
  infrastructure: "Infrastructure",
  access: "Access",
  routing: "Routing",
  maintenance: "Maintenance",
};

export const priorityLabels: Record<TicketPriority, string> = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
};

export const slaLabels: Record<SlaStatus, string> = {
  breached: "Breached",
  "at-risk": "At Risk",
  healthy: "Healthy",
  pending: "Pending",
  resolved: "Resolved",
  open: "Open",
};

export const statusLabels: Record<TicketStatus, string> = {
  open: "Open",
  "awaiting-customer": "Awaiting Customer",
  "awaiting-internal": "Awaiting Internal",
  resolved: "Resolved",
};

export type ReassignReason = "workload-balancing" | "specialist-required" | "shift-change" | "other";

export const reassignReasonLabels: Record<ReassignReason, string> = {
  "workload-balancing": "Workload Balancing",
  "specialist-required": "Specialist Required",
  "shift-change": "Shift Change",
  other: "Other",
};
