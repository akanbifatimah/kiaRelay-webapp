import { useForm } from "react-hook-form";
import { UserRoundPlus } from "lucide-react";
import { Modal } from "../../../components/Modal";
import { Button } from "../../../components/Button";
import { FormField } from "../../../components/FormField";
import { unitAgents } from "../agents";
import { priorityLabels, type SupportTicket, type TicketPriority } from "../types";

interface WorkflowAssignModalProps {
  ticket: SupportTicket;
  onClose: () => void;
  onAssign: (assigneeId: string, priority: TicketPriority, instructions: string) => void;
}

interface AssignValues {
  assigneeId: string;
  priority: TicketPriority;
  instructions: string;
}

// Lead Support assigns to Support Staff; Lead Technical assigns to Technical
// Support Staff with a priority (TC-16). The lists come from real team
// members in those roles, so a user added in User Management shows up here.
export function WorkflowAssignModal({ ticket, onClose, onAssign }: WorkflowAssignModalProps) {
  const technical = ticket.queue === "technical";
  const agents = unitAgents(technical ? ["tech-staff", "lead-tech"] : ["support-staff", "lead-support"]);
  const { control, handleSubmit } = useForm<AssignValues>({
    defaultValues: { assigneeId: ticket.assigneeId && agents.some((a) => a.id === ticket.assigneeId) ? ticket.assigneeId : "", priority: ticket.priority, instructions: "" },
  });

  return (
    <Modal
      title={
        <>
          <UserRoundPlus className="h-5 w-5 text-primary" />
          {ticket.assigneeId ? "Reassign" : "Assign"} #{ticket.id}
        </>
      }
      subtitle={ticket.subject}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit((values) => onAssign(values.assigneeId, values.priority, values.instructions.trim()))}>Assign</Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <FormField
          control={control}
          name="assigneeId"
          label={technical ? "Technical Support Staff" : "Support Staff"}
          type="select"
          options={[{ value: "", label: "Choose a team member..." }, ...agents.map((a) => ({ value: a.id, label: `${a.name} — ${a.role} (${a.openTickets} open)` }))]}
          rules={{ required: "Choose who works this ticket." }}
        />
        <FormField control={control} name="priority" label="Priority" type="select" options={Object.entries(priorityLabels).map(([value, label]) => ({ value, label }))} />
        <FormField control={control} name="instructions" label="Instructions (optional)" type="textarea" placeholder="Context or next steps for the assignee..." />
        {agents.length === 0 && <p className="text-xs text-danger">No active team members hold this role yet. Add one in User Management.</p>}
      </div>
    </Modal>
  );
}
