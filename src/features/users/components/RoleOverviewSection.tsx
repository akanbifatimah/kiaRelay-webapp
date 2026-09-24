import { ArrowRight, Lock } from "lucide-react";
import { Card } from "../../../components/Card";
import { moduleLabel, ROLES, type RoleKey } from "../../access/modules";
import { useRoleDefaults, type TeamMember } from "../../access/teamMembers";
import { RoleBadge } from "./AccessBadges";

interface RoleOverviewSectionProps {
  members: TeamMember[];
  onEditRole: (role: RoleKey) => void;
  /** Clicking a card's user count filters the table to that role. */
  onFilterRole: (role: RoleKey) => void;
}

// "Role Overview & Access Quick Reference" from the Team Members design —
// counts come from the live team list, module lists from the editable role
// presets, so both move when the Super Admin changes either.
export function RoleOverviewSection({ members, onEditRole, onFilterRole }: RoleOverviewSectionProps) {
  const defaults = useRoleDefaults();
  return (
    <section className="flex flex-col gap-3">
      <div>
        <h2 className="text-lg font-semibold text-text">Role Overview &amp; Access Quick Reference</h2>
        <p className="text-sm text-text-muted">System default roles and configured module assignments</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {ROLES.map((role) => {
          const count = members.filter((member) => member.role === role.key).length;
          const isSuper = role.key === "super-admin";
          return (
            <Card key={role.key} className="flex flex-col gap-3 p-4">
              <div className="flex items-center justify-between gap-2">
                <RoleBadge role={role.key} />
                <button type="button" onClick={() => onFilterRole(role.key)} className="text-xs text-text-muted hover:text-primary">
                  {count} User{count === 1 ? "" : "s"}
                </button>
              </div>
              <div className="flex-1">
                <p className="text-label text-text-muted">{isSuper ? "Scope" : "Module Access"}</p>
                {isSuper ? (
                  <p className="mt-1 text-sm font-semibold text-text">All Modules</p>
                ) : (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {defaults[role.key].length === 0 && <span className="text-xs text-text-muted">Assigned per user</span>}
                    {defaults[role.key].map((module) => (
                      <span key={module} className="rounded bg-bg px-1.5 py-0.5 text-xs text-text">
                        {moduleLabel(module)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              {isSuper ? (
                <p className="flex items-center gap-1 rounded bg-bg px-2 py-1 text-[11px] text-text-muted">
                  <Lock className="h-3 w-3" />
                  Cannot be edited (System Enforced)
                </p>
              ) : (
                <button type="button" onClick={() => onEditRole(role.key)} className="flex items-center gap-1 text-sm font-semibold text-text hover:text-primary">
                  Edit Permissions
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              )}
            </Card>
          );
        })}
      </div>
    </section>
  );
}
