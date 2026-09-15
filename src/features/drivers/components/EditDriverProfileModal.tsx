import { UserPen } from "lucide-react";
import { useForm } from "react-hook-form";
import { Modal } from "../../../components/Modal";
import { Button } from "../../../components/Button";
import { FormField } from "../../../components/FormField";
import type { DriverDetail } from "../driverDetails";

interface EditDriverProfileFormValues {
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface EditDriverProfileModalProps {
  detail: DriverDetail;
  onClose: () => void;
  onSave: (updates: Pick<DriverDetail, "name" | "contact">) => void;
}

// TODO: replace with real PATCH /drivers/:id once the Driver Management API
// exists. Fields mirror what ContactInformationCard actually displays as
// editable — the same modal opens from both that card's edit icon and the
// profile header's "Edit Profile" button, exact precedent:
// EditCustomerProfileModal.
export function EditDriverProfileModal({ detail, onClose, onSave }: EditDriverProfileModalProps) {
  const { control, handleSubmit } = useForm<EditDriverProfileFormValues>({
    defaultValues: {
      name: detail.name,
      email: detail.contact.email,
      phone: detail.contact.phone,
      address: detail.contact.address,
    },
  });

  function onSubmit(values: EditDriverProfileFormValues) {
    onSave({
      name: values.name,
      contact: { email: values.email, phone: values.phone, address: values.address },
    });
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
          <Button type="button" onClick={() => handleSubmit(onSubmit)()}>
            Save Changes
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <FormField control={control} name="name" label="Full Name" rules={{ required: "Name is required" }} />
        <FormField control={control} name="email" label="Email Address" rules={{ required: "Email is required" }} />
        <FormField control={control} name="phone" label="Phone Number" />
        <FormField control={control} name="address" label="Mailing Address" />
      </div>
    </Modal>
  );
}
