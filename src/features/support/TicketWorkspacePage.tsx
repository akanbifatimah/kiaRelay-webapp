import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Card } from "../../components/Card";
import { ConfirmModal } from "../../components/ConfirmModal";
import { DropdownMenu } from "../../components/DropdownMenu";
import { useToast } from "../../components/toast/ToastContext";
import { getAgent } from "./agents";
import { formatMinutesAgo } from "./formatTicketTime";
import { updateTicket, useTickets } from "./tickets";
import { appendTicketMessage, nowTime, useTicketMessages } from "./ticketMessages";
import { getTicketWorkspace } from "./ticketWorkspace";
import type { SupportAgent } from "./types";
import { SupportBackLink } from "./components/SupportBackLink";
import { SupportNotFound } from "./components/SupportNotFound";
import { TicketStatusBadge } from "./components/TicketStatusBadge";
import { MessageBubble } from "./components/MessageBubble";
import { ReplyComposer, type ComposerMode } from "./components/ReplyComposer";
import { ReassignTicketModal } from "./components/ReassignTicketModal";
import { ActiveRouteCard } from "./components/ActiveRouteCard";
import { AssignedAssetsCard, CustomerDetailsCard, OrderSummaryCard } from "./components/WorkspaceInfoCards";
import { WorkflowPanel } from "./components/WorkflowPanel";
import { supportCaps } from "./supportRoles";
import { useCurrentUser } from "../access/permissions";

export function TicketWorkspacePage() {
  const { id = "" } = useParams();
  const { showToast } = useToast();
  const currentUser = useCurrentUser();
  const ticket = useTickets().find((candidate) => candidate.id === id);
  const workspace = useMemo(() => (ticket ? getTicketWorkspace(ticket) : null), [ticket]);
  const storedMessages = useTicketMessages(id);
  const [isConfirmingClose, setIsConfirmingClose] = useState(false);
  const [isReassigning, setIsReassigning] = useState(false);

  if (!ticket || !workspace) return <SupportNotFound what="ticket" id={id} />;

  const messages = storedMessages ?? workspace.messages;
  const assignee = getAgent(ticket.assigneeId);
  const agentName = assignee?.name ?? "Support";
  const isResolved = ticket.status === "resolved";
  // TC-16: only roles that may close (Lead Support, admins) get a direct
  // Close; staff use the Workflow panel's "Mark Resolved" instead.
  const caps = supportCaps(currentUser);
  const canClose = ticket.queue === "technical" ? caps.verifyTechnical : caps.closeCustomer;
  const canReassign = ticket.queue === "technical" ? caps.assignTechnical : caps.assignCustomer;

  // TODO: POST /support/tickets/:id/messages and PATCH /support/tickets/:id
  // once the API exists — both write to the session stores for now.
  function handleSend(mode: ComposerMode, body: string) {
    if (!ticket || !workspace) return;
    const kind = mode === "reply" ? "agent" : "internal";
    const author = mode === "reply" ? `${agentName} (Support)` : agentName;
    appendTicketMessage(ticket.id, { kind, author, time: nowTime(), body }, messages);
    if (mode === "reply") updateTicket(ticket.id, { status: "awaiting-customer", lastActivityMinutesAgo: 0 });
    showToast("success", mode === "reply" ? `Reply sent to ${workspace.customer.contact}.` : "Internal note added.");
  }

  function handleReassign(_ticket: unknown, agent: SupportAgent) {
    if (!ticket) return;
    updateTicket(ticket.id, { assigneeId: agent.id });
    setIsReassigning(false);
    showToast("success", `${ticket.id} reassigned to ${agent.name}.`);
  }

  return (
    <div className="flex flex-col gap-6">
      <SupportBackLink />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <Card className="flex flex-col gap-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-text-muted">
                <TicketStatusBadge status={ticket.status} />
                <span>Ticket {workspace.displayId}</span>
                <span>• {formatMinutesAgo(ticket.createdMinutesAgo || 1)}</span>
                <span>• Assigned to {assignee?.name ?? "nobody"}</span>
              </div>
              <h1 className="mt-2 text-xl font-semibold text-text">{ticket.subject}</h1>
            </div>
            <DropdownMenu
              ariaLabel="Ticket options"
              items={isResolved ? [] : [
                ...(canReassign ? [{ label: "Reassign Ticket", onClick: () => setIsReassigning(true) }] : []),
                ...(canClose ? [{ label: "Close Ticket", tone: "danger" as const, onClick: () => setIsConfirmingClose(true) }] : []),
              ]}
            />
          </div>
          <div className="flex flex-col gap-5">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
          </div>
          {isResolved ? (
            <p className="rounded-lg bg-bg py-3 text-center text-sm text-text-muted">This ticket is closed — no further replies can be sent.</p>
          ) : (
            <ReplyComposer
              customerName={workspace.customer.contact}
              revisedEta={workspace.order.revisedEta}
              onSend={handleSend}
              // TODO: persist drafts via PUT /support/tickets/:id/draft.
              onSaveDraft={() => showToast("success", "Draft saved.")}
              onCloseTicket={canClose ? () => setIsConfirmingClose(true) : undefined}
            />
          )}
        </Card>
        <div className="flex flex-col gap-4">
          <WorkflowPanel ticket={ticket} />
          <CustomerDetailsCard customer={workspace.customer} />
          <ActiveRouteCard route={workspace.route} />
          <AssignedAssetsCard driver={workspace.driver} vehicle={workspace.vehicle} />
          <OrderSummaryCard order={workspace.order} />
        </div>
      </div>
      {isConfirmingClose && (
        <ConfirmModal
          title="Close this ticket?"
          message={`${ticket.id} will be marked resolved and ${workspace.customer.contact} will be notified.`}
          confirmLabel="Close Ticket"
          tone="danger"
          onCancel={() => setIsConfirmingClose(false)}
          onConfirm={() => {
            updateTicket(ticket.id, { status: "resolved", sla: "resolved", stage: "closed" });
            setIsConfirmingClose(false);
            showToast("success", `${ticket.id} closed.`);
          }}
        />
      )}
      {isReassigning && <ReassignTicketModal ticket={ticket} onClose={() => setIsReassigning(false)} onReassign={handleReassign} />}
    </div>
  );
}
