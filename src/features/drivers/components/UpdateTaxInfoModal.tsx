import { useForm } from "react-hook-form";
import { Modal } from "../../../components/Modal";
import { Button } from "../../../components/Button";
import { FormField } from "../../../components/FormField";
import { SwitchField } from "../../../components/SwitchField";

interface TaxInfoFormValues {
  taxId: string;
  mailingAddress: string;
  w9OnFile: boolean;
}

interface UpdateTaxInfoModalProps {
  driverName: string;
  onClose: () => void;
  onSave: () => void;
}

// TODO: replace with a real PATCH /drivers/:id/tax-info once the Financial
// Management API exists.
export function UpdateTaxInfoModal({ driverName, onClose, onSave }: UpdateTaxInfoModalProps) {
  const { control, handleSubmit } = useForm<TaxInfoFormValues>({
    defaultValues: { taxId: "", mailingAddress: "", w9OnFile: false },
  });

  function onSubmit() {
    onSave();
    onClose();
  }

  return (
    <Modal
      title="Update Tax Info"
      subtitle={`1099-NEC filing details for ${driverName}.`}
      onClose={onClose}
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={() => handleSubmit(onSubmit)()}>
            Save Tax Info
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <FormField
          control={control}
          name="taxId"
          label="Tax ID / EIN"
          placeholder="XX-XXXXXXX"
          rules={{ required: "Tax ID is required" }}
        />
        <FormField control={control} name="mailingAddress" label="Mailing Address (for 1099-NEC)" />
        <SwitchField control={control} name="w9OnFile" label="W-9 Form on File" />
      </div>
    </Modal>
  );
}
