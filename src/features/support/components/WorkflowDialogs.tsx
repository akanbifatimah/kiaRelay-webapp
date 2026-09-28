import { useToast } from "../../../components/toast/ToastContext";
import { useCurrentUser } from "../../access/permissions";
import { getAgent } from "../agents";
import {
  assignTicket,
  closeCustomerTicket,
  createTechIssue,
  declineEscalation,
  escalateToTech,
  markResolved,
  reopenTechnical,
  requestEscalation,
  verifyAndCloseTechnical,
} from "../supportWorkflow";
import type { ReasonAction, WorkflowDialog } from "../workflowActions";
import { WorkflowAssignModal } from "./WorkflowAssignModal";
import { WorkflowReasonModal } from "./WorkflowReasonModal";
import { CloseCustomerTicketModal } from "./CloseCustomerTicketModal";
import { CreateTechIssueModal } from "./CreateTechIssueModal";

interface WorkflowDialogsProps {
  dialog: WorkflowDialog | null;
  onClose: () => void;
}

const REASON_RUN = {
  request: [requestEscalation, (id: string) => `Escalation requested for #${id}. Lead Support will review it.`],
  escalate: [escalateToTech, (id: string) => `#${id} moved to the Technical queue.`],
  decline: [declineEscalation, (id: string) => `Escalation request on #${id} declined.`],
  resolve: [markResolved, (id: string) => `#${id} marked resolved.`],
  verify: [verifyAndCloseTechnical, (id: string) => `#${id} verified and closed.`],
  reopen: [reopenTechnical, (id: string) => `#${id} reopened for the engineer.`],
} as const satisfies Record<ReasonAction, readonly [unknown, (id: string) => string]>;

// Renders whichever Support workflow dialog is open (TC-16) and runs its
// transition. Shared by both queue pages and the ticket workspace.
export function WorkflowDialogs({ dialog, onClose }: WorkflowDialogsProps) {
  const { showToast } = useToast();
  const actor = useCurrentUser()?.name ?? "Admin";
  if (!dialog) return null;

  const done = (message: string) => {
    showToast("success", message);
    onClose();
  };

  switch (dialog.kind) {
    case "assign":
      return (
        <WorkflowAssignModal
          ticket={dialog.ticket}
          onClose={onClose}
          onAssign={(assigneeId, priority, instructions) => {
            assignTicket(dialog.ticket, assigneeId, actor, priority, instructions);
            done(`#${dialog.ticket.id} assigned to ${getAgent(assigneeId)?.name ?? "agent"}.`);
          }}
        />
      );
    case "reason": {
      const [run, message] = REASON_RUN[dialog.action];
      return (
        <WorkflowReasonModal
          ticket={dialog.ticket}
          action={dialog.action}
          onClose={onClose}
          onConfirm={(text) => {
            run(dialog.ticket, actor, text);
            done(dialog.action === "verify" && dialog.ticket.escalation && !dialog.ticket.internal ? `#${dialog.ticket.id} verified and sent back to Lead Support.` : message(dialog.ticket.id));
          }}
        />
      );
    }
    case "close":
      return (
        <CloseCustomerTicketModal
          ticket={dialog.ticket}
          onClose={onClose}
          onConfirm={(notifyMessage) => {
            closeCustomerTicket(dialog.ticket, actor, notifyMessage);
            done(notifyMessage ? `#${dialog.ticket.id} closed and ${dialog.ticket.customer} notified.` : `#${dialog.ticket.id} closed.`);
          }}
        />
      );
    case "create-tech":
      return (
        <CreateTechIssueModal
          onClose={onClose}
          onCreate={(input) => {
            const ticket = createTechIssue(input, actor);
            done(`Technical issue #${ticket.id} created.`);
          }}
        />
      );
  }
}
