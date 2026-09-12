import { CreditCard } from "lucide-react";
import { useForm } from "react-hook-form";
import { Modal } from "../../../components/Modal";
import { Button } from "../../../components/Button";
import { FormField } from "../../../components/FormField";
import type { InvoiceDetail } from "../invoiceDetail";

interface EditInvoiceBillingDetailsFormValues {
  billingAddress: string;
  taxId: string;
  paymentMethodLabel: string;
  termsLabel: string;
}

interface EditInvoiceBillingDetailsModalProps {
  detail: InvoiceDetail;
  onClose: () => void;
  onSave: (detail: InvoiceDetail) => void;
}

// TODO: replace with real PATCH /invoices/:id once the Customer
// Management / billing API exists. Only the fields InvoiceBillingInfoCard
// actually displays are editable here (address, tax ID, payment method,
// terms) — line items and totals are computed from the order, not
// hand-edited on an invoice.
export function EditInvoiceBillingDetailsModal({ detail, onClose, onSave }: EditInvoiceBillingDetailsModalProps) {
  const { control, handleSubmit } = useForm<EditInvoiceBillingDetailsFormValues>({
    defaultValues: {
      billingAddress: detail.billingAddress,
      taxId: detail.taxId,
      paymentMethodLabel: detail.paymentMethodLabel,
      termsLabel: detail.termsLabel,
    },
  });

  function onSubmit(values: EditInvoiceBillingDetailsFormValues) {
    onSave({ ...detail, ...values });
    onClose();
  }

  return (
    <Modal
      title={
        <>
          <CreditCard className="h-5 w-5 text-primary" />
          Edit Billing Details
        </>
      }
      subtitle={`Invoice #${detail.id}`}
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
        <FormField control={control} name="billingAddress" label="Billing Address" type="textarea" />
        <FormField control={control} name="taxId" label="Tax ID" />
        <FormField control={control} name="paymentMethodLabel" label="Payment Method" />
        <FormField control={control} name="termsLabel" label="Terms" />
      </div>
    </Modal>
  );
}
