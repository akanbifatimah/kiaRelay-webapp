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

export type RoleKey = "super-admin" | "operations" | "finance" | "marketing" | "custom";

export interface RoleMeta {
  key: RoleKey;
  label: string;
  /** Pill classes — theme tokens only. */
  badge: string;
  description: string;
  defaultModules: ModuleKey[];
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
  },
  {
    key: "finance",
    label: "Finance Admin",
    badge: "bg-success/10 text-success",
    description: "Payments, payouts, invoicing and revenue reporting.",
    defaultModules: ["finance", "customers", "reports"],
  },
  {
    key: "marketing",
    label: "Marketing Admin",
    badge: "bg-tag-overnight-bg text-tag-overnight-fg",
    description: "Email campaigns, newsletters and templates.",
    defaultModules: ["marketing", "reports"],
  },
  {
    key: "custom",
    label: "Custom",
    badge: "bg-tag-standard-bg text-tag-standard-fg",
    description: "Hand-picked module access for one-off responsibilities.",
    defaultModules: [],
  },
];

export const roleMeta = (key: RoleKey): RoleMeta => ROLES.find((role) => role.key === key) as RoleMeta;
