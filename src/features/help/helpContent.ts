import type { ModuleKey } from "../access/modules";

export interface HelpArticle {
  id: string;
  question: string;
  answer: string;
  /** In-app page that does what the answer describes. */
  link?: { to: string; label: string };
}

export interface HelpTopic {
  /** "general" topics show to every admin; the rest need that module. */
  module: ModuleKey | "general";
  title: string;
  articles: HelpArticle[];
}

// Help Center content (TC-04, 2026-09-28, no design). Answers describe the
// screens as built. Topics are filtered to the admin's modules, so each
// admin only sees help for what they can open.
// TODO: move to a CMS or the Support Knowledge Base API once it exists.
export const HELP_TOPICS: HelpTopic[] = [
  {
    module: "general",
    title: "Getting started",
    articles: [
      { id: "g1", question: "Why can't I see some modules in the sidebar?", answer: "You only see the modules a Super Admin granted to your account. Your role and modules are listed at the top of My Account. Ask a Super Admin in User Management to change them.", link: { to: "/account", label: "Open My Account" } },
      { id: "g2", question: "How do I change my password or photo?", answer: "Open My Account from your name in the top bar. Profile holds your name, title and photo, and Password lets you change your sign-in password.", link: { to: "/account", label: "Open My Account" } },
      { id: "g3", question: "How do I control which emails I get?", answer: "My Account → Notifications lists every alert for your modules, with separate email and in-app switches.", link: { to: "/account", label: "Notification settings" } },
      { id: "g4", question: "I received an invite. How do I sign in?", answer: "Sign in with the email and temporary password from your invite, then set your own password in My Account → Password. If the invite expired, ask a Super Admin to resend it." },
    ],
  },
  {
    module: "dispatch",
    title: "Dispatch",
    articles: [
      { id: "d1", question: "How do I assign an order to a driver?", answer: "On Dispatch, pick an order from the queue and choose Assign. Recommended drivers are ranked by distance, on-time rate and vehicle fit.", link: { to: "/dispatch", label: "Open Dispatch" } },
      { id: "d2", question: "How do I move a ride to another driver?", answer: "Open the order in Orders and choose Reassign Driver, or open a driver's profile and use Assign Ride to hand them a ride from another driver.", link: { to: "/orders", label: "Open Orders" } },
    ],
  },
  {
    module: "orders",
    title: "Orders",
    articles: [
      { id: "o1", question: "How do I create an order for a phone customer?", answer: "Orders → New Order. Pick the customer, add pickup and drop-off, then the shipment details.", link: { to: "/orders", label: "Open Orders" } },
      { id: "o2", question: "Can I export the orders list?", answer: "Yes. Filter the list first; Export downloads exactly the filtered rows as CSV." },
    ],
  },
  {
    module: "customers",
    title: "Customers",
    articles: [
      { id: "c1", question: "Where do I review a new KiaRelay Business account?", answer: "KiaRelay Business Accounts lists pending companies. Open the row's ⋯ menu and choose Review Verification.", link: { to: "/customers/company", label: "KiaRelay Business Accounts" } },
      { id: "c2", question: "How do I suspend a customer?", answer: "Open the row's ⋯ menu or the customer profile and choose Suspend Account. Active orders affected by the suspension are listed before you confirm." },
    ],
  },
  {
    module: "drivers",
    title: "Drivers",
    articles: [
      { id: "dr1", question: "How do I approve a driver application?", answer: "Drivers → Onboarding Queue. Open Review Documents on a pending row, tick every checklist item, then Approve Identity.", link: { to: "/drivers", label: "Open Drivers" } },
      { id: "dr2", question: "Where do I see a driver's vehicle?", answer: "Driver profile → Overview shows the vehicle summary; the Vehicle tab has full specifications and compliance." },
    ],
  },
  {
    module: "finance",
    title: "Finance",
    articles: [
      { id: "f1", question: "Which payout options can drivers choose?", answer: "Finance Settings → Driver Payout Settings controls which payout schedules are offered and the default for new drivers.", link: { to: "/settings/finance", label: "Finance Settings" } },
      { id: "f2", question: "How do I process a batch of payouts?", answer: "Finance → Driver Payouts lists pending payouts. Select them and approve the batch.", link: { to: "/finance/payouts", label: "Driver Payouts" } },
    ],
  },
  {
    module: "support",
    title: "Support",
    articles: [
      { id: "s1", question: "How does a ticket move between teams?", answer: "Customer Support works a ticket first. If it's technical, it's escalated to the Technical queue. Once Technical Support resolves it and their lead verifies and closes it, it returns to Lead Support to notify the customer.", link: { to: "/support/unassigned", label: "Open Support" } },
      { id: "s2", question: "Where are internal how-to articles?", answer: "The Knowledge Base holds published guides for staff, customers and drivers.", link: { to: "/support/knowledge-base", label: "Knowledge Base" } },
    ],
  },
  {
    module: "reports",
    title: "Reports",
    articles: [
      { id: "r1", question: "Can I export a single chart?", answer: "Yes. Every chart has its own range filter and export menu (CSV or PDF) in its top-right corner.", link: { to: "/reports", label: "Open Reports" } },
    ],
  },
  {
    module: "marketing",
    title: "Marketing",
    articles: [
      { id: "m1", question: "Why won't my email send outside business hours?", answer: "Marketing Settings sets a send window and a weekly per-customer limit. Emails scheduled outside the window wait for it to open.", link: { to: "/settings/marketing", label: "Marketing Settings" } },
    ],
  },
];

export const SUPPORT_EMAIL = "support@kiarelay.com";
