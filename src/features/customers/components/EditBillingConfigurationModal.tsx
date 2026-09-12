import { Landmark } from "lucide-react";
import { useForm } from "react-hook-form";
import { Modal } from "../../../components/Modal";
import { Button } from "../../../components/Button";
import { FormField } from "../../../components/FormField";
import { SwitchField } from "../../../components/SwitchField";
import { useToast } from "../../../components/toast/ToastContext";
import type { CompanyBillingConfig } from "../companyOverview";
import type { PaymentTerms } from "../customerDetails";

interface EditBillingConfigurationModalProps {
  config: CompanyBillingConfig;
  onClose: () => void;
  onSave: (config: CompanyBillingConfig) => void;
}

// TODO: replace with real PATCH /customers/:id/billing-config once the
// Customer Management / billing API exists. Company-only — individual
// accounts pay as you go via PaymentMethodsPage and have no billing
// configuration to set.
export function EditBillingConfigurationModal({ config, onClose, onSave }: EditBillingConfigurationModalProps) {
  const { showToast } = useToast();
  const { control, handleSubmit } = useForm<CompanyBillingConfig>({ defaultValues: config });

  function onSubmit(values: CompanyBillingConfig) {
    // `nextInvoiceDate` isn't an editable field here (not part of this
    // form), so merge onto the original config rather than the bare
    // react-hook-form values, which would otherwise drop it.
    onSave({ ...config, ...values });
    showToast("success", "Billing configuration saved.");
    onClose();
  }

  return (
    <Modal
      title={
        <>
          <Landmark className="h-5 w-5 text-primary" />
          Billing Configuration
        </>
      }
      onClose={onClose}
      footer={
        <Button type="button" onClick={handleSubmit(onSubmit)}>
          Save Configuration
        </Button>
      }
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          control={control}
          name="billingMethod"
          label="Billing Method"
          type="select"
          options={[
            { value: "Monthly Invoice", label: "Monthly Invoice" },
            { value: "Prepaid Balance", label: "Prepaid Balance" },
            { value: "Purchase Order", label: "Purchase Order" },
          ]}
        />
        <FormField control={control} name="billingContactName" label="Billing Contact Name" />

        <FormField
          control={control}
          name="paymentTerms"
          label="Payment Terms"
          type="select"
          options={
            [
              { value: "net-15", label: "Net 15" },
              { value: "net-30", label: "Net 30" },
              { value: "net-45", label: "Net 45" },
              { value: "net-60", label: "Net 60" },
            ] satisfies { value: PaymentTerms; label: string }[]
          }
        />
        <FormField control={control} name="email" label="Email" />

        <FormField
          control={control}
          name="invoiceFrequency"
          label="Invoice Frequency"
          type="select"
          options={[
            { value: "Weekly", label: "Weekly" },
            { value: "Monthly", label: "Monthly" },
            { value: "Quarterly", label: "Quarterly" },
          ]}
        />
        <FormField control={control} name="phone" label="Phone" />

        <FormField control={control} name="taxId" label="Tax ID (EIN)" />
        <div className="flex items-end pb-2">
          <SwitchField control={control} name="taxExempt" label="Tax Exempt" />
        </div>
      </div>
    </Modal>
  );
}
