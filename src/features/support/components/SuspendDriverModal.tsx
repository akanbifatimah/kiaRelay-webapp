import { useForm } from "react-hook-form";
import { ShieldOff } from "lucide-react";
import { Modal } from "../../../components/Modal";
import { Button } from "../../../components/Button";
import { FormField } from "../../../components/FormField";

const REASONS = ["Expired compliance document", "Safety violation", "Customer complaint under review", "Failed drug/alcohol test", "Other"];

interface SuspendDriverValues {
  reason: string;
  notes: string;
}

interface SuspendDriverModalProps {
  driverName: string;
  onClose: () => void;
  onSuspend: (reason: string) => void;
}

// The confirm step for Suspend (working rule 9) — a reason is required so the
// action is auditable, same idea as the customer-side SuspendAccountModal.
// TODO: POST /drivers/:id/suspend { reason, notes } once the API exists.
export function SuspendDriverModal({ driverName, onClose, onSuspend }: SuspendDriverModalProps) {
  const { control, handleSubmit } = useForm<SuspendDriverValues>({ defaultValues: { reason: "", notes: "" } });

  return (
    <Modal
      title={
        <>
          <ShieldOff className="h-5 w-5 text-danger" />
          Suspend {driverName}
        </>
      }
      subtitle="They won't be offered new loads until reinstated. Their active load stays assigned."
      onClose={onClose}
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="suspend-driver-form" variant="danger">
            Suspend Driver
          </Button>
        </>
      }
    >
      <form
        id="suspend-driver-form"
        onSubmit={handleSubmit((values) => onSuspend(values.notes.trim() ? `${values.reason} — ${values.notes.trim()}` : values.reason))}
        className="flex flex-col gap-4"
      >
        <FormField
          control={control}
          name="reason"
          label="Reason"
          type="select"
          options={[{ value: "", label: "Select a reason…" }, ...REASONS.map((value) => ({ value, label: value }))]}
          rules={{ required: "Choose a reason." }}
        />
        <FormField control={control} name="notes" label="Notes (optional)" type="textarea" placeholder="Context for the audit log…" />
      </form>
    </Modal>
  );
}
