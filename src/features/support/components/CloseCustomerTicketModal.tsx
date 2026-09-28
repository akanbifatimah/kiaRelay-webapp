import { useForm, useWatch } from "react-hook-form";
import { Modal } from "../../../components/Modal";
import { Button } from "../../../components/Button";
import { FormField } from "../../../components/FormField";
import { SwitchField } from "../../../components/SwitchField";
import type { SupportTicket } from "../types";

interface CloseCustomerTicketModalProps {
  ticket: SupportTicket;
  onClose: () => void;
  /** message = what the customer receives; undefined = close silently. */
  onConfirm: (message: string | undefined) => void;
}

interface CloseValues {
  notify: boolean;
  message: string;
}

// Lead Support's final step (TC-16, Workflow A step 5 / Workflow B step 5):
// close a resolved ticket and notify the customer. For tickets fixed by
// Technical Support the message is prefilled from their verified resolution.
export function CloseCustomerTicketModal({ ticket, onClose, onConfirm }: CloseCustomerTicketModalProps) {
  const fix = ticket.techResolution?.note;
  const { control, handleSubmit } = useForm<CloseValues>({
    defaultValues: {
      notify: !ticket.internal,
      message: `Hi ${ticket.customer}, your issue "${ticket.subject}" has been resolved.${fix ? ` Our technical team found the cause: ${fix}` : ""} Reply to this ticket if anything else comes up.`,
    },
  });
  const notify = useWatch({ control, name: "notify" });

  return (
    <Modal
      title={fix ? "Notify customer & close" : "Close ticket"}
      subtitle={`#${ticket.id} · ${ticket.subject}`}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit((values) => onConfirm(values.notify ? values.message.trim() : undefined))}>{notify ? "Send & Close" : "Close Ticket"}</Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        {fix && (
          <div className="rounded-lg bg-bg p-3 text-sm">
            <p className="text-label text-text-muted">Verified by {ticket.techResolution?.by} (Technical Support)</p>
            <p className="mt-1 text-text">{fix}</p>
          </div>
        )}
        <SwitchField control={control} name="notify" label={`Notify ${ticket.customer}`} />
        {notify && (
          <FormField control={control} name="message" label="Message to the customer" type="textarea" rules={{ validate: (v) => String(v).trim().length > 0 || "Write the message the customer receives." }} />
        )}
      </div>
    </Modal>
  );
}
