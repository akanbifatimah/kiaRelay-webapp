import { FileText } from "lucide-react";
import { useForm } from "react-hook-form";
import { Modal } from "../../../components/Modal";
import { Button } from "../../../components/Button";
import { FormField } from "../../../components/FormField";
import type { FinanceInvoice } from "../companyInvoicesOverview";

interface GenerateInvoiceFormValues {
  company: string;
  periodLabel: string;
  amount: string;
  dueDate: string;
}

interface GenerateInvoiceModalProps {
  onClose: () => void;
  onCreate: (invoice: FinanceInvoice) => void;
}

function formatDateInput(value: string): string {
  if (!value) return new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// TODO: replace with real POST /finance/invoices once the Financial
// Management API exists.
export function GenerateInvoiceModal({ onClose, onCreate }: GenerateInvoiceModalProps) {
  const { control, handleSubmit } = useForm<GenerateInvoiceFormValues>({
    defaultValues: { company: "", periodLabel: "", amount: "", dueDate: "" },
  });

  function onSubmit(values: GenerateInvoiceFormValues) {
    const company = values.company.trim();
    if (!company) return;
    onCreate({
      id: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 8999)}`,
      company,
      periodLabel: values.periodLabel.trim() || "—",
      amount: Number(values.amount) || 0,
      status: "sent",
      dueDate: formatDateInput(values.dueDate),
    });
    onClose();
  }

  return (
    <Modal
      title={
        <>
          <FileText className="h-5 w-5 text-primary" />
          Generate New Invoice
        </>
      }
      onClose={onClose}
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={() => handleSubmit(onSubmit)()}>
            Generate Invoice
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <FormField control={control} name="company" label="Company Name" rules={{ required: "Company is required" }} />
        <FormField control={control} name="periodLabel" label="Billing Period" placeholder="e.g. Nov 01 - Nov 15" />
        <FormField control={control} name="amount" label="Amount" placeholder="0.00" rules={{ required: "Amount is required" }} />
        <FormField control={control} name="dueDate" label="Due Date" type="date" />
      </div>
    </Modal>
  );
}
