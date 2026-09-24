import { useState } from "react";
import { Monitor, Smartphone } from "lucide-react";
import { Card } from "../../../components/Card";
import { ConfirmModal } from "../../../components/ConfirmModal";
import { useToast } from "../../../components/toast/ToastContext";
import { logAudit } from "../../access/auditLog";
import { formatLastActive } from "../../access/teamMembersData";
import type { TeamMember } from "../../access/teamMembers";
import { revokeSessions, useSessions, type AdminSession } from "../accountStore";

// Where this admin is signed in. The current session can't be ended here
// (that's Log out in the header); every other one can, individually or all
// at once — both behind ConfirmModal (rule 9).
export function SessionsCard({ member }: { member: TeamMember }) {
  const { showToast } = useToast();
  const sessions = useSessions(member.id);
  const others = sessions.filter((session) => !session.current);
  const [pending, setPending] = useState<AdminSession[] | null>(null);

  function confirm() {
    if (!pending) return;
    revokeSessions(member.id, pending.map((session) => session.id));
    logAudit({ actor: member.name, category: "auth", action: "Signed out other sessions", target: member.email, detail: pending.map((s) => s.device).join(", ") });
    showToast("success", pending.length === 1 ? `Signed out of ${pending[0].device}.` : `Signed out of ${pending.length} other sessions.`);
    setPending(null);
  }

  return (
    <Card className="flex flex-col gap-5 p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-text">Active Sessions</h2>
          <p className="text-xs text-text-muted">Devices currently signed in to your account.</p>
        </div>
        {others.length > 0 && (
          <button type="button" onClick={() => setPending(others)} className="shrink-0 text-sm font-medium text-danger hover:underline">
            Sign out all other sessions
          </button>
        )}
      </div>
      <ul className="flex flex-col gap-2">
        {sessions.map((session) => {
          const Icon = /iOS|Android/.test(session.device) ? Smartphone : Monitor;
          return (
            <li key={session.id} className="flex items-center justify-between gap-3 rounded-lg bg-bg px-4 py-3">
              <div className="flex items-center gap-3">
                <Icon className="h-5 w-5 text-text-muted" />
                <div>
                  <p className="text-sm font-medium text-text">
                    {session.device}
                    {session.current && <span className="ml-2 rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">This device</span>}
                  </p>
                  <p className="text-xs text-text-muted">
                    {session.location} · {session.current ? "Active now" : `Last active ${formatLastActive(session.lastSeen)}`}
                  </p>
                </div>
              </div>
              {!session.current && (
                <button type="button" onClick={() => setPending([session])} className="text-sm text-text-muted hover:text-danger">
                  Sign out
                </button>
              )}
            </li>
          );
        })}
      </ul>
      {pending && (
        <ConfirmModal
          title={pending.length === 1 ? "Sign out this device?" : "Sign out all other sessions?"}
          message={
            pending.length === 1
              ? `${pending[0].device} (${pending[0].location}) will need to sign in again.`
              : `${pending.length} other devices will need to sign in again. You'll stay signed in here.`
          }
          confirmLabel="Sign Out"
          tone="danger"
          onCancel={() => setPending(null)}
          onConfirm={confirm}
        />
      )}
    </Card>
  );
}
