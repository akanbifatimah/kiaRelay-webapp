import { Controller, useForm } from "react-hook-form";
import { Modal } from "../../../components/Modal";
import { Button } from "../../../components/Button";
import { FormField } from "../../../components/FormField";
import { SwitchField } from "../../../components/SwitchField";
import { PayoutFrequencyOption, type PayoutFrequency } from "./PayoutFrequencyOption";
import { useFinanceSettings } from "../../settings/settingsStore";

interface ConfigurePayoutCycleFormValues {
  frequency: PayoutFrequency;
  nextPayoutDate: string;
  autoTaxWithholding: boolean;
}

interface ConfigurePayoutCycleModalProps {
  driverName: string;
  /** The driver's current frequency, if it's still offered. */
  current?: PayoutFrequency;
  onClose: () => void;
  onSave: (frequency: PayoutFrequency) => void;
}

// TODO: replace with a real PATCH /drivers/:id/payout-cycle once the
// Financial Management API exists.
export function ConfigurePayoutCycleModal({ driverName, current, onClose, onSave }: ConfigurePayoutCycleModalProps) {
  const { payoutOptions, payoutSchedule } = useFinanceSettings();
  const { control, handleSubmit } = useForm<ConfigurePayoutCycleFormValues>({
    defaultValues: { frequency: current && payoutOptions.includes(current) ? current : payoutSchedule, nextPayoutDate: "2026-10-23", autoTaxWithholding: true },
  });

  function onSubmit(values: ConfigurePayoutCycleFormValues) {
    onSave(values.frequency);
    onClose();
  }

  return (
    <Modal
      title="Configure Payout Cycle"
      subtitle={`Select how frequently ${driverName} receives payouts. Changes will take effect in the next billing period.`}
      onClose={onClose}
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={() => handleSubmit(onSubmit)()}>
            Save Configuration
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <Controller
          name="frequency"
          control={control}
          render={({ field }) => <PayoutFrequencyOption value={field.value} onChange={field.onChange} available={payoutOptions} />}
        />

        <div>
          <span className="text-label text-text-muted">Additional Settings</span>
          <div className="mt-2 flex flex-col gap-3">
            <FormField control={control} name="nextPayoutDate" label="Next Payout Date" type="date" />
            <SwitchField
              control={control}
              name="autoTaxWithholding"
              label="Automated Tax Withholding (1099-NEC Compliance Info)"
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}
