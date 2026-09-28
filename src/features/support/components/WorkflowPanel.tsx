import { useState } from "react";
import { GitBranch } from "lucide-react";
import { Card } from "../../../components/Card";
import { useToast } from "../../../components/toast/ToastContext";
import { cn } from "../../../lib/cn";
import { useCurrentUser } from "../../access/permissions";
import { agentIdFor } from "../agents";
import { startWork } from "../supportWorkflow";
import { supportCaps } from "../supportRoles";
import { workflowActions, type WorkflowDialog } from "../workflowActions";
import type { SupportTicket } from "../types";
import { StageBadge } from "./StageBadge";
import { WorkflowDialogs } from "./WorkflowDialogs";

// The Support Department workflow for one ticket, on the workspace (TC-16):
// queue, stage, escalation / technical-resolution context, and the actions
// the signed-in admin's role allows. Opening the ticket is the page itself,
// so that action is dropped here.
export function WorkflowPanel({ ticket }: { ticket: SupportTicket }) {
  const { showToast } = useToast();
  const user = useCurrentUser();
  const [dialog, setDialog] = useState<WorkflowDialog | null>(null);
  const actions = workflowActions(ticket, supportCaps(user), agentIdFor(user), {
    open: () => undefined,
    start: (t) => {
      startWork(t, user?.name ?? "Admin");
      showToast("success", `#${t.id} is now In Progress.`);
    },
    dialog: setDialog,
  }).slice(1);

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-text">
          <GitBranch className="h-4 w-4 text-primary" />
          Workflow
        </h3>
        <StageBadge stage={ticket.stage} />
      </div>
      <p className="text-xs text-text-muted">{ticket.queue === "technical" ? "Technical Support queue" : "Customer Support queue"}</p>
      {ticket.escalationRequest && <Context title={`Escalation requested by ${ticket.escalationRequest.by}`} body={ticket.escalationRequest.reason} tone="danger" />}
      {ticket.escalation && <Context title={`Escalated by ${ticket.escalation.by}`} body={ticket.escalation.reason} />}
      {ticket.techResolution && <Context title={`Technical fix verified by ${ticket.techResolution.by}`} body={ticket.techResolution.note} tone="success" />}
      {ticket.customerNotifiedAt && <p className="text-xs text-success">Customer notified {new Date(ticket.customerNotifiedAt).toLocaleString()}.</p>}
      {actions.length > 0 ? (
        <div className="flex flex-col gap-2">
          {actions.map((action) => (
            <button
              key={action.label}
              type="button"
              onClick={action.onClick}
              className={cn(
                "rounded-lg border px-3 py-2 text-left text-sm font-medium hover:bg-bg",
                action.tone === "danger" ? "border-danger/30 text-danger" : "border-border text-text",
              )}
            >
              {action.label}
            </button>
          ))}
        </div>
      ) : (
        <p className="text-xs text-text-muted">{ticket.stage === "closed" ? "This ticket is closed." : "No workflow actions for your role at this stage."}</p>
      )}
      <WorkflowDialogs dialog={dialog} onClose={() => setDialog(null)} />
    </Card>
  );
}

function Context({ title, body, tone }: { title: string; body: string; tone?: "danger" | "success" }) {
  return (
    <div className={cn("rounded-lg p-3 text-xs", tone === "danger" ? "bg-tag-danger-bg" : tone === "success" ? "bg-tag-healthcare-bg" : "bg-bg")}>
      <p className="font-semibold text-text">{title}</p>
      <p className="mt-1 text-text-muted">{body}</p>
    </div>
  );
}
