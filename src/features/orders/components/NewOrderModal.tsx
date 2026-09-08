import { useForm } from "react-hook-form";
import { Modal } from "../../../components/Modal";
import { Button } from "../../../components/Button";
import { useToast } from "../../../components/toast/ToastContext";
import { NewOrderFormFields, type NewOrderFormValues } from "./NewOrderFormFields";

const defaultValues: NewOrderFormValues = {
  customerName: "",
  accountNumber: "ACC-7822-QD",
  pickupAddress: "",
  dropoffAddress: "",
  pickupWindow: "",
  priorityType: "standard",
  cargoType: "general",
  estimatedWeightKg: "",
  handlingInstructions: "",
};

interface NewOrderModalProps {
  onClose: () => void;
}

// TODO: replace with POST /orders (draft or finalize) once the Order
// Monitoring API exists.
export function NewOrderModal({ onClose }: NewOrderModalProps) {
  const { showToast } = useToast();
  const { control, handleSubmit } = useForm<NewOrderFormValues>({ defaultValues });

  function submit(values: NewOrderFormValues, action: "draft" | "finalize") {
    showToast(
      "success",
      action === "draft"
        ? "Order saved as draft."
        : `Order created for ${values.customerName || "customer"}.`,
    );
    onClose();
  }

  return (
    <Modal
      title="Create New Dispatch Order"
      subtitle="Configure shipment details and assign driver routing."
      size="lg"
      onClose={onClose}
      footer={
        <>
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel Request
          </Button>
          <Button type="button" variant="outline" onClick={handleSubmit((v) => submit(v, "draft"))}>
            Save as Draft
          </Button>
          <Button type="button" onClick={handleSubmit((v) => submit(v, "finalize"))}>
            Assign &amp; Finalize
          </Button>
        </>
      }
    >
      <NewOrderFormFields control={control} />
    </Modal>
  );
}
