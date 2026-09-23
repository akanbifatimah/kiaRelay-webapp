import { Controller, useForm, useWatch } from "react-hook-form";
import { ArrowDown, Forward, Search } from "lucide-react";
import { Modal } from "../../../components/Modal";
import { Button } from "../../../components/Button";
import { Avatar } from "../../../components/Avatar";
import { getAgent, supportAgents } from "../agents";
import type { ReassignReason, SupportAgent, SupportTicket } from "../types";
import { AssigneeSearchResults } from "./AssigneeSearchResults";
import { ReassignReasonGrid } from "./ReassignReasonGrid";

const NOTES_MAX = 200;

interface ReassignTicketModalProps {
  ticket: SupportTicket;
  onClose: () => void;
  onReassign: (ticket: SupportTicket, agent: SupportAgent, reason: ReassignReason, notes: string) => void;
}

interface ReassignFormValues {
  search: string;
  agentId: string;
  reason: ReassignReason | "";
  notes: string;
}

export function ReassignTicketModal({ ticket, onClose, onReassign }: ReassignTicketModalProps) {
  const current = getAgent(ticket.assigneeId);
  const { control, handleSubmit } = useForm<ReassignFormValues>({
    defaultValues: { search: "", agentId: "", reason: "", notes: "" },
  });
  const [search, agentId, reason, notes] = useWatch({ control, name: ["search", "agentId", "reason", "notes"] });
  const query = search.trim().toLowerCase();
  const candidates = supportAgents.filter(
    (agent) =>
      agent.id !== ticket.assigneeId &&
      agent.availability !== "offline" &&
      (!query || agent.name.toLowerCase().includes(query) || agent.role.toLowerCase().includes(query)),
  );
  const selected = supportAgents.find((agent) => agent.id === agentId);

  function onSubmit(values: ReassignFormValues) {
    if (selected && values.reason) onReassign(ticket, selected, values.reason, values.notes.trim());
  }

  return (
    <Modal
      title={`Reassign Ticket #${ticket.id}`}
      subtitle={ticket.subject}
      size="lg"
      onClose={onClose}
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="reassign-ticket-form" variant="dark" disabled={!selected || !reason}>
            <Forward className="h-4 w-4" />
            Reassign Ticket
          </Button>
        </>
      }
    >
      <form id="reassign-ticket-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex items-center gap-3 rounded-lg border border-border bg-bg px-4 py-3">
          <Avatar name={current?.name ?? "Unassigned"} src={current?.avatar} />
          <div>
            <p className="text-label uppercase text-text-muted">Current Assignee</p>
            <p className="text-sm font-semibold text-text">{current?.name ?? "Unassigned"}</p>
          </div>
        </div>
        <ArrowDown className="mx-auto -my-1 h-4 w-4 text-text-muted" />

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-text">New Assignee</span>
          <Controller
            name="search"
            control={control}
            render={({ field }) => (
              <div className="flex items-center gap-2 rounded-md border border-border px-3 py-2">
                <Search className="h-4 w-4 text-text-muted" />
                <input
                  {...field}
                  placeholder="Search agents by name or role..."
                  className="w-full bg-transparent text-sm text-text placeholder:text-text-muted focus:outline-none"
                />
              </div>
            )}
          />
          <Controller
            name="agentId"
            control={control}
            render={({ field }) => <AssigneeSearchResults agents={candidates} value={field.value} onChange={field.onChange} />}
          />
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-text">Reason for Reassignment</span>
          <Controller
            name="reason"
            control={control}
            render={({ field }) => <ReassignReasonGrid value={field.value} onChange={field.onChange} />}
          />
        </div>

        <Controller
          name="notes"
          control={control}
          render={({ field }) => (
            <label className="flex flex-col gap-2">
              <span className="flex justify-between text-sm">
                <span className="font-medium text-text">Additional Notes (Optional)</span>
                <span className="text-xs text-text-muted">
                  {notes.length} / {NOTES_MAX}
                </span>
              </span>
              <textarea
                {...field}
                maxLength={NOTES_MAX}
                rows={3}
                placeholder="Add context for the new assignee..."
                className="rounded-md border border-border px-3 py-2 text-sm text-text placeholder:text-text-muted"
              />
            </label>
          )}
        />
      </form>
    </Modal>
  );
}
