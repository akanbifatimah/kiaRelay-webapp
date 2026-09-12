import { Pencil } from "lucide-react";
import { useForm } from "react-hook-form";
import { Modal } from "../../../components/Modal";
import { Button } from "../../../components/Button";
import { FormField } from "../../../components/FormField";
import type { Branch } from "../companyBranches";

interface EditBranchFormValues {
  name: string;
  city: string;
  state: string;
  hubCode: string;
  primaryContact: string;
}

interface EditBranchModalProps {
  branch: Branch;
  onClose: () => void;
  onSave: (branch: Branch) => void;
}

// TODO: replace with real PATCH /customers/:id/branches/:branchId once the
// Customer Management API exists.
export function EditBranchModal({ branch, onClose, onSave }: EditBranchModalProps) {
  const { control, handleSubmit } = useForm<EditBranchFormValues>({
    defaultValues: {
      name: branch.name,
      city: branch.city,
      state: branch.state,
      hubCode: branch.hubCode,
      primaryContact: branch.primaryContact,
    },
  });

  function onSubmit(values: EditBranchFormValues) {
    onSave({ ...branch, ...values });
    onClose();
  }

  return (
    <Modal
      title={
        <>
          <Pencil className="h-5 w-5 text-primary" />
          Edit Branch
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
        <FormField control={control} name="name" label="Branch Name" />
        <div className="grid grid-cols-2 gap-4">
          <FormField control={control} name="city" label="City" />
          <FormField control={control} name="state" label="State" />
        </div>
        <FormField control={control} name="hubCode" label="Hub Code" />
        <FormField control={control} name="primaryContact" label="Primary Contact" />
      </div>
    </Modal>
  );
}
