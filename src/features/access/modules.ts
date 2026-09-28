export type ModuleKey =
  | "dispatch"
  | "orders"
  | "customers"
  | "drivers"
  | "finance"
  | "support"
  | "reports"
  | "marketing";

// Grantable modules from the Add Team Member design (2026-09-23). "Pricing"
// was dropped (user-approved) since it has no screen in this app. Dashboard
// is visible to everyone; User Management is Super Admin-only and is never
// grantable, so no one can escalate their own access. There is no separate
// "Settings" module any more (2026-09-24, user-approved): each area's
// settings page comes with that area's module (see access/permissions.ts).
export const MODULES: { key: ModuleKey; label: string }[] = [
  { key: "dispatch", label: "Dispatch" },
  { key: "orders", label: "Orders" },
  { key: "customers", label: "Customers" },
  { key: "drivers", label: "Drivers" },
  { key: "finance", label: "Finance" },
  { key: "support", label: "Claims & Support" },
  { key: "reports", label: "Reports" },
  { key: "marketing", label: "Marketing" },
];

export const ALL_MODULES = MODULES.map((module) => module.key);

export const moduleLabel = (key: ModuleKey) => MODULES.find((module) => module.key === key)?.label ?? key;

export type SupportRoleKey = "lead-support" | "support-staff" | "lead-tech" | "tech-staff";

export type RoleKey = "super-admin" | "operations" | "finance" | "marketing" | SupportRoleKey | "custom";

/** The department a role belongs to (TC-16 hierarchy); Super Admin and Custom have none. */
export type Department = "Operations" | "Marketing" | "Finance" | "Support";

export interface RoleMeta {
  key: RoleKey;
  label: string;
  /** Pill classes — theme tokens only. */
  badge: string;
  description: string;
  defaultModules: ModuleKey[];
  department?: Department;
  /** Sub-unit inside a department, e.g. "Customer Support". */
  unit?: string;
}

// The four admin personas the user described, plus the design's "Custom
// (Modular Access Controls)" option. Default modules are only presets —
// the Super Admin can grant/revoke per user, and edit a role's defaults.
export const ROLES: RoleMeta[] = [
  {
    key: "super-admin",
    label: "Super Admin",
    badge: "bg-sidebar text-white",
    description: "Full platform control, user management and permissions.",
    defaultModules: ALL_MODULES,
  },
  {
    key: "operations",
    label: "Operations Admin",
    badge: "bg-tag-info-bg text-tag-info-fg",
    description: "Day-to-day delivery operations, dispatch and customer care.",
    defaultModules: ["dispatch", "orders", "customers", "drivers", "support", "reports"],
    department: "Operations",
  },
  {
    key: "finance",
    label: "Finance Admin",
    badge: "bg-success/10 text-success",
    description: "Payments, payouts, invoicing and revenue reporting.",
    defaultModules: ["finance", "customers", "reports"],
    department: "Finance",
  },
  {
    key: "marketing",
    label: "Marketing Admin",
    badge: "bg-tag-overnight-bg text-tag-overnight-fg",
    description: "Email campaigns, newsletters and templates.",
    defaultModules: ["marketing", "reports"],
    department: "Marketing",
  },
  // Support Department (TC-16, 2026-09-28): two units, a lead and staff in
  // each. What each can do inside Support is in support/supportWorkflow.ts.
  {
    key: "lead-support",
    label: "Lead Support Staff",
    badge: "bg-tag-healthcare-bg text-tag-healthcare-fg",
    description: "Head of Customer Support: sees every customer ticket, assigns, escalates to Technical, closes, views reports.",
    defaultModules: ["support", "customers", "reports"],
    department: "Support",
    unit: "Customer Support",
  },
  {
    key: "support-staff",
    label: "Support Staff",
    badge: "bg-tag-healthcare-bg text-tag-healthcare-fg",
    description: "Frontline: works and replies to assigned tickets, can request escalation to Lead Support.",
    defaultModules: ["support"],
    department: "Support",
    unit: "Customer Support",
  },
  {
    key: "lead-tech",
    label: "Lead Technical Support",
    badge: "bg-tag-freight-bg text-tag-freight-fg",
    description: "Head of Technical: sees every technical ticket, creates issues, assigns with priority, verifies and closes.",
    defaultModules: ["support", "reports"],
    department: "Support",
    unit: "Technical Support",
  },
  {
    key: "tech-staff",
    label: "Technical Support Staff",
    badge: "bg-tag-freight-bg text-tag-freight-fg",
    description: "Resolves technical issues assigned to them and marks them resolved for Lead verification.",
    defaultModules: ["support"],
    department: "Support",
    unit: "Technical Support",
  },
  {
    key: "custom",
    label: "Custom",
    badge: "bg-tag-standard-bg text-tag-standard-fg",
    description: "Hand-picked module access for one-off responsibilities.",
    defaultModules: [],
  },
];

export const roleMeta = (key: RoleKey): RoleMeta => ROLES.find((role) => role.key === key) ?? ROLES[ROLES.length - 1];

/** Role picker groups, following the department hierarchy. */
export const ROLE_GROUPS: { label: string; roles: RoleKey[] }[] = [
  { label: "Platform", roles: ["super-admin"] },
  { label: "Departments", roles: ["operations", "marketing", "finance"] },
  { label: "Support Department: Customer Support", roles: ["lead-support", "support-staff"] },
  { label: "Support Department: Technical Support", roles: ["lead-tech", "tech-staff"] },
  { label: "Other", roles: ["custom"] },
];
