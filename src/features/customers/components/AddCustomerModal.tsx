import { UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { Modal } from "../../../components/Modal";
import { Button } from "../../../components/Button";
import { FormField } from "../../../components/FormField";
import type { Customer, CustomerAccountType } from "../data";

interface AddCustomerFormValues {
  name: string;
  email: string;
  phone: string;
}

interface AddCustomerModalProps {
  accountType: CustomerAccountType;
  onClose: () => void;
  onAdd: (customer: Customer) => void;
}

function initials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

// TODO: replace with real POST /customers once the Customer Management
// API exists.
export function AddCustomerModal({ accountType, onClose, onAdd }: AddCustomerModalProps) {
  const { control, handleSubmit } = useForm<AddCustomerFormValues>({
    defaultValues: { name: "", email: "", phone: "" },
  });

  function onSubmit(values: AddCustomerFormValues) {
    const name = values.name.trim();
    if (!name) return;

    onAdd({
      id: `KR-${Math.floor(10000 + Math.random() * 89999)}-${initials(name) || "NA"}`,
      name,
      accountType,
      status: "active",
      verification: "pending",
      orders: 0,
      lastActivity: "Just now",
    });
    onClose();
  }

  return (
    <Modal
      title={
        <>
          <UserPlus className="h-5 w-5 text-primary" />
          Add {accountType === "individual" ? "Individual" : "Company"} Customer
        </>
      }
      onClose={onClose}
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit(onSubmit)}>
            Add Customer
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <FormField
          control={control}
          name="name"
          label={accountType === "individual" ? "Full Name" : "Company Name"}
          rules={{ required: "This field is required" }}
        />
        <FormField
          control={control}
          name="email"
          label={accountType === "individual" ? "Email" : "Contact Email"}
          type="text"
          rules={{ required: "This field is required" }}
        />
        <FormField
          control={control}
          name="phone"
          label={accountType === "individual" ? "Phone" : "Contact Phone"}
        />
      </div>
    </Modal>
  );
}
