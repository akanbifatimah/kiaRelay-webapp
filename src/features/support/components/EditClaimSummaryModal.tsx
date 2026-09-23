import { useForm } from "react-hook-form";
import { Modal } from "../../../components/Modal";
import { Button } from "../../../components/Button";
import { FormField } from "../../../components/FormField";
import type { ClaimInvestigation } from "../claimInvestigation";

export interface ClaimSummaryValues {
  incidentDescription: string;
  internalNotes: string;
}

interface EditClaimSummaryModalProps {
  claim: ClaimInvestigation;
  onClose: () => void;
  onSave: (values: ClaimSummaryValues) => void;
}

// No Figma reference for the summary's "Edit" link — edits only the two
// reviewer-authored fields. Customer Statement is the customer's own words
// and Reviewer/Resolution State are workflow-driven, so none are editable.
export function EditClaimSummaryModal({ claim, onClose, onSave }: EditClaimSummaryModalProps) {
  const { control, handleSubmit } = useForm<ClaimSummaryValues>({
    defaultValues: { incidentDescription: claim.incidentDescription, internalNotes: claim.internalNotes },
  });

  return (
    <Modal
      title="Edit Claim Summary"
      subtitle={claim.id}
      size="lg"
      onClose={onClose}
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="edit-claim-summary-form" variant="dark">
            Save Changes
          </Button>
        </>
      }
    >
      <form id="edit-claim-summary-form" onSubmit={handleSubmit(onSave)} className="flex flex-col gap-4">
        <FormField
          control={control}
          name="incidentDescription"
          label="Incident Description"
          type="textarea"
          rules={{ required: "Incident description can't be empty." }}
        />
        <FormField control={control} name="internalNotes" label="Internal Notes" type="textarea" placeholder="Visible to agents only..." />
      </form>
    </Modal>
  );
}
