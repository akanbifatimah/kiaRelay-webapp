import { Landmark } from "lucide-react";
import { useForm } from "react-hook-form";
import { Modal } from "../../../components/Modal";
import { Button } from "../../../components/Button";
import { FormField } from "../../../components/FormField";
import { useToast } from "../../../components/toast/ToastContext";
import type { BillingTermsDetail } from "../companyInvoices";

interface EditBillingTermsFormValues {
  cycle: string;
  contactName: string;
  contactEmail: string;
  addressDetail: string;
  deliveryMethod: string;
}

interface EditBillingTermsModalProps {
  terms: BillingTermsDetail;
  onClose: () => void;
  onUpdated: (terms: BillingTermsDetail) => void;
}

// TODO: replace with real PATCH /customers/:id/billing-terms once the
// Customer Management / billing API exists.
export function EditBillingTermsModal({ terms, onClose, onUpdated }: EditBillingTermsModalProps) {
  const { showToast } = useToast();
  const { control, handleSubmit } = useForm<EditBillingTermsFormValues>({
    defaultValues: {
      cycle: terms.cycle,
      contactName: terms.contactName,
      contactEmail: terms.contactEmail,
      addressDetail: terms.addressDetail,
      deliveryMethod: terms.deliveryMethod,
    },
  });

  function onSubmit(values: EditBillingTermsFormValues) {
    onUpdated({ ...terms, ...values });
    showToast("success", "Billing terms have been updated.");
    onClose();
  }

  return (
    <Modal
      title={
        <>
          <Landmark className="h-5 w-5 text-primary" />
          Edit Billing Terms
        </>
      }
      onClose={onClose}
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit(onSubmit)}>
            Save Changes
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <FormField
          control={control}
          name="cycle"
          label="Billing Cycle"
          type="select"
          options={[
            { value: "Monthly", label: "Monthly" },
            { value: "Bi-Weekly", label: "Bi-Weekly" },
            { value: "Weekly", label: "Weekly" },
          ]}
        />
        <FormField control={control} name="contactName" label="Billing Contact" />
        <FormField control={control} name="contactEmail" label="Contact Email" />
        <FormField control={control} name="addressDetail" label="Billing Address" />
        <FormField
          control={control}
          name="deliveryMethod"
          label="Invoice Delivery"
          type="select"
          options={[
            { value: "Automated Email (PDF)", label: "Automated Email (PDF)" },
            { value: "Portal Only", label: "Portal Only" },
          ]}
        />
      </div>
    </Modal>
  );
}
