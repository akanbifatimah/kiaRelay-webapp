import { PenLine } from "lucide-react";
import { useForm } from "react-hook-form";
import { Modal } from "../../../components/Modal";
import { Button } from "../../../components/Button";
import { FormField } from "../../../components/FormField";
import type { OnDemandRequest } from "../driverPayoutsOverview";

interface ManualEntryFormValues {
  driverName: string;
  amount: string;
  note: string;
}

interface ManualPayoutEntryModalProps {
  onClose: () => void;
  onCreate: (request: OnDemandRequest) => void;
}

// TODO: replace with real POST /finance/payouts/on-demand once the
// Financial Management API exists.
export function ManualPayoutEntryModal({ onClose, onCreate }: ManualPayoutEntryModalProps) {
  const { control, handleSubmit } = useForm<ManualEntryFormValues>({
    defaultValues: { driverName: "", amount: "", note: "" },
  });

  function onSubmit(values: ManualEntryFormValues) {
    const driverName = values.driverName.trim();
    if (!driverName) return;
    onCreate({
      id: `OD-${Math.floor(4000 + Math.random() * 999)}`,
      driverName,
      note: values.note.trim() || "Manual entry — no delivery record attached",
      amount: Number(values.amount) || 0,
      urgent: false,
    });
    onClose();
  }

  return (
    <Modal
      title={
        <>
          <PenLine className="h-5 w-5 text-primary" />
          Manual Payout Entry
        </>
      }
      onClose={onClose}
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={() => handleSubmit(onSubmit)()}>
            Add Entry
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <FormField control={control} name="driverName" label="Driver Name" rules={{ required: "Driver is required" }} />
        <FormField control={control} name="amount" label="Amount" placeholder="0.00" rules={{ required: "Amount is required" }} />
        <FormField control={control} name="note" label="Note" placeholder="Reason for manual entry" />
      </div>
    </Modal>
  );
}
