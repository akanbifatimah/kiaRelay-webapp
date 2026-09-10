import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { Modal } from "./Modal";
import { Button } from "./Button";
import { ConfirmModal } from "./ConfirmModal";
import { useToast } from "./toast/ToastContext";
import { DocumentPreviewCard } from "./DocumentPreviewCard";
import { ComplianceChecklist } from "./ComplianceChecklist";
import type { IdVerificationCase } from "../types/identityVerification";
import { cn } from "../lib/cn";

export interface ChecklistFormValues {
  checks: boolean[];
}

interface IdVerificationReviewModalProps {
  caseData: IdVerificationCase;
  onClose: () => void;
  onApprove?: () => void;
  onReject?: () => void;
}

function OcrRow({ label, value, urgent }: { label: string; value: string; urgent?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-border py-2 text-sm last:border-0">
      <span className="text-text-muted">{label}</span>
      <span className={cn("font-medium text-text", urgent && "text-danger")}>{value}</span>
    </div>
  );
}

// Shared by Driver Onboarding and Customer Management (ID verification review) —
// see src/types/identityVerification.ts. TODO: replace with real
// POST /verification/:id/approve|reject once the Compliance API exists.
export function IdVerificationReviewModal({ caseData, onClose, onApprove, onReject }: IdVerificationReviewModalProps) {
  const { showToast } = useToast();
  const [isRejectConfirmOpen, setIsRejectConfirmOpen] = useState(false);
  const { control } = useForm<ChecklistFormValues>({
    defaultValues: { checks: caseData.checklist.map((item) => item.checked) },
  });

  function handleApprove() {
    showToast("success", `${caseData.subjectName}'s identity approved.`);
    onApprove?.();
    onClose();
  }

  function handleRejectConfirmed() {
    showToast("error", `${caseData.subjectName}'s ID was rejected.`);
    setIsRejectConfirmOpen(false);
    onReject?.();
    onClose();
  }

  return (
    <>
      <Modal
        title={
          <>
            <ShieldCheck className="h-5 w-5 text-primary" />
            ID Verification Review
          </>
        }
        headerActions={
          <span className="text-badge rounded-full bg-tag-warning-bg px-3 py-1 text-tag-warning-fg">
            Pending Review
          </span>
        }
        size="lg"
        onClose={onClose}
        footer={
          <>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="button" variant="danger" onClick={() => setIsRejectConfirmOpen(true)}>
              Reject ID
            </Button>
            <Button type="button" variant="success" onClick={handleApprove}>
              Approve Identity
            </Button>
          </>
        }
      >
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-text">Submitted Documents</h3>
            <DocumentPreviewCard src={caseData.frontImage} alt="Front of ID" filename="FRONT_ID.JPG" />
            <DocumentPreviewCard src={caseData.backImage} alt="Back of ID" filename="BACK_ID.JPG" />
          </div>
          <div className="flex flex-col gap-5">
            <div>
              <h3 className="mb-1 text-sm font-semibold text-text">OCR Extraction Data</h3>
              <OcrRow label="Full Name" value={caseData.fullName} />
              <OcrRow label="Date of Birth" value={caseData.dateOfBirth} />
              <OcrRow label="ID Number" value={caseData.idNumber} />
              <OcrRow label="Expiry Date" value={caseData.expiryLabel} urgent={caseData.expiryUrgent} />
            </div>
            <div>
              <h3 className="mb-2 text-sm font-semibold text-text">Compliance Checklist</h3>
              <ComplianceChecklist control={control} labels={caseData.checklist.map((item) => item.label)} />
            </div>
          </div>
        </div>
      </Modal>

      {isRejectConfirmOpen && (
        <ConfirmModal
          title="Reject this ID?"
          message={`${caseData.subjectName}'s submission will be flagged and they'll be notified to resubmit documents.`}
          confirmLabel="Reject ID"
          tone="danger"
          onConfirm={handleRejectConfirmed}
          onCancel={() => setIsRejectConfirmOpen(false)}
        />
      )}
    </>
  );
}
