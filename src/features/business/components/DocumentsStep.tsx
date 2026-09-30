import { useState } from "react";
import { CheckCircle2, FileSignature, Plus } from "lucide-react";
import { Button } from "../../../components/Button";
import { BUSINESS_DOCUMENTS } from "../businessDocuments";
import type { BusinessDocumentKey, CreditApplication, UploadedDocument } from "../businessTypes";
import { DocumentUploadTile } from "./DocumentUploadTile";
import { CreditApplicationModal } from "./CreditApplicationModal";

type Documents = Partial<Record<BusinessDocumentKey, UploadedDocument>>;

interface DocumentsStepProps {
  documents: Documents;
  onDocumentsChange: (documents: Documents) => void;
  creditApplication?: CreditApplication;
  onCreditApplicationChange: (application: CreditApplication) => void;
  submitting: boolean;
  onSubmit: () => void;
}

// Step 3, "Documents": all three documents are required, and the credit
// application is optional. Submitting creates the pending company account.
export function DocumentsStep({ documents, onDocumentsChange, creditApplication, onCreditApplicationChange, submitting, onSubmit }: DocumentsStepProps) {
  const [showErrors, setShowErrors] = useState(false);
  const [creditOpen, setCreditOpen] = useState(false);
  const missing = BUSINESS_DOCUMENTS.filter((doc) => !documents[doc.key]);

  function submit() {
    if (missing.length > 0) return setShowErrors(true);
    onSubmit();
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-xl font-bold text-text">Business verification</h2>
        <p className="mt-1 text-sm text-text-muted">Company accounts require business verification before invoice billing can be activated.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {BUSINESS_DOCUMENTS.map((doc) => (
          <DocumentUploadTile
            key={doc.key}
            title={doc.title}
            description={doc.description}
            icon={doc.icon}
            value={documents[doc.key]}
            onChange={(file) => onDocumentsChange({ ...documents, [doc.key]: file })}
            hasError={showErrors && !documents[doc.key]}
          />
        ))}
        <div className="flex flex-col gap-3 rounded-(--radius-card) border border-border bg-surface p-4">
          <div className="flex gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-field text-navy-brand">
              {creditApplication ? <CheckCircle2 className="h-5 w-5 text-success" /> : <FileSignature className="h-5 w-5" />}
            </span>
            <div>
              <p className="font-semibold text-text">Credit Application (Optional)</p>
              <p className="text-sm text-text-muted">
                {creditApplication ? `Requested limit: $${creditApplication.requestedLimit.replace(/^\$/, "")}` : "Complete this to apply for Net-30 invoice terms. Not required for standard billing."}
              </p>
            </div>
          </div>
          <button type="button" onClick={() => setCreditOpen(true)} className="flex h-10 w-fit items-center gap-2 rounded-lg border border-border px-4 text-sm font-semibold text-text hover:bg-bg">
            <Plus className="h-4 w-4" />
            {creditApplication ? "Edit Credit App" : "Add Credit App"}
          </button>
        </div>
      </div>
      {showErrors && missing.length > 0 && <p className="text-sm text-danger">Upload {missing.map((doc) => doc.title).join(", ")} to submit.</p>}
      <Button className="self-end" onClick={submit} disabled={submitting}>
        {submitting ? "Submitting..." : "Submit Application"}
      </Button>
      {creditOpen && <CreditApplicationModal value={creditApplication} onClose={() => setCreditOpen(false)} onSave={onCreditApplicationChange} />}
    </div>
  );
}
