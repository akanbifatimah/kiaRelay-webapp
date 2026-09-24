import { AlertTriangle, CheckCircle2, X } from "lucide-react";
import { Modal } from "../../../components/Modal";
import { Button } from "../../../components/Button";
import { Avatar } from "../../../components/Avatar";
import { roleMeta } from "../../access/modules";
import type { TeamMember } from "../../access/teamMembers";

interface DeactivateUserModalProps {
  /** One member from a row toggle, or several from Batch Actions. */
  members: TeamMember[];
  onConfirm: () => void;
  onCancel: () => void;
}

// Matches the "Deactivate Admin User?" design. Deactivation is reversible,
// so it's this dedicated modal; permanent Delete uses the shared ConfirmModal.
export function DeactivateUserModal({ members, onConfirm, onCancel }: DeactivateUserModalProps) {
  const plural = members.length > 1;
  return (
    <Modal
      size="md"
      onClose={onCancel}
      title={
        <>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-tag-danger-bg text-danger">
            <AlertTriangle className="h-4 w-4" />
          </span>
          {plural ? `Deactivate ${members.length} Admin Users?` : "Deactivate Admin User?"}
        </>
      }
      footer={
        <>
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            <X className="h-4 w-4" />
            Deactivate {plural ? "Users" : "User"}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <p className="text-sm text-text-muted">
          {plural ? "These users" : "This user"} will no longer be able to log in or access the KiaRelay admin platform. Any active browser sessions
          will be terminated immediately across all dispatch gateways.
        </p>
        <div className="flex max-h-52 flex-col gap-2 overflow-y-auto">
          {members.map((member) => (
            <div key={member.id} className="flex items-center justify-between gap-3 rounded-lg bg-bg p-3">
              <div className="flex min-w-0 items-center gap-3">
                <Avatar name={member.name} src={member.avatarSrc} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-text">{member.name}</p>
                  <p className="truncate text-xs text-text-muted">{member.email}</p>
                </div>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <span className="rounded bg-surface px-1.5 py-0.5 text-xs font-medium text-text">{roleMeta(member.role).label}</span>
                <span className="text-label text-text-muted">{member.title}</span>
              </div>
            </div>
          ))}
        </div>
        <p className="flex items-start gap-2 text-xs text-text-muted">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
          <span>
            <span className="font-semibold text-text">Operational Audit Preserved:</span> Historical activity, ticket actions, and audit trail
            records will remain permanently preserved in the platform ledger. You can reactivate {plural ? "these accounts" : "this account"} at any
            time.
          </span>
        </p>
      </div>
    </Modal>
  );
}
