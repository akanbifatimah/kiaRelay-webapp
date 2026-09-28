import { useState } from "react";
import { Copy, Eye, EyeOff, MailCheck } from "lucide-react";
import { Modal } from "../../../components/Modal";
import { Button } from "../../../components/Button";
import { Tooltip } from "../../../components/Tooltip";
import { useToast } from "../../../components/toast/ToastContext";
import type { InviteResult } from "../userActions";

interface InviteSentModalProps {
  invite: InviteResult;
  onClose: () => void;
}

// Shown once after Add User or Resend Invite (TC-09, 2026-09-28). The
// password is generated automatically. There's no email delivery yet, so the
// Super Admin can copy the credentials here, the one and only time they're
// shown.
// TODO: remove the password display once POST /admin/users emails the invite.
export function InviteSentModal({ invite, onClose }: InviteSentModalProps) {
  const { showToast } = useToast();
  const [revealed, setRevealed] = useState(false);

  function copy(text: string, what: string) {
    navigator.clipboard.writeText(text).then(
      () => showToast("success", `${what} copied.`),
      () => showToast("error", "Couldn't copy. Select the text and copy it manually."),
    );
  }

  return (
    <Modal
      title={
        <>
          <MailCheck className="h-5 w-5 text-success" />
          {invite.resent ? "Invite resent" : "Invite sent"}
        </>
      }
      subtitle={`${invite.name} can now sign in at the admin login with a temporary password.`}
      onClose={onClose}
      footer={<Button onClick={onClose}>Done</Button>}
    >
      <div className="flex flex-col gap-4 text-sm">
        <div className="flex flex-col gap-1">
          <span className="text-label text-text-muted">Email</span>
          <span className="font-medium text-text">{invite.email}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-label text-text-muted">Temporary Password</span>
          <div className="flex items-center gap-2 rounded-md bg-bg px-3 py-2">
            <span className="flex-1 font-mono text-text">{revealed ? invite.password : "•".repeat(invite.password.length)}</span>
            <Tooltip label={revealed ? "Hide password" : "Show password"}>
              <button type="button" aria-label={revealed ? "Hide password" : "Show password"} onClick={() => setRevealed((v) => !v)} className="text-text-muted hover:text-text">
                {revealed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </Tooltip>
            <Tooltip label="Copy password">
              <button type="button" aria-label="Copy password" onClick={() => copy(invite.password, "Password")} className="text-text-muted hover:text-text">
                <Copy className="h-4 w-4" />
              </button>
            </Tooltip>
          </div>
        </div>
        <button
          type="button"
          onClick={() => copy(`KiaRelay admin sign-in\n${window.location.origin}/login\nEmail: ${invite.email}\nTemporary password: ${invite.password}`, "Invite details")}
          className="w-fit text-sm font-medium text-primary hover:underline"
        >
          Copy full invite message
        </button>
        <p className="rounded-lg bg-bg p-3 text-xs text-text-muted">
          The password was generated automatically and won't be shown again. Any earlier temporary password no longer works. Once
          they sign in, they should set their own password in My Account. If it gets lost, use <strong>Resend Invite</strong> on the team list.
        </p>
      </div>
    </Modal>
  );
}
