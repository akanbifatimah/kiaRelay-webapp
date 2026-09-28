import { logAudit } from "../access/auditLog";
import { generatePassword } from "../../lib/generatePassword";
import { ALL_MODULES, moduleLabel, roleMeta, type ModuleKey, type RoleKey } from "../access/modules";
import { addMember, blockReason, getTeamMembers, removeMembers, updateMember, updateMembers, type TeamMember } from "../access/teamMembers";

export interface UserFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  title: string;
  role: RoleKey;
  modules: ModuleKey[];
  active: boolean;
}

/** What the "Invite sent" dialog shows once, since no email is sent yet. */
export interface InviteResult {
  name: string;
  email: string;
  password: string;
  resent: boolean;
}

export interface SaveResult {
  error: string | null;
  invite?: InviteResult;
}

/** Every mutation is attributed to the signed-in admin and written to the audit log. */
export interface Actor {
  id: string;
  name: string;
}

const namesOf = (ids: string[]) =>
  getTeamMembers()
    .filter((member) => ids.includes(member.id))
    .map((member) => member.name)
    .join(", ");

function moduleDiff(before: ModuleKey[], after: ModuleKey[]): string {
  const added = after.filter((m) => !before.includes(m)).map(moduleLabel);
  const removed = before.filter((m) => !after.includes(m)).map(moduleLabel);
  return [added.length && `Granted ${added.join(", ")}`, removed.length && `Revoked ${removed.join(", ")}`].filter(Boolean).join(" · ");
}

/**
 * Creates or updates a user. New members get an auto-generated temporary
 * password and a pending invite (TC-09, 2026-09-28); the Super Admin never
 * types a password. Returns the error when blocked, and the invite on add.
 * TODO: POST /admin/users should generate + email the password server-side.
 */
export function saveUser(values: UserFormValues, existing: TeamMember | undefined, actor: Actor): SaveResult {
  const modules = values.role === "super-admin" ? ALL_MODULES : values.modules;
  const { firstName, lastName, ...rest } = values;
  const name = `${firstName.trim()} ${lastName.trim()}`;
  const record = { ...rest, name, email: values.email.trim().toLowerCase(), phone: values.phone.trim() || undefined, title: values.title.trim() || roleMeta(values.role).label, modules };
  if (!existing) {
    const password = generatePassword();
    addMember({ ...record, password, invite: { sentAt: new Date().toISOString() } });
    logAudit({ actor: actor.name, category: "users", action: "Added user", target: record.name, detail: `${roleMeta(record.role).label} · ${modules.map(moduleLabel).join(", ") || "No modules"} · invite sent` });
    return { error: null, invite: { name: record.name, email: record.email, password, resent: false } };
  }
  return { error: updateUser(existing, record, modules, actor) };
}

function updateUser(existing: TeamMember, record: Omit<TeamMember, "id" | "lastActive">, modules: ModuleKey[], actor: Actor): string | null {
  const demoted = existing.role === "super-admin" && record.role !== "super-admin";
  const blocked =
    (demoted && blockReason([existing.id], actor.id, "demote")) ||
    (existing.active && !record.active && blockReason([existing.id], actor.id, "deactivate")) ||
    (existing.role !== record.role && existing.id === actor.id ? "You can't change your own role." : null);
  if (blocked) return blocked;
  updateMember(existing.id, record);
  const changes = [
    existing.role !== record.role && `Role ${roleMeta(existing.role).label} → ${roleMeta(record.role).label}`,
    moduleDiff(existing.role === "super-admin" ? ALL_MODULES : existing.modules, modules),
    existing.active !== record.active && (record.active ? "Reactivated" : "Deactivated"),
  ].filter(Boolean);
  logAudit({ actor: actor.name, category: "users", action: "Edited user", target: record.name, detail: changes.join(" · ") || "Profile details updated" });
  return null;
}

/**
 * Resend Invite (TC-09): issues a fresh temporary password and restarts the
 * invite. For a member who already accepted, this doubles as an admin
 * password reset. Resending to yourself is blocked; use My Account instead.
 */
export function resendInvite(member: TeamMember, actor: Actor): SaveResult {
  if (member.id === actor.id) return { error: "Change your own password in My Account." };
  if (!member.active) return { error: "Reactivate this account before resending the invite." };
  const password = generatePassword();
  updateMember(member.id, { password, invite: { sentAt: new Date().toISOString() } });
  logAudit({ actor: actor.name, category: "users", action: "Resent invite", target: member.name, detail: `New temporary password issued to ${member.email}` });
  return { error: null, invite: { name: member.name, email: member.email, password, resent: true } };
}

export function setUsersActive(ids: string[], active: boolean, actor: Actor): string | null {
  const blocked = active ? null : blockReason(ids, actor.id, "deactivate");
  if (blocked) return blocked;
  const names = namesOf(ids);
  updateMembers(ids, { active });
  logAudit({ actor: actor.name, category: "users", action: active ? "Reactivated user" : "Deactivated user", target: names });
  return null;
}

export function deleteUsers(ids: string[], actor: Actor): string | null {
  const blocked = blockReason(ids, actor.id, "delete");
  if (blocked) return blocked;
  const names = namesOf(ids);
  removeMembers(ids);
  logAudit({ actor: actor.name, category: "users", action: "Deleted user", target: names });
  return null;
}

/** Batch role change — members take the role's current default modules. */
export function changeUsersRole(ids: string[], role: RoleKey, defaults: ModuleKey[], actor: Actor): string | null {
  const demotesSuperAdmin = role !== "super-admin" && getTeamMembers().some((m) => ids.includes(m.id) && m.role === "super-admin");
  const blocked = (ids.includes(actor.id) && "You can't change your own role.") || (demotesSuperAdmin && blockReason(ids, actor.id, "demote"));
  if (blocked) return blocked;
  const names = namesOf(ids);
  updateMembers(ids, { role, modules: role === "super-admin" ? ALL_MODULES : defaults });
  logAudit({ actor: actor.name, category: "roles", action: "Changed role", target: names, detail: `→ ${roleMeta(role).label}` });
  return null;
}
