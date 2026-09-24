import { useState } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { Modal } from "../../../components/Modal";
import { Button } from "../../../components/Button";
import { auditCategoryLabels, useAuditLog } from "../../access/auditLog";
import { isSuperAdmin, useCurrentUser } from "../../access/permissions";

// "Legal Compliance & Articles of Incorporation" strip. "View Audit Trail"
// had no design: it opens the compliance + settings slice of the audit log
// in a modal, with a link through to the full /users/audit-log page.
export function ComplianceCard() {
  const [isOpen, setIsOpen] = useState(false);
  const user = useCurrentUser();
  const entries = useAuditLog().filter((entry) => entry.category === "compliance" || entry.category === "settings");

  return (
    <>
      <div className="flex flex-col gap-3 rounded-lg border border-border bg-bg p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-surface text-text-muted">
            <ShieldCheck className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-semibold text-text">Legal Compliance &amp; Articles of Incorporation</p>
            <p className="text-xs text-text-muted">Certificate of Good Standing renewed annually with the Texas Secretary of State.</p>
          </div>
        </div>
        <button type="button" onClick={() => setIsOpen(true)} className="text-label shrink-0 rounded-md bg-surface px-3 py-2 font-semibold text-text shadow-sm hover:bg-border">
          View Audit Trail
        </button>
      </div>
      {isOpen && (
        <Modal
          title="Compliance & Settings Audit Trail"
          subtitle="Filings, renewals and every saved change to company settings."
          size="lg"
          onClose={() => setIsOpen(false)}
          footer={
            <>
              {isSuperAdmin(user) && (
                <Link to="/users/audit-log" className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-text hover:bg-bg">
                  Open Full Audit Log
                </Link>
              )}
              <Button onClick={() => setIsOpen(false)}>Done</Button>
            </>
          }
        >
          {entries.length === 0 ? (
            <p className="py-8 text-center text-sm text-text-muted">No compliance or settings activity recorded yet.</p>
          ) : (
            <ol className="flex flex-col">
              {entries.map((entry) => (
                <li key={entry.id} className="flex gap-3 border-l-2 border-border pb-4 pl-4 last:pb-0">
                  <div className="-ml-[23px] mt-1 h-3 w-3 shrink-0 rounded-full border-2 border-surface bg-primary" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-text">{entry.action}</p>
                    <p className="text-xs text-text-muted">
                      {entry.actor} · {auditCategoryLabels[entry.category]} · {new Date(entry.at).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}
                    </p>
                    {entry.detail && <p className="mt-0.5 text-xs text-text">{entry.detail}</p>}
                  </div>
                </li>
              ))}
            </ol>
          )}
        </Modal>
      )}
    </>
  );
}
