import { useForm } from "react-hook-form";
import { Modal } from "../../../components/Modal";
import { Button } from "../../../components/Button";
import { FormField } from "../../../components/FormField";
import { REASON_COPY, type ReasonAction } from "../workflowActions";
import type { SupportTicket } from "../types";

interface WorkflowReasonModalProps {
  ticket: SupportTicket;
  action: ReasonAction;
  onClose: () => void;
  onConfirm: (text: string) => void;
}

// One modal for every workflow step that needs a written reason or note
// (request/approve/decline escalation, resolve, verify, reopen) — TC-16.
// The note lands on the ticket's thread as its audit trail.
export function WorkflowReasonModal({ ticket, action, onClose, onConfirm }: WorkflowReasonModalProps) {
  const copy = REASON_COPY[action];
  const { control, handleSubmit } = useForm<{ text: string }>({ defaultValues: { text: "" } });
  const context = action === "escalate" ? ticket.escalationRequest : undefined;

  return (
    <Modal
      title={copy.title}
      subtitle={`#${ticket.id} · ${ticket.subject}`}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant={action === "reopen" || action === "decline" ? "danger" : "primary"} onClick={handleSubmit((values) => onConfirm(values.text.trim()))}>
            {copy.confirm}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        {context && (
          <div className="rounded-lg bg-bg p-3 text-sm">
            <p className="text-label text-text-muted">Request from {context.by}</p>
            <p className="mt-1 text-text">{context.reason}</p>
          </div>
        )}
        {action === "verify" && ticket.escalation && !ticket.internal && (
          <p className="rounded-lg bg-bg p-3 text-xs text-text-muted">
            Closing sends this ticket back to Lead Support, who notifies {ticket.customer} and closes it on their side.
          </p>
        )}
        <FormField
          control={control}
          name="text"
          label={copy.label}
          type="textarea"
          placeholder={copy.placeholder}
          rules={{ validate: (value) => String(value).trim().length >= 5 || "Add a few words so the next person has context." }}
        />
      </div>
    </Modal>
  );
}
