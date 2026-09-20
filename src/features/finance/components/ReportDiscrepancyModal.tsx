import { useForm } from "react-hook-form";
import { Modal } from "../../../components/Modal";
import { Button } from "../../../components/Button";
import { FormField } from "../../../components/FormField";

interface ReportDiscrepancyFormValues {
  details: string;
}

interface ReportDiscrepancyModalProps {
  transactionId: string;
  onClose: () => void;
  onSubmitReport: (details: string) => void;
}

// Mirrors AddNoteModal's shape — real local "report filed" outcome, not a stub.
export function ReportDiscrepancyModal({ transactionId, onClose, onSubmitReport }: ReportDiscrepancyModalProps) {
  const { control, handleSubmit } = useForm<ReportDiscrepancyFormValues>({ defaultValues: { details: "" } });

  function onSubmit(values: ReportDiscrepancyFormValues) {
    const details = values.details.trim();
    if (!details) return;
    onSubmitReport(details);
    onClose();
  }

  return (
    <Modal
      title="Report Discrepancy"
      subtitle={`Flag ${transactionId} for finance review.`}
      onClose={onClose}
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" variant="danger" onClick={() => handleSubmit(onSubmit)()}>
            Submit Report
          </Button>
        </>
      }
    >
      <FormField
        control={control}
        name="details"
        label="What looks wrong?"
        type="textarea"
        placeholder="Describe the discrepancy…"
        rules={{ required: "This field is required" }}
      />
    </Modal>
  );
}
