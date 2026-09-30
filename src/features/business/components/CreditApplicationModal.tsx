import { useForm } from "react-hook-form";
import { FileSignature } from "lucide-react";
import { Modal } from "../../../components/Modal";
import { Button } from "../../../components/Button";
import { FormField } from "../../../components/FormField";
import type { CreditApplication } from "../businessTypes";

interface CreditApplicationModalProps {
  value?: CreditApplication;
  onClose: () => void;
  onSave: (application: CreditApplication) => void;
}

const EMPTY: CreditApplication = { requestedLimit: "", annualRevenue: "", yearsInBusiness: "", bankName: "", bankContact: "", tradeReference: "" };
const amount = (value: unknown) => /^\$?\d[\d,]*(\.\d{1,2})?$/.test(String(value)) || "Enter an amount, e.g. 25,000.";

// "+ Add Credit App" had no design (2026-09-29): first-pass form with what
// underwriting needs for Net-30 terms. Same fields as the mobile sheet.
// TODO: POST /business/credit-application once the API exists.
export function CreditApplicationModal({ value, onClose, onSave }: CreditApplicationModalProps) {
  const { control, handleSubmit } = useForm<CreditApplication>({ defaultValues: value ?? EMPTY, mode: "onTouched" });

  const save = handleSubmit((values) => {
    onSave(values);
    onClose();
  });

  return (
    <Modal
      title={
        <>
          <FileSignature className="h-5 w-5 text-primary" />
          Credit Application
        </>
      }
      subtitle="Optional: apply for Net-30 invoice terms. Not required for standard billing."
      size="lg"
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={save}>{value ? "Update Credit Application" : "Add Credit Application"}</Button>
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField control={control} name="requestedLimit" label="Requested Credit Limit (USD) *" placeholder="25,000" rules={{ required: "Enter the limit you need.", validate: amount }} />
        <FormField control={control} name="annualRevenue" label="Annual Revenue (USD) *" placeholder="1,200,000" rules={{ required: "Enter annual revenue.", validate: amount }} />
        <FormField
          control={control}
          name="yearsInBusiness"
          label="Years in Business *"
          placeholder="5"
          rules={{ required: "Enter years in business.", pattern: { value: /^\d{1,3}$/, message: "Whole years only." } }}
        />
        <FormField control={control} name="bankName" label="Bank Name *" placeholder="e.g. Chase" rules={{ required: "Enter your bank." }} />
        <div className="sm:col-span-2">
          <FormField control={control} name="bankContact" label="Bank Contact (name & phone)" placeholder="Optional" />
        </div>
        <div className="sm:col-span-2">
          <FormField control={control} name="tradeReference" label="Trade Reference *" type="textarea" placeholder="Supplier name, contact and phone" rules={{ required: "Add at least one trade reference." }} />
        </div>
      </div>
    </Modal>
  );
}
