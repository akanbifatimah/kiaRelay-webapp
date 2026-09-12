import { UserPen } from "lucide-react";
import { useForm } from "react-hook-form";
import { Modal } from "../../../components/Modal";
import { Button } from "../../../components/Button";
import { FormField } from "../../../components/FormField";
import type { CustomerDetail } from "../customerDetails";

interface EditCustomerProfileFormValues {
  name: string;
  fullName: string;
  email: string;
  phone: string;
}

interface EditCustomerProfileModalProps {
  detail: CustomerDetail;
  onClose: () => void;
  onSave: (updates: Pick<CustomerDetail, "name" | "fullName" | "email" | "phone">) => void;
}

// TODO: replace with real PATCH /customers/:id once the Customer
// Management API exists. Fields mirror what CustomerInfoCard actually
// displays as editable profile info — the same modal opens from both that
// card's "Edit" link and the profile header's "Edit Profile" button rather
// than each getting its own.
export function EditCustomerProfileModal({ detail, onClose, onSave }: EditCustomerProfileModalProps) {
  const { control, handleSubmit } = useForm<EditCustomerProfileFormValues>({
    defaultValues: {
      name: detail.name,
      fullName: detail.fullName,
      email: detail.email,
      phone: detail.phone,
    },
  });

  function onSubmit(values: EditCustomerProfileFormValues) {
    onSave(values);
    onClose();
  }

  return (
    <Modal
      title={
        <>
          <UserPen className="h-5 w-5 text-primary" />
          Edit Profile
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
          name="name"
          label="Preferred Name"
          rules={{ required: "Preferred name is required" }}
        />
        <FormField control={control} name="fullName" label="Full Legal Name" />
        <FormField
          control={control}
          name="email"
          label="Email Address"
          rules={{ required: "Email is required" }}
        />
        <FormField control={control} name="phone" label="Phone Number" />
      </div>
    </Modal>
  );
}
