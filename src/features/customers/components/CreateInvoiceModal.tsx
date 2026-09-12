import { FileText } from "lucide-react";
import { useForm } from "react-hook-form";
import { Modal } from "../../../components/Modal";
import { Button } from "../../../components/Button";
import { FormField } from "../../../components/FormField";
import type { Invoice } from "../companyInvoices";

interface CreateInvoiceFormValues {
  orderRef: string;
  branch: string;
  date: string;
  dueDate: string;
  amount: string;
}

interface CreateInvoiceModalProps {
  branchOptions: string[];
  onClose: () => void;
  onCreate: (invoice: Invoice) => void;
}

// Native <input type="date"> values arrive as "yyyy-mm-dd" — reformat to
// match every other date string in this feature ("Oct 24, 2023").
function formatDateInput(value: string): string {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// TODO: replace with real POST /customers/:id/invoices once the Customer
// Management / billing API exists. Fields mirror InvoicesTable's own
// columns (Order Ref/Branch/Date/Due Date/Amount) rather than inventing an
// unrelated shape, since this is meant to add a row to that same table.
export function CreateInvoiceModal({ branchOptions, onClose, onCreate }: CreateInvoiceModalProps) {
  const { control, handleSubmit } = useForm<CreateInvoiceFormValues>({
    defaultValues: { orderRef: "", branch: branchOptions[0] ?? "", date: "", dueDate: "", amount: "" },
  });

  function onSubmit(values: CreateInvoiceFormValues) {
    const today = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    onCreate({
      id: `INV-${Math.floor(10000 + Math.random() * 89999)}`,
      orderRef: values.orderRef,
      branch: values.branch,
      date: values.date ? formatDateInput(values.date) : today,
      dueDate: values.dueDate ? formatDateInput(values.dueDate) : today,
      amount: values.amount.startsWith("$") ? values.amount : `$${values.amount}`,
      status: "pending",
    });
    onClose();
  }

  return (
    <Modal
      title={
        <>
          <FileText className="h-5 w-5 text-primary" />
          Create Invoice
        </>
      }
      onClose={onClose}
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit(onSubmit)}>
            Create Invoice
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          control={control}
          name="orderRef"
          label="Order Ref"
          placeholder="ORD-2050-A"
          rules={{ required: "Order reference is required" }}
        />
        <FormField
          control={control}
          name="branch"
          label="Branch"
          type="select"
          options={branchOptions.map((branch) => ({ value: branch, label: branch }))}
        />
        <FormField control={control} name="date" label="Invoice Date" type="date" />
        <FormField control={control} name="dueDate" label="Due Date" type="date" />
        <FormField
          control={control}
          name="amount"
          label="Amount"
          placeholder="0.00"
          rules={{ required: "Amount is required" }}
        />
      </div>
    </Modal>
  );
}
