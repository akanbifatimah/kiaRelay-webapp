import { useState } from "react";
import { ShieldAlert, TriangleAlert } from "lucide-react";
import { useForm, useWatch, Controller } from "react-hook-form";
import { Modal } from "../../../components/Modal";
import { Button } from "../../../components/Button";
import { FormField } from "../../../components/FormField";
import { useToast } from "../../../components/toast/ToastContext";
import { AffectedOrdersList } from "./AffectedOrdersList";
import { SuspensionDurationToggle, type SuspensionDuration } from "./SuspensionDurationToggle";
import type { RecentOrder } from "../customerDetails";

interface SuspendAccountFormValues {
  reason: string;
  otherReason: string;
  reEvalDate: string;
  notes: string;
  notifyCustomer: boolean;
}

interface SuspendAccountModalProps {
  customerName: string;
  orders: RecentOrder[];
  onClose: () => void;
  onSuspended: () => void;
}

// TODO: replace with real POST /customers/:id/suspend once the Customer
// Management API exists.
export function SuspendAccountModal({ customerName, orders, onClose, onSuspended }: SuspendAccountModalProps) {
  const { showToast } = useToast();
  const [duration, setDuration] = useState<SuspensionDuration>("temporary");
  const { control, handleSubmit } = useForm<SuspendAccountFormValues>({
    defaultValues: { reason: "terms-violation", otherReason: "", reEvalDate: "", notes: "", notifyCustomer: false },
  });
  const reason = useWatch({ control, name: "reason" });

  function onSubmit() {
    showToast("success", `${customerName}'s account has been suspended.`);
    onSuspended();
  }

  return (
    <Modal
      title={
        <>
          <ShieldAlert className="h-5 w-5 text-danger" />
          Suspend Account
        </>
      }
      onClose={onClose}
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel Action
          </Button>
          <Button type="button" variant="danger" onClick={handleSubmit(onSubmit)}>
            Confirm Suspension
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-2 rounded-lg border border-warning/30 bg-warning/10 p-3 text-sm text-text">
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
          <p>Suspension will prevent the user from placing new orders and accessing their dashboard until the status is cleared.</p>
        </div>

        <FormField
          control={control}
          name="reason"
          label="Suspension Reason"
          type="select"
          options={[
            { value: "terms-violation", label: "Violation of Terms of Service" },
            { value: "non-payment", label: "Non-Payment / Billing Issue" },
            { value: "fraud-suspicion", label: "Suspected Fraud" },
            { value: "customer-request", label: "Customer Request" },
            { value: "other", label: "Other" },
          ]}
        />

        {reason === "other" && (
          <FormField
            control={control}
            name="otherReason"
            label="Reason Details"
            type="textarea"
            placeholder="Describe the reason for this suspension..."
            rules={{ required: "Please describe the reason" }}
          />
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <SuspensionDurationToggle value={duration} onChange={setDuration} />

          <FormField
            control={control}
            name="reEvalDate"
            label="Re-eval Date"
            type="date"
            readOnly={duration === "permanent"}
          />
        </div>

        <FormField
          control={control}
          name="notes"
          label="Internal Notes"
          type="textarea"
          placeholder="Detail the context of this suspension for other admins..."
        />

        <AffectedOrdersList orders={orders} />

        <Controller
          name="notifyCustomer"
          control={control}
          render={({ field: { value, onChange, ...field } }) => (
            <label className="flex items-center gap-2 text-sm text-text">
              <input
                {...field}
                type="checkbox"
                checked={value}
                onChange={(event) => onChange(event.target.checked)}
                className="h-4 w-4 rounded border-border"
              />
              Notify customer via email and SMS automatically
            </label>
          )}
        />
      </div>
    </Modal>
  );
}
