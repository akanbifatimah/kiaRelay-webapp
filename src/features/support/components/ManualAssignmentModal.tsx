import { Controller, useForm, useWatch } from "react-hook-form";
import { Search, Timer, UserCheck } from "lucide-react";
import { Modal } from "../../../components/Modal";
import { Button } from "../../../components/Button";
import { FormField } from "../../../components/FormField";
import { SUPPORT_TEAMS, supportAgents } from "../agents";
import { formatSlaShort } from "../formatTicketTime";
import { categoryLabels, priorityLabels, type SupportAgent, type SupportTicket } from "../types";
import { AgentSelectList } from "./AgentSelectList";

interface ManualAssignmentModalProps {
  ticket: SupportTicket;
  onClose: () => void;
  onAssign: (ticket: SupportTicket, agent: SupportAgent) => void;
}

interface AssignmentFormValues {
  team: string;
  search: string;
  agentId: string;
}

export function ManualAssignmentModal({ ticket, onClose, onAssign }: ManualAssignmentModalProps) {
  const { control, handleSubmit } = useForm<AssignmentFormValues>({
    defaultValues: { team: SUPPORT_TEAMS[0], search: "", agentId: "" },
  });
  const [team, search, agentId] = useWatch({ control, name: ["team", "search", "agentId"] });
  const query = search.trim().toLowerCase();
  const agents = supportAgents.filter(
    (agent) =>
      agent.team === team &&
      (!query || agent.name.toLowerCase().includes(query) || agent.role.toLowerCase().includes(query)),
  );

  // A pick from one team stays in form state after switching teams — only
  // count it as selected while it's actually in the visible list.
  const selectedAgent = agents.find((agent) => agent.id === agentId);

  function onSubmit() {
    if (selectedAgent) onAssign(ticket, selectedAgent);
  }

  return (
    <Modal
      title="Manual Assignment"
      size="lg"
      onClose={onClose}
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="manual-assignment-form" variant="dark" disabled={!selectedAgent}>
            <UserCheck className="h-4 w-4" />
            Assign Ticket
          </Button>
        </>
      }
    >
      <form id="manual-assignment-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="rounded-lg border border-border border-l-4 border-l-primary bg-primary/5 px-4 py-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded bg-surface px-1.5 py-0.5 text-xs font-semibold text-text">#{ticket.id}</span>
            <span className="text-xs text-text-muted">{categoryLabels[ticket.category]}</span>
            <span className="ml-auto flex items-center gap-1.5">
              <span className="rounded border border-danger/30 bg-tag-danger-bg px-1.5 py-0.5 text-xs font-semibold uppercase text-tag-danger-fg">
                {priorityLabels[ticket.priority]} Priority
              </span>
              <span className="inline-flex items-center gap-1 rounded border border-danger/30 bg-surface px-1.5 py-0.5 text-xs font-semibold text-danger">
                <Timer className="h-3 w-3" />
                {formatSlaShort(ticket.slaMinutesLeft)} SLA
              </span>
            </span>
          </div>
          <p className="mt-2 font-semibold text-text">{ticket.subject}</p>
        </div>

        <FormField
          control={control}
          name="team"
          label="Target Team"
          type="select"
          options={SUPPORT_TEAMS.map((value) => ({ value, label: value }))}
        />

        <div className="flex flex-col gap-2">
          <span className="text-sm text-text-muted">Available Agents</span>
          <Controller
            name="search"
            control={control}
            render={({ field }) => (
              <div className="flex items-center gap-2 rounded-md border border-border px-3 py-2">
                <Search className="h-4 w-4 text-text-muted" />
                <input
                  {...field}
                  placeholder="Search agents by name or skill..."
                  className="w-full bg-transparent text-sm text-text placeholder:text-text-muted focus:outline-none"
                />
              </div>
            )}
          />
          <Controller
            name="agentId"
            control={control}
            render={({ field }) => <AgentSelectList agents={agents} value={field.value} onChange={field.onChange} />}
          />
        </div>
      </form>
    </Modal>
  );
}
