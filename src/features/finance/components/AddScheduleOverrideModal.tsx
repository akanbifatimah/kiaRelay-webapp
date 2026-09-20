import { UserCog } from "lucide-react";
import { useForm } from "react-hook-form";
import { Modal } from "../../../components/Modal";
import { Button } from "../../../components/Button";
import { FormField } from "../../../components/FormField";
import { payoutSchedules, type DriverOverride } from "../payoutSchedules";

interface OverrideFormValues {
  subjectName: string;
  subjectIdLabel: string;
  scheduleId: string;
}

interface AddScheduleOverrideModalProps {
  override?: DriverOverride;
  onClose: () => void;
  onSubmit: (override: DriverOverride) => void;
}

// TODO: replace with real POST/PUT /finance/payout-schedules/overrides once
// the Financial Management API exists.
export function AddScheduleOverrideModal({ override, onClose, onSubmit }: AddScheduleOverrideModalProps) {
  const { control, handleSubmit } = useForm<OverrideFormValues>({
    defaultValues: {
      subjectName: override?.subjectName ?? "",
      subjectIdLabel: override?.subjectIdLabel ?? "",
      scheduleId: override?.currentScheduleId ?? payoutSchedules[0].id,
    },
  });

  function submit(values: OverrideFormValues) {
    const subjectName = values.subjectName.trim();
    if (!subjectName) return;
    const today = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    onSubmit({
      id: override?.id ?? `OVR-${Math.floor(1000 + Math.random() * 8999)}`,
      subjectName,
      subjectIdLabel: values.subjectIdLabel.trim() || "—",
      subjectKind: override?.subjectKind ?? "driver",
      currentScheduleId: values.scheduleId,
      effectiveSince: override?.effectiveSince ?? today,
      nextPayoutLabel: override?.nextPayoutLabel ?? "Pending",
    });
    onClose();
  }

  return (
    <Modal
      title={
        <>
          <UserCog className="h-5 w-5 text-primary" />
          {override ? "Edit Schedule Override" : "Add Schedule Override"}
        </>
      }
      onClose={onClose}
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={() => handleSubmit(submit)()}>
            {override ? "Save Override" : "Add Override"}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <FormField control={control} name="subjectName" label="Driver / Fleet Name" rules={{ required: "This field is required" }} />
        <FormField control={control} name="subjectIdLabel" label="Driver / Fleet ID" placeholder="e.g. DRV-9921-TX" />
        <FormField
          control={control}
          name="scheduleId"
          label="Schedule"
          type="select"
          options={payoutSchedules.map((s) => ({ value: s.id, label: s.name }))}
        />
      </div>
    </Modal>
  );
}
