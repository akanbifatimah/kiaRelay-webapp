import { getSessionEmail } from "../auth/authStorage";
import { ALL_MODULES, type ModuleKey } from "./modules";
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
}

// Most specific prefix first. Settings sub-pages need the Settings module
// AND the domain they configure, so e.g. a Marketing Admin granted Settings
// still can't change payout rules. Dashboard ("/") has no rule — everyone
// signed in sees it.
const RULES: AccessRule[] = [
  { prefix: "/users", area: "User Management", superAdminOnly: true },
  { prefix: "/settings/company", area: "Company Settings", allOf: ["settings"] },
  { prefix: "/settings/finance", area: "Finance Settings", allOf: ["settings", "finance"] },
  { prefix: "/settings/operations", area: "Operations Settings", allOf: ["settings"], anyOf: ["dispatch", "orders"] },
  { prefix: "/settings", area: "Settings", allOf: ["settings"] },
  { prefix: "/dispatch", area: "Dispatch", allOf: ["dispatch"] },
  { prefix: "/orders", area: "Orders", allOf: ["orders"] },
  { prefix: "/customers", area: "Customers", allOf: ["customers"] },
  { prefix: "/drivers", area: "Drivers", allOf: ["drivers"] },
  { prefix: "/finance", area: "Finance", allOf: ["finance"] },
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
