import { createPersistentStore } from "../../lib/createPersistentStore";
import { useStore } from "../../lib/createStore";
import { ROLES, type ModuleKey, type RoleKey } from "./modules";
import { SEED_TEAM, type TeamMember } from "./teamMembersData";

export type { TeamMember } from "./teamMembersData";

// v2 (2026-09-24): the "settings" module was removed and members gained an
// optional password — the key bump drops v1 data that could still hold it.
const teamStore = createPersistentStore<TeamMember[]>("kiarelay_team_v2", SEED_TEAM);
const roleDefaultsStore = createPersistentStore<Record<RoleKey, ModuleKey[]>>(
  "kiarelay_role_defaults_v2",
  Object.fromEntries(ROLES.map((role) => [role.key, role.defaultModules])) as Record<RoleKey, ModuleKey[]>,
);

export const useTeamMembers = () => useStore(teamStore);
export const useRoleDefaults = () => useStore(roleDefaultsStore);
export const getTeamMembers = () => teamStore.get();
export const getRoleDefaults = () => roleDefaultsStore.get();

export function findMemberByEmail(email: string): TeamMember | undefined {
  const normalized = email.trim().toLowerCase();
  return teamStore.get().find((member) => member.email.toLowerCase() === normalized);
}

export function isEmailTaken(email: string, exceptId?: string): boolean {
  const member = findMemberByEmail(email);
  return Boolean(member && member.id !== exceptId);
}

export function addMember(member: Omit<TeamMember, "id" | "lastActive">): TeamMember {
  const created: TeamMember = { ...member, id: `usr-${Date.now()}`, lastActive: new Date().toISOString() };
  teamStore.set((prev) => [created, ...prev]);
  return created;
}

export function updateMember(id: string, changes: Partial<Omit<TeamMember, "id">>): void {
  teamStore.set((prev) => prev.map((member) => (member.id === id ? { ...member, ...changes } : member)));
}

export function updateMembers(ids: string[], changes: Partial<Omit<TeamMember, "id">>): void {
  teamStore.set((prev) => prev.map((member) => (ids.includes(member.id) ? { ...member, ...changes } : member)));
}

export function removeMembers(ids: string[]): void {
  teamStore.set((prev) => prev.filter((member) => !ids.includes(member.id)));
}

export function touchMember(id: string): void {
  updateMember(id, { lastActive: new Date().toISOString() });
}

/** Saves a role's default modules, optionally re-applying them to everyone in that role. */
export function saveRoleDefaults(role: RoleKey, modules: ModuleKey[], applyToExisting: boolean): number {
  roleDefaultsStore.set((prev) => ({ ...prev, [role]: modules }));
  if (!applyToExisting) return 0;
  const affected = teamStore.get().filter((member) => member.role === role).map((member) => member.id);
  updateMembers(affected, { modules });
  return affected.length;
}

/**
 * Guards for destructive changes: nobody may lock themselves out, and the
 * platform must always keep at least one active Super Admin. Returns the
 * reason the change is blocked, or null when it's allowed.
 */
export function blockReason(targetIds: string[], currentUserId: string | undefined, change: "deactivate" | "delete" | "demote"): string | null {
  if (currentUserId && targetIds.includes(currentUserId)) {
    return change === "demote" ? "You can't change your own role." : `You can't ${change} your own account.`;
  }
  const remaining = teamStore.get().filter((member) => member.role === "super-admin" && member.active && !targetIds.includes(member.id));
  const touchesSuperAdmin = teamStore.get().some((member) => targetIds.includes(member.id) && member.role === "super-admin");
  if (touchesSuperAdmin && remaining.length === 0) return "At least one active Super Admin must remain.";
  return null;
}
