import type { DropdownMenuItem } from "../../components/DropdownMenu";
import type { SupportCaps } from "./supportRoles";
import type { SupportTicket } from "./types";

export type ReasonAction = "request" | "escalate" | "decline" | "resolve" | "verify" | "reopen";

export type WorkflowDialog =
  | { kind: "assign"; ticket: SupportTicket }
  | { kind: "reason"; ticket: SupportTicket; action: ReasonAction }
  | { kind: "close"; ticket: SupportTicket }
  | { kind: "create-tech" };

interface Handlers {
  open: (ticket: SupportTicket) => void;
  start: (ticket: SupportTicket) => void;
  dialog: (dialog: WorkflowDialog) => void;
}

/** Row / workspace actions for one ticket, filtered by the admin's Support
 * role (TC-16). `agentId` is the signed-in admin's assignee id. */
export function workflowActions(ticket: SupportTicket, caps: SupportCaps, agentId: string | undefined, h: Handlers): DropdownMenuItem[] {
  const stage = ticket.stage ?? "new";
  const technical = ticket.queue === "technical";
  const mine = Boolean(agentId && ticket.assigneeId === agentId);
  const items: DropdownMenuItem[] = [{ label: "Open Ticket", onClick: () => h.open(ticket) }];
  if (stage === "closed") return items;

  const canAssign = technical ? caps.assignTechnical : caps.assignCustomer;
  if (canAssign && stage !== "resolved") items.push({ label: ticket.assigneeId ? "Reassign" : "Assign", onClick: () => h.dialog({ kind: "assign", ticket }) });

  const canWork = mine || canAssign;
  if (canWork && stage === "new" && ticket.assigneeId) items.push({ label: "Start Work", onClick: () => h.start(ticket) });
  if (canWork && stage === "in-progress") items.push({ label: "Mark Resolved", onClick: () => h.dialog({ kind: "reason", ticket, action: "resolve" }) });

  if (!technical && stage !== "resolved") {
    if (caps.requestEscalation && mine && !ticket.escalationRequest) {
      items.push({ label: "Request Tech Escalation", onClick: () => h.dialog({ kind: "reason", ticket, action: "request" }) });
    }
    if (caps.escalateToTech) {
      items.push({ label: ticket.escalationRequest ? "Approve: Escalate to Tech" : "Escalate to Tech", onClick: () => h.dialog({ kind: "reason", ticket, action: "escalate" }) });
      if (ticket.escalationRequest) items.push({ label: "Decline Escalation Request", onClick: () => h.dialog({ kind: "reason", ticket, action: "decline" }) });
    }
  }

  if (stage === "resolved") {
    if (technical && caps.verifyTechnical) {
      items.push(
        { label: ticket.internal ? "Verify & Close" : "Verify & Return to Lead Support", onClick: () => h.dialog({ kind: "reason", ticket, action: "verify" }) },
        { label: "Reopen (not fixed)", tone: "danger", onClick: () => h.dialog({ kind: "reason", ticket, action: "reopen" }) },
      );
    }
    if (!technical && caps.closeCustomer) items.push({ label: ticket.techResolution ? "Notify Customer & Close" : "Close Ticket", onClick: () => h.dialog({ kind: "close", ticket }) });
  }
  return items;
}

export const REASON_COPY: Record<ReasonAction, { title: string; label: string; confirm: string; placeholder: string }> = {
  request: { title: "Request escalation to Technical", label: "Why does this need Technical Support?", confirm: "Send Request", placeholder: "Steps tried, error seen, how many customers are affected..." },
  escalate: { title: "Escalate to Technical Support", label: "Escalation reason", confirm: "Escalate to Tech", placeholder: "What's broken and what the customer sees..." },
  decline: { title: "Decline escalation request", label: "Reply to the agent", confirm: "Decline Request", placeholder: "e.g. Known account issue; follow the password-reset macro." },
  resolve: { title: "Mark as resolved", label: "Resolution summary", confirm: "Mark Resolved", placeholder: "What was done to fix it..." },
  verify: { title: "Verify technical resolution", label: "Verification note", confirm: "Verify & Close", placeholder: "How the fix was confirmed..." },
  reopen: { title: "Reopen for the engineer", label: "What's still wrong?", confirm: "Reopen", placeholder: "The issue still reproduces when..." },
};
