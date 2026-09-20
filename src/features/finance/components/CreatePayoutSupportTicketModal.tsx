import { LifeBuoy } from "lucide-react";
import { useForm } from "react-hook-form";
import { Modal } from "../../../components/Modal";
import { Button } from "../../../components/Button";
import { FormField } from "../../../components/FormField";

interface TicketFormValues {
  subject: string;
  priority: "low" | "medium" | "high" | "critical";
  description: string;
}

interface CreatePayoutSupportTicketModalProps {
  payoutId: string;
  onClose: () => void;
  onCreate: (ticketId: string) => void;
}

// TODO: replace with real POST /finance/payouts/:id/tickets once a Finance-
// scoped support ticket API exists. Same "real action, no dedicated inbox
// to land in yet" precedent as MessageDriverModal (drivers) and
// CreateTicketModal (customers), which this mirrors field-for-field.
export function CreatePayoutSupportTicketModal({ payoutId, onClose, onCreate }: CreatePayoutSupportTicketModalProps) {
  const { control, handleSubmit } = useForm<TicketFormValues>({
    defaultValues: { subject: "", priority: "medium", description: "" },
  });

  function onSubmit(values: TicketFormValues) {
    const subject = values.subject.trim();
    if (!subject) return;
    onCreate(`#TK-${payoutId.slice(-4)}${Math.floor(100 + Math.random() * 900)}`);
    onClose();
  }

  return (
    <Modal
      title={
        <>
          <LifeBuoy className="h-5 w-5 text-primary" />
          Create Support Ticket
        </>
      }
      onClose={onClose}
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={() => handleSubmit(onSubmit)()}>
            Create Ticket
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <FormField
          control={control}
          name="subject"
          label="Subject"
          placeholder={`Regarding payout ${payoutId}`}
          rules={{ required: "Subject is required" }}
        />
        <FormField
          control={control}
          name="priority"
          label="Priority"
          type="select"
          options={[
            { value: "low", label: "Low" },
            { value: "medium", label: "Medium" },
            { value: "high", label: "High" },
            { value: "critical", label: "Critical" },
          ]}
        />
        <FormField control={control} name="description" label="Description" type="textarea" />
      </div>
    </Modal>
  );
}
