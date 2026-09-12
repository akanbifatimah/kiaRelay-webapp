import { Warehouse } from "lucide-react";
import { useForm } from "react-hook-form";
import { Modal } from "../../../components/Modal";
import { Button } from "../../../components/Button";
import { FormField } from "../../../components/FormField";
import type { Branch } from "../companyBranches";

interface AddBranchFormValues {
  name: string;
  city: string;
  state: string;
  hubCode: string;
  primaryContact: string;
}

interface AddBranchModalProps {
  onClose: () => void;
  onAdd: (branch: Branch) => void;
}

// TODO: replace with real POST /customers/:id/branches once the Customer
// Management API exists — this only stores the new node in local page
// state, not persisted anywhere.
export function AddBranchModal({ onClose, onAdd }: AddBranchModalProps) {
  const { control, handleSubmit } = useForm<AddBranchFormValues>({
    defaultValues: { name: "", city: "", state: "", hubCode: "", primaryContact: "" },
  });

  function onSubmit(values: AddBranchFormValues) {
    onAdd({
      id: `br-new-${Date.now()}`,
      name: values.name,
      city: values.city,
      state: values.state,
      hubCode: values.hubCode || "—",
      primaryContact: values.primaryContact,
      operatorsActive: 0,
      liveOrders: 0,
      delivered: 0,
      ytdSpend: 0,
      teamNames: [],
      teamOverflow: 0,
    });
    onClose();
  }

  return (
    <Modal
      title={
        <>
          <Warehouse className="h-5 w-5 text-primary" />
          Add New Node
        </>
      }
      subtitle="Provision a new regional hub for this company's network."
      onClose={onClose}
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit(onSubmit)}>
            Add Branch
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <FormField control={control} name="name" label="Branch Name" placeholder="e.g. North Region Logistics" />
        <div className="grid grid-cols-2 gap-4">
          <FormField control={control} name="city" label="City" />
          <FormField control={control} name="state" label="State" />
        </div>
        <FormField control={control} name="hubCode" label="Hub Code" placeholder="e.g. Hub 05" />
        <FormField control={control} name="primaryContact" label="Primary Contact" />
      </div>
    </Modal>
  );
}
