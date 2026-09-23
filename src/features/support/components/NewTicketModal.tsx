import { useForm } from "react-hook-form";
import { Modal } from "../../../components/Modal";
import { Button } from "../../../components/Button";
import { FormField } from "../../../components/FormField";
import { categoryLabels, priorityLabels, type TicketCategory, type TicketPriority } from "../types";

export interface NewTicketValues {
  subject: string;
  customer: string;
  category: TicketCategory;
  priority: TicketPriority;
  description: string;
}

interface NewTicketModalProps {
  /** Pre-fills and locks Customer — e.g. Customer Support View's "Create Ticket". */
  customer?: string;
  onClose: () => void;
  onCreate: (values: NewTicketValues) => void;
}

const toOptions = (labels: Record<string, string>) =>
  Object.entries(labels).map(([value, label]) => ({ value, label }));

// No Figma reference for this modal — fields are the minimum My Tickets'
// own columns need to render the new row (Customer/Category/Priority),
// plus a description for the first message in its conversation.
export function NewTicketModal({ customer, onClose, onCreate }: NewTicketModalProps) {
  const { control, handleSubmit } = useForm<NewTicketValues>({
    defaultValues: { subject: "", customer: customer ?? "", category: "support", priority: "medium", description: "" },
  });

  return (
    <Modal
      title="New Ticket"
      subtitle="Log a ticket on a customer's behalf — it's assigned to you."
      onClose={onClose}
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="new-ticket-form" variant="dark">
            Create Ticket
          </Button>
        </>
      }
    >
      <form id="new-ticket-form" onSubmit={handleSubmit(onCreate)} className="flex flex-col gap-4">
        <FormField control={control} name="subject" label="Subject" placeholder="e.g. Delivery delayed at hub" rules={{ required: "Subject is required" }} />
        <FormField
          control={control}
          name="customer"
          label="Customer"
          placeholder="Customer or company name"
          readOnly={Boolean(customer)}
          rules={{ required: "Customer is required" }}
        />
        <div className="grid grid-cols-2 gap-3">
          <FormField control={control} name="category" label="Category" type="select" options={toOptions(categoryLabels)} />
          <FormField control={control} name="priority" label="Priority" type="select" options={toOptions(priorityLabels)} />
        </div>
        <FormField control={control} name="description" label="Description" type="textarea" placeholder="What does the customer need?" />
      </form>
    </Modal>
  );
}
