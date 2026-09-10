import { useState } from "react";
import { ShieldAlert, TriangleAlert } from "lucide-react";
import { useForm } from "react-hook-form";
import { Modal } from "../../../components/Modal";
import { Button } from "../../../components/Button";
import { FormField } from "../../../components/FormField";
import { useToast } from "../../../components/toast/ToastContext";
import { cn } from "../../../lib/cn";

interface SuspendAccountFormValues {
  reason: string;
  notes: string;
}

type SuspensionDuration = "24h" | "7d" | "indefinite";

const DURATION_OPTIONS: { value: SuspensionDuration; label: string }[] = [
  { value: "24h", label: "24 Hours" },
  { value: "7d", label: "7 Days" },
  { value: "indefinite", label: "Indefinite" },
];

interface SuspendAccountModalProps {
  customerName: string;
  onClose: () => void;
  onSuspended: () => void;
}

// TODO: replace with real POST /customers/:id/suspend once the Customer
// Management API exists.
export function SuspendAccountModal({ customerName, onClose, onSuspended }: SuspendAccountModalProps) {
  const { showToast } = useToast();
  const [duration, setDuration] = useState<SuspensionDuration>("24h");
  const { control, handleSubmit } = useForm<SuspendAccountFormValues>({
    defaultValues: { reason: "policy-violation", notes: "" },
  });

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
      subtitle={customerName}
      onClose={onClose}
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose}>
            Go Back
          </Button>
          <Button type="button" variant="danger" onClick={handleSubmit(onSubmit)}>
            Confirm Suspension
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-2 rounded-lg border border-danger/30 bg-danger/5 p-3 text-sm text-danger">
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            Suspending this account immediately revokes access. The customer will be notified and cannot place new
            orders until reinstated.
          </p>
        </div>

        <FormField
          control={control}
          name="reason"
          label="Reason for Suspension"
          type="select"
          options={[
            { value: "policy-violation", label: "Policy Violation" },
            { value: "payment-issue", label: "Payment Issue" },
            { value: "fraud-suspicion", label: "Suspected Fraud" },
            { value: "customer-request", label: "Customer Request" },
            { value: "other", label: "Other" },
          ]}
        />

        <div className="flex flex-col gap-1.5 text-sm">
          <span className="text-text-muted">Suspension Duration</span>
          <div className="flex gap-2">
            {DURATION_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setDuration(option.value)}
                className={cn(
                  "flex-1 rounded-full border px-3 py-1.5 text-sm font-medium",
                  duration === option.value
                    ? "border-danger bg-danger text-white"
                    : "border-border bg-surface text-text hover:bg-bg",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <FormField
          control={control}
          name="notes"
          label="Internal Notes"
          type="textarea"
          placeholder="Add any additional context for this suspension..."
        />
      </div>
    </Modal>
  );
}
