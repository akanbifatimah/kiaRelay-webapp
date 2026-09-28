import { ConfirmModal } from "../../../components/ConfirmModal";
import { useToast } from "../../../components/toast/ToastContext";
import { logAudit } from "../../access/auditLog";
import { moduleLabel, roleMeta, type RoleKey } from "../../access/modules";
import { saveRoleDefaults, useRoleDefaults, useTeamMembers, type TeamMember } from "../../access/teamMembers";
import { changeUsersRole, deleteUsers, resendInvite, saveUser, setUsersActive, type Actor, type InviteResult } from "../userActions";
import { UserFormModal } from "./UserFormModal";
import { InviteSentModal } from "./InviteSentModal";
import { DeactivateUserModal } from "./DeactivateUserModal";
import { ChangeRoleModal } from "./ChangeRoleModal";
import { RolePermissionsModal } from "./RolePermissionsModal";

export type UserDialog =
  | { kind: "form"; member?: TeamMember }
  | { kind: "resend"; member: TeamMember }
  | { kind: "invite-sent"; invite: InviteResult }
  | { kind: "deactivate"; ids: string[] }
  | { kind: "delete"; ids: string[] }
  | { kind: "role"; ids: string[] }
  | { kind: "permissions"; role: RoleKey };

interface UserDialogsProps {
  dialog: UserDialog;
  actor: Actor;
  onClose: () => void;
  /** Called after a successful batch/row action — the page clears its selection. */
  onDone: () => void;
  /** Swaps to a follow-up dialog, e.g. "Invite sent" after Add User. */
  onShow: (dialog: UserDialog) => void;
}

// One place that renders whichever User Management dialog is open and runs
// its action through userActions (guards + audit log), so the page itself
// only tracks *which* dialog is open.
export function UserDialogs({ dialog, actor, onClose, onDone, onShow }: UserDialogsProps) {
  const { showToast } = useToast();
  const team = useTeamMembers();
  const defaults = useRoleDefaults();

  function finish(error: string | null, success: string) {
    if (error) return showToast("error", error);
    showToast("success", success);
    onDone();
    onClose();
  }

  const membersFor = (ids: string[]) => team.filter((member) => ids.includes(member.id));
  const label = (ids: string[]) => (ids.length === 1 ? membersFor(ids)[0]?.name ?? "User" : `${ids.length} users`);

  switch (dialog.kind) {
    case "form":
      return (
        <UserFormModal
          member={dialog.member}
          isSelf={dialog.member?.id === actor.id}
          onClose={onClose}
          onSubmit={(values) => {
            const result = saveUser(values, dialog.member, actor);
            if (result.error || !result.invite) return finish(result.error, `${values.firstName} ${values.lastName} updated.`);
            onDone();
            onShow({ kind: "invite-sent", invite: result.invite });
          }}
        />
      );
    case "resend":
      return (
        <ConfirmModal
          title="Resend invite?"
          message={`${dialog.member.name} gets a new temporary password for ${dialog.member.email}. Any earlier temporary password stops working.`}
          confirmLabel="Resend Invite"
          onCancel={onClose}
          onConfirm={() => {
            const result = resendInvite(dialog.member, actor);
            if (result.error || !result.invite) return finish(result.error, "");
            onShow({ kind: "invite-sent", invite: result.invite });
          }}
        />
      );
    case "invite-sent":
      return <InviteSentModal invite={dialog.invite} onClose={onClose} />;
    case "deactivate":
      return (
        <DeactivateUserModal
          members={membersFor(dialog.ids)}
          onCancel={onClose}
          onConfirm={() => finish(setUsersActive(dialog.ids, false, actor), `${label(dialog.ids)} deactivated.`)}
        />
      );
    case "delete":
      return (
        <ConfirmModal
          title={dialog.ids.length === 1 ? "Delete this team member?" : `Delete ${dialog.ids.length} team members?`}
          message={`${label(dialog.ids)} will be permanently removed from the admin team and lose all access. Their past actions stay in the audit log. To keep the account for later, deactivate instead.`}
          confirmLabel="Delete"
          tone="danger"
          onCancel={onClose}
          onConfirm={() => finish(deleteUsers(dialog.ids, actor), `${label(dialog.ids)} deleted.`)}
        />
      );
    case "role":
      return (
        <ChangeRoleModal
          count={dialog.ids.length}
          onCancel={onClose}
          onConfirm={(role) => finish(changeUsersRole(dialog.ids, role, defaults[role], actor), `${label(dialog.ids)} now ${dialog.ids.length === 1 ? "has" : "have"} the ${roleMeta(role).label} role.`)}
        />
      );
    case "permissions": {
      const memberCount = team.filter((member) => member.role === dialog.role).length;
      return (
        <RolePermissionsModal
          role={dialog.role}
          memberCount={memberCount}
          onClose={onClose}
          onSave={(modules, applyToExisting) => {
            const applied = saveRoleDefaults(dialog.role, modules, applyToExisting);
            logAudit({
              actor: actor.name,
              category: "roles",
              action: "Edited role defaults",
              target: roleMeta(dialog.role).label,
              detail: `${modules.map(moduleLabel).join(", ") || "No modules"}${applyToExisting ? ` · applied to ${applied} user(s)` : ""}`,
            });
            finish(null, applyToExisting ? `${roleMeta(dialog.role).label} permissions saved and applied to ${applied} user${applied === 1 ? "" : "s"}.` : `${roleMeta(dialog.role).label} default permissions saved.`);
          }}
        />
      );
    }
  }
}
