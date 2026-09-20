import { Settings2, Search } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { Modal } from "../../../components/Modal";
import { Button } from "../../../components/Button";
import { FormField } from "../../../components/FormField";
import type { PayoutSchedule } from "../payoutSchedules";

interface PolicyFormValues {
  policyName: string;
  paymentFrequency: string;
  paymentDay: string;
  cutOffDay: string;
  cutOffTime: string;
}

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const cutOffOffsets: Record<string, number> = { "Same Day": 0, "1 Day Before Payment": 1, "2 Days Before Payment": 2 };
const sampleAssignees = [
  { id: "DRV-1", name: "Carlos Mendez", fleetLabel: "Fleet ID: TX-0892 · Express Van" },
  { id: "DRV-2", name: "Sarah Jenkins", fleetLabel: "Fleet ID: TX-9832 · Heavy Truck" },
];

function cutOffBannerText(paymentDay: string, cutOffDay: string): string {
  const offset = cutOffOffsets[cutOffDay] ?? 0;
  const paymentIndex = dayNames.indexOf(paymentDay);
  const cutOffDayName = dayNames[(paymentIndex - offset + 7) % 7];
  return `Orders completed after ${cutOffDayName} of 11:59 PM will be carried over to the next ${paymentDay} cycle.`;
}

interface CreateEditPayoutPolicyModalProps {
  schedule?: PayoutSchedule;
  onClose: () => void;
  onSubmit: (schedule: PayoutSchedule) => void;
}

// TODO: replace with real POST/PUT /finance/payout-schedules once the
// Financial Management API exists. Cut-off day/time and driver assignment
// aren't stored on PayoutSchedule today (mock model only tracks what the
// grid displays) — this form still collects them for a faithful UI, they
// just don't persist onto the resulting card yet.
export function CreateEditPayoutPolicyModal({ schedule, onClose, onSubmit }: CreateEditPayoutPolicyModalProps) {
  const { control, handleSubmit } = useForm<PolicyFormValues>({
    defaultValues: {
      policyName: schedule?.name ?? "",
      paymentFrequency: "Weekly",
      paymentDay: "Friday",
      cutOffDay: "1 Day Before Payment",
      cutOffTime: "11:59 PM",
    },
  });
  const paymentDay = useWatch({ control, name: "paymentDay" });
  const cutOffDay = useWatch({ control, name: "cutOffDay" });

  function submit(values: PolicyFormValues) {
    const name = values.policyName.trim();
    if (!name) return;
    onSubmit({
      id: schedule?.id ?? `SCH-CUSTOM-${Math.floor(1000 + Math.random() * 8999)}`,
      name,
      frequency: schedule?.frequency ?? "custom",
      description: `${values.paymentFrequency} payouts on ${values.paymentDay}s.`,
      driverCount: schedule?.driverCount ?? 0,
      nextPayoutDate: schedule?.nextPayoutDate,
      isGlobalDefault: schedule?.isGlobalDefault ?? false,
      isActive: schedule?.isActive ?? true,
    });
    onClose();
  }

  return (
    <Modal
      size="lg"
      title={
        <>
          <Settings2 className="h-5 w-5 text-primary" />
          Create/Edit Payout Policy
        </>
      }
      onClose={onClose}
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={() => handleSubmit(submit)()}>
            Save Policy
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <p className="text-label text-primary">01 General Settings</p>
          <FormField control={control} name="policyName" label="Policy Name" placeholder="e.g. Express Driver Daily - Texas Region" rules={{ required: "Policy name is required" }} />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <FormField control={control} name="paymentFrequency" label="Payment Frequency" type="select" options={["Daily", "Weekly", "Bi-Weekly", "Monthly"].map((v) => ({ value: v, label: v }))} />
            <FormField control={control} name="paymentDay" label="Payment Day" type="select" options={dayNames.map((v) => ({ value: v, label: v }))} />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-label text-primary">02 Earnings Cut-off</p>
          <p className="text-xs text-text-muted">Define when the calculation window ends for each payment cycle.</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <FormField control={control} name="cutOffDay" label="Cut-off Day" type="select" options={Object.keys(cutOffOffsets).map((v) => ({ value: v, label: v }))} />
            <FormField control={control} name="cutOffTime" label="Cut-off Time" type="select" options={["11:59 PM", "6:00 PM", "Noon"].map((v) => ({ value: v, label: v }))} />
          </div>
          <p className="rounded-lg bg-tag-info-bg px-3 py-2 text-xs text-tag-info-fg">{cutOffBannerText(paymentDay, cutOffDay)}</p>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-label text-primary">03 Driver &amp; Fleet Assignment</p>
          <div className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2">
            <Search className="h-4 w-4 text-text-muted" />
            <input placeholder="Search drivers, fleet IDs, or vehicle types…" className="w-full bg-transparent text-sm text-text placeholder:text-text-muted focus:outline-none" />
          </div>
          <div className="flex max-h-40 flex-col gap-1 overflow-y-auto">
            {sampleAssignees.map((assignee, index) => (
              <label key={assignee.id} className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-bg">
                <input type="checkbox" defaultChecked={index === 0} className="h-4 w-4 accent-primary" />
                <span>
                  <p className="text-sm font-medium text-text">{assignee.name}</p>
                  <p className="text-xs text-text-muted">{assignee.fleetLabel}</p>
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
