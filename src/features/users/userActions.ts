import { logAudit } from "../access/auditLog";
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
  /** Blank when editing = keep the current password. */
  password: string;
  confirmPassword: string;
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

/** Creates or updates a user. Returns an error message when blocked. */
export function saveUser(values: UserFormValues, existing: TeamMember | undefined, actor: Actor): string | null {
  const modules = values.role === "super-admin" ? ALL_MODULES : values.modules;
  const { firstName, lastName, password, confirmPassword: _confirm, ...rest } = values;
  const name = `${firstName.trim()} ${lastName.trim()}`;
  const record = { ...rest, name, ...(password && { password }), email: values.email.trim().toLowerCase(), phone: values.phone.trim() || undefined, title: values.title.trim() || roleMeta(values.role).label, modules };
  if (!existing) {
    addMember(record);
    logAudit({ actor: actor.name, category: "users", action: "Added user", target: record.name, detail: `${roleMeta(record.role).label} · ${modules.map(moduleLabel).join(", ") || "No modules"}` });
    return null;
  }
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
    password && "Password reset",
  ].filter(Boolean);
  logAudit({ actor: actor.name, category: "users", action: "Edited user", target: record.name, detail: changes.join(" · ") || "Profile details updated" });
  return null;
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
