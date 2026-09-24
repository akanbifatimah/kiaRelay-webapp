import type { ModuleKey, RoleKey } from "./modules";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone?: string;
  /** Job title under the name, e.g. "Operations Lead". */
  title: string;
  role: RoleKey;
  /** Ignored for Super Admins, who always have every module. */
  modules: ModuleKey[];
  active: boolean;
  /** ISO timestamp of last sign-in/activity. */
  lastActive: string;
  avatarSrc?: string;
}

/** Dev-only password shared by every mock admin login (user-approved). */
export const DEV_PASSWORD = "Akanbi123@";

const minutesAgo = (minutes: number) => new Date(Date.now() - minutes * 60_000).toISOString();

// Seed team (2026-09-23). The first four are the dev logins — one per admin
// persona the user described; the rest are the people in the Team Members
// design. akanbifatimah@gmail.com was already the hardcoded dev login and
// stays the Super Admin, shown as "Alex Mercer" so Support's "My Tickets"
// (CURRENT_AGENT_ID) still belongs to whoever that header shows.
// TODO: replace with GET /admin/users once auth/RBAC has a backend.
export const SEED_TEAM: TeamMember[] = [
  { id: "usr-alex", name: "Alex Mercer", email: "akanbifatimah@gmail.com", title: "Fleet Admin", role: "super-admin", modules: [], active: true, lastActive: minutesAgo(1), avatarSrc: "/profile_img.png" },
  { id: "usr-ops", name: "Kemi Adebayo", email: "operations.admin@kiarelay.com", title: "Operations Manager", role: "operations", modules: ["dispatch", "orders", "customers", "drivers", "support", "reports"], active: true, lastActive: minutesAgo(18) },
  { id: "usr-fin", name: "Nora Bennett", email: "finance.admin@kiarelay.com", title: "Finance Controller", role: "finance", modules: ["finance", "customers", "reports"], active: true, lastActive: minutesAgo(95) },
  { id: "usr-mkt", name: "Tobi Lawal", email: "marketing.admin@kiarelay.com", title: "Marketing Lead", role: "marketing", modules: ["marketing", "reports"], active: true, lastActive: minutesAgo(240) },
  { id: "usr-david", name: "David Chen", email: "david@kiarelay.com", phone: "+1 (713) 555-0192", title: "Operations Lead", role: "super-admin", modules: [], active: true, lastActive: minutesAgo(3) },
  { id: "usr-maria", name: "Maria Lopez", email: "maria@kiarelay.com", title: "Customer Care Tier II", role: "operations", modules: ["support"], active: true, lastActive: minutesAgo(60) },
  { id: "usr-robert", name: "Robert Kim", email: "robert@kiarelay.com", title: "Settlement Analyst", role: "finance", modules: ["finance", "reports"], active: true, lastActive: minutesAgo(180) },
  { id: "usr-sarah", name: "Sarah Johnson", email: "sarah@kiarelay.com", title: "Growth Strategist", role: "marketing", modules: ["marketing", "reports"], active: true, lastActive: minutesAgo(60 * 24) },
  { id: "usr-james", name: "James Wright", email: "james@kiarelay.com", title: "Metro Hub Dispatcher", role: "operations", modules: ["dispatch", "drivers"], active: false, lastActive: minutesAgo(60 * 24 * 5) },
  { id: "usr-lisa", name: "Lisa Park", email: "lisa@kiarelay.com", title: "Escalations Specialist", role: "custom", modules: ["support"], active: true, lastActive: minutesAgo(120) },
];

export function formatLastActive(iso: string): string {
  const minutes = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60_000));
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr${hours === 1 ? "" : "s"} ago`;
  const days = Math.round(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}
