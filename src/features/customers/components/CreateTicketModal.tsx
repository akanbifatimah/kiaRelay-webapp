import { LifeBuoy } from "lucide-react";
import { useForm } from "react-hook-form";
import { Modal } from "../../../components/Modal";
import { Button } from "../../../components/Button";
import { FormField } from "../../../components/FormField";
import type { SupportTicket, TicketPriority } from "../supportTickets";

interface CreateTicketFormValues {
  subject: string;
  priority: TicketPriority;
  description: string;
}

interface CreateTicketModalProps {
  customerId: string;
  onClose: () => void;
  onCreate: (ticket: SupportTicket) => void;
}

// TODO: replace with real POST /customers/:id/tickets once the Support
// module API exists.
export function CreateTicketModal({ customerId, onClose, onCreate }: CreateTicketModalProps) {
  const { control, handleSubmit } = useForm<CreateTicketFormValues>({
    defaultValues: { subject: "", priority: "medium", description: "" },
  });

  function onSubmit(values: CreateTicketFormValues) {
    const now = new Date();
    onCreate({
      id: `#TK-${customerId.slice(-4)}${Math.floor(Math.random() * 900 + 100)}`,
      subject: values.subject || "Untitled ticket",
      status: "open",
      priority: values.priority,
      createdDate: now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      createdTime: now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
      lastUpdate: "Just now",
      agent: "Unassigned",
    });
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
          <Button type="button" onClick={handleSubmit(onSubmit)}>
            Create Ticket
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <FormField control={control} name="subject" label="Subject" rules={{ required: "Subject is required" }} />
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
