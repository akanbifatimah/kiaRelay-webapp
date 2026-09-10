import { useState } from "react";
import { CreditCard, TriangleAlert } from "lucide-react";
import { useForm } from "react-hook-form";
import { Modal } from "../../../components/Modal";
import { Button } from "../../../components/Button";
import { FormField } from "../../../components/FormField";
import { useToast } from "../../../components/toast/ToastContext";
import { cn } from "../../../lib/cn";
import type { CreditTerms } from "../customerDetails";

interface EditCreditTermsFormValues {
  creditLimit: number;
  paymentTerms: CreditTerms["paymentTerms"];
  interestRate: number;
}

type AccountStatus = CreditTerms["accountStatus"];

const STATUS_OPTIONS: { value: AccountStatus; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "review-required", label: "Review Required" },
];

interface EditCreditTermsModalProps {
  customerName: string;
  terms: CreditTerms;
  onClose: () => void;
  onUpdated: () => void;
}

// TODO: replace with real PATCH /customers/:id/credit-terms once the
// Customer Management / billing API exists.
export function EditCreditTermsModal({ customerName, terms, onClose, onUpdated }: EditCreditTermsModalProps) {
  const { showToast } = useToast();
  const [accountStatus, setAccountStatus] = useState<AccountStatus>(terms.accountStatus);
  const { control, handleSubmit, watch } = useForm<EditCreditTermsFormValues>({
    defaultValues: {
      creditLimit: terms.creditLimit,
      paymentTerms: terms.paymentTerms,
      interestRate: terms.interestRate,
    },
  });

  const watchedLimit = watch("creditLimit");
  const utilization = watchedLimit > 0 ? terms.outstandingBalance / watchedLimit : 0;
  const isOverLimit = terms.outstandingBalance > watchedLimit;
  const isNearLimit = !isOverLimit && utilization >= 0.8;

  function onSubmit() {
    showToast("success", `${customerName}'s credit terms have been updated.`);
    onUpdated();
  }

  return (
    <Modal
      title={
        <>
          <CreditCard className="h-5 w-5 text-primary" />
          Edit Credit Terms
        </>
      }
      subtitle={customerName}
      onClose={onClose}
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose}>
            Discard
          </Button>
          <Button type="button" onClick={handleSubmit(onSubmit)}>
            Update Terms
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        {(isOverLimit || isNearLimit) && (
          <div className="flex items-start gap-2 rounded-lg border border-warning/30 bg-warning/5 p-3 text-sm text-warning">
            <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
            <p>
              {isOverLimit
                ? `Outstanding balance ($${terms.outstandingBalance.toLocaleString()}) exceeds the credit limit entered.`
                : `Outstanding balance is at ${Math.round(utilization * 100)}% of the credit limit entered.`}
            </p>
          </div>
        )}

        <FormField control={control} name="creditLimit" label="Credit Limit ($)" type="number" />

        <FormField
          control={control}
          name="paymentTerms"
          label="Payment Terms"
          type="select"
          options={[
            { value: "net-15", label: "Net 15" },
            { value: "net-30", label: "Net 30" },
            { value: "net-45", label: "Net 45" },
            { value: "net-60", label: "Net 60" },
          ]}
        />

        <FormField control={control} name="interestRate" label="Interest Rate (%)" type="number" />

        <div className="flex flex-col gap-1.5 text-sm">
          <span className="text-text-muted">Account Status</span>
          <div className="flex gap-2">
            {STATUS_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setAccountStatus(option.value)}
                className={cn(
                  "flex-1 rounded-full border px-3 py-1.5 text-sm font-medium",
                  accountStatus === option.value
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-surface text-text hover:bg-bg",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
