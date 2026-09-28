import { getSessionEmail } from "../auth/authStorage";
import { ALL_MODULES, type ModuleKey, type RoleKey } from "./modules";
import { useTeamMembers, type TeamMember } from "./teamMembers";

export function effectiveModules(member: TeamMember): ModuleKey[] {
  return member.role === "super-admin" ? ALL_MODULES : member.modules;
}

export const isSuperAdmin = (member: TeamMember | undefined) => member?.role === "super-admin";

export function hasModule(member: TeamMember | undefined, module: ModuleKey): boolean {
  return Boolean(member && effectiveModules(member).includes(module));
}

interface AccessRule {
  prefix: string;
  /** Shown on the Access Restricted screen. */
  area: string;
  superAdminOnly?: boolean;
  allOf?: ModuleKey[];
  anyOf?: ModuleKey[];
  /** Roles kept out even with the module, e.g. Support units' own queues (TC-16). */
  denyRoles?: RoleKey[];
}

const CUSTOMER_UNIT: RoleKey[] = ["lead-support", "support-staff"];
const TECH_UNIT: RoleKey[] = ["lead-tech", "tech-staff"];

// Most specific prefix first. Settings are organized by area, not by role
// (2026-09-24): each settings page comes with its area's module, so every
// admin type gets "their" settings and Custom roles still work. Company
// Settings (legal name, EIN, DOT authority) is Super Admin-only. Dashboard
// ("/") and My Account ("/account") have no rule — every signed-in admin
// sees them.
const RULES: AccessRule[] = [
  { prefix: "/users", area: "User Management", superAdminOnly: true },
  { prefix: "/settings/company", area: "Company Settings", superAdminOnly: true },
  { prefix: "/settings/finance", area: "Finance Settings", allOf: ["finance"] },
  { prefix: "/settings/operations", area: "Operations Settings", anyOf: ["dispatch", "orders"] },
  { prefix: "/settings/marketing", area: "Marketing Settings", allOf: ["marketing"] },
  { prefix: "/settings", area: "Settings", anyOf: ["finance", "dispatch", "orders", "marketing"] },
  { prefix: "/dispatch", area: "Dispatch", allOf: ["dispatch"] },
  { prefix: "/orders", area: "Orders", allOf: ["orders"] },
  { prefix: "/customers", area: "Customers", allOf: ["customers"] },
  { prefix: "/drivers", area: "Drivers", allOf: ["drivers"] },
  { prefix: "/finance", area: "Finance", allOf: ["finance"] },
  // Support Department units (TC-16): each unit works its own queue; staff
  // don't get the lead-level Unassigned / Team Monitoring screens.
  { prefix: "/support/queue", area: "Support Queue", allOf: ["support"], denyRoles: TECH_UNIT },
  { prefix: "/support/technical", area: "Technical Queue", allOf: ["support"], denyRoles: CUSTOMER_UNIT },
  { prefix: "/support/unassigned", area: "Unassigned Tickets", allOf: ["support"], denyRoles: ["support-staff", ...TECH_UNIT] },
  { prefix: "/support/my-tickets", area: "My Tickets", allOf: ["support"], denyRoles: TECH_UNIT },
  { prefix: "/support/team", area: "Team Monitoring", allOf: ["support"], denyRoles: ["support-staff", "tech-staff"] },
  { prefix: "/support", area: "Claims & Support", allOf: ["support"] },
  { prefix: "/reports", area: "Reports", allOf: ["reports"] },
  { prefix: "/marketing", area: "Marketing", allOf: ["marketing"] },
];

const ruleFor = (path: string) => RULES.find((rule) => path === rule.prefix || path.startsWith(`${rule.prefix}/`));

export function canAccessPath(member: TeamMember | undefined, path: string): boolean {
  if (!member) return false;
  const rule = ruleFor(path);
  if (!rule) return true;
  if (rule.superAdminOnly) return isSuperAdmin(member);
  if (rule.denyRoles?.includes(member.role)) return false;
  const modules = effectiveModules(member);
  return (rule.allOf ?? []).every((m) => modules.includes(m)) && (!rule.anyOf || rule.anyOf.some((m) => modules.includes(m)));
}

export function restrictedArea(path: string): string {
  return ruleFor(path)?.area ?? "this page";
}

export const SETTINGS_PAGES = [
  { to: "/settings/company", label: "Company" },
  { to: "/settings/finance", label: "Finance" },
  { to: "/settings/operations", label: "Operations" },
  { to: "/settings/marketing", label: "Marketing" },
];

/** First Settings page this admin may open, or undefined when none. */
export function firstSettingsPath(member: TeamMember | undefined): string | undefined {
  return SETTINGS_PAGES.find((page) => canAccessPath(member, page.to))?.to;
}

/** The signed-in admin, kept live against the team store (edits apply immediately). */
export function useCurrentUser(): TeamMember | undefined {
  const team = useTeamMembers();
  const email = getSessionEmail();
  return email ? team.find((member) => member.email.toLowerCase() === email) : undefined;
}
