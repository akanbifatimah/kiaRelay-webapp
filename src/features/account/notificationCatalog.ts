import type { ModuleKey } from "../access/modules";
import { effectiveModules, isSuperAdmin } from "../access/permissions";
import type { TeamMember } from "../access/teamMembers";

export interface NotificationType {
  id: string;
  group: string;
  title: string;
  description: string;
  /** Shown only to admins with this module; omitted = everyone. */
  module?: ModuleKey;
  superAdminOnly?: boolean;
  /** Security alerts can't be turned off by email. */
  lockedEmail?: boolean;
  defaults: { email: boolean; inApp: boolean };
}

// Every alert the platform can send an admin (2026-09-24). My Account only
// lists the ones relevant to the signed-in admin's modules, which is what
// makes this page genuinely different per user type.
// TODO: the backend's notification service should read these preferences.
export const NOTIFICATION_TYPES: NotificationType[] = [
  { id: "security-signin", group: "Account & Security", title: "New sign-in to your account", description: "A sign-in from a new device or location.", lockedEmail: true, defaults: { email: true, inApp: true } },
  { id: "team-changes", group: "Account & Security", title: "Team member added or deactivated", description: "Changes to who can access the admin platform.", superAdminOnly: true, defaults: { email: true, inApp: true } },
  { id: "dispatch-unassigned", group: "Operations", title: "Order unassigned for 15+ minutes", description: "Loads waiting in the dispatch queue too long.", module: "dispatch", defaults: { email: false, inApp: true } },
  { id: "orders-cancelled", group: "Operations", title: "Order cancelled by customer", description: "Cancellations after a driver was assigned.", module: "orders", defaults: { email: false, inApp: true } },
  { id: "drivers-docs", group: "Operations", title: "Driver document expiring", description: "License, insurance or TWIC expiring within 30 days.", module: "drivers", defaults: { email: true, inApp: true } },
  { id: "customers-verification", group: "Operations", title: "Company awaiting verification", description: "New business accounts pending document review.", module: "customers", defaults: { email: true, inApp: true } },
  { id: "support-assigned", group: "Claims & Support", title: "Ticket assigned to me", description: "A ticket or claim is routed to you.", module: "support", defaults: { email: true, inApp: true } },
  { id: "support-sla", group: "Claims & Support", title: "SLA breach risk on my tickets", description: "Tickets within 30 minutes of breaching SLA.", module: "support", defaults: { email: true, inApp: true } },
  { id: "finance-payouts", group: "Finance", title: "Payout batch awaiting approval", description: "ACH batches that need sign-off before submission.", module: "finance", defaults: { email: true, inApp: true } },
  { id: "finance-overdue", group: "Finance", title: "Invoice overdue", description: "Company invoices past their payment terms.", module: "finance", defaults: { email: true, inApp: false } },
  { id: "marketing-sent", group: "Marketing", title: "Campaign finished sending", description: "Delivery summary once an email or newsletter completes.", module: "marketing", defaults: { email: false, inApp: true } },
  { id: "marketing-unsubscribes", group: "Marketing", title: "Unsubscribe spike", description: "More than 1% of a send's recipients unsubscribed.", module: "marketing", defaults: { email: true, inApp: true } },
  { id: "reports-digest", group: "Reports", title: "Weekly performance digest", description: "Revenue, on-time and claims summary every Monday.", module: "reports", defaults: { email: true, inApp: false } },
];

export function notificationsFor(member: TeamMember): NotificationType[] {
  const modules = effectiveModules(member);
  return NOTIFICATION_TYPES.filter((type) => (!type.superAdminOnly || isSuperAdmin(member)) && (!type.module || modules.includes(type.module)));
}

export type NotificationPrefs = Record<string, { email: boolean; inApp: boolean }>;

export function defaultPrefs(): NotificationPrefs {
  return Object.fromEntries(NOTIFICATION_TYPES.map((type) => [type.id, type.defaults]));
}
