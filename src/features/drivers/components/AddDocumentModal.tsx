import { useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Modal } from "../../../components/Modal";
import { Button } from "../../../components/Button";
import { FormField } from "../../../components/FormField";
import { DocumentDropZone } from "./DocumentDropZone";
import { documentTitles, type ComplianceDocument } from "../complianceDocuments";

interface AddDocumentFormValues {
  title: string;
  expiryDate: string;
}

interface AddDocumentModalProps {
  onClose: () => void;
  onAdd: (document: ComplianceDocument) => void;
}

function formatExpiryLabel(isoDate: string): string {
  if (!isoDate) return "No expiry set";
  const date = new Date(`${isoDate}T00:00:00`);
  return `Expires: ${date.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" })}`;
}

// TODO: replace with a real POST /drivers/:id/documents upload once the
// Compliance Management API exists — the file never leaves the browser here.
// File selection is local useState rather than a Controller field: FormField
// has no "file" type, and a File object doesn't fit its controlled-string
// value model.
export function AddDocumentModal({ onClose, onAdd }: AddDocumentModalProps) {
  const { control, handleSubmit } = useForm<AddDocumentFormValues>({
    defaultValues: { title: documentTitles[0], expiryDate: "" },
  });
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  // The one URL actually submitted is exempted from revocation — it becomes
  // the new document's thumbnail, so revoking it on close would immediately
  // break that image.
  const committedUrlRef = useRef<string | null>(null);
  const expiryDate = useWatch({ control, name: "expiryDate" });

  // Object URL creation/revocation happens directly in the event that
  // changed the file, not in an effect — avoids an extra render pass and
  // keeps cleanup tied to the exact moment the previous URL stops being used.
  function applyFile(newFile: File | null) {
    if (previewUrl && previewUrl !== committedUrlRef.current) URL.revokeObjectURL(previewUrl);
    setFile(newFile);
    setPreviewUrl(newFile ? URL.createObjectURL(newFile) : null);
  }

  function handleClose() {
    if (previewUrl && previewUrl !== committedUrlRef.current) URL.revokeObjectURL(previewUrl);
    onClose();
  }

  function onSubmit(values: AddDocumentFormValues) {
    committedUrlRef.current = previewUrl;
    onAdd({
      id: `doc-${Date.now()}`,
      title: values.title,
      thumbnail: previewUrl ?? "/Background.svg",
      expiryLabel: formatExpiryLabel(values.expiryDate),
      expiryUrgent: false,
      uploadedBy: "Alex Mercer",
      status: "pending",
      actions: ["view", "approve", "reject"],
    });
    onClose();
  }

  return (
    <Modal
      title="Add Document"
      onClose={handleClose}
      footer={
        <>
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="button" onClick={() => handleSubmit(onSubmit)()}>
            Add Document
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <FormField
          control={control}
          name="title"
          label="Document Type"
          type="select"
          options={documentTitles.map((title) => ({ value: title, label: title }))}
        />
        <FormField control={control} name="expiryDate" label="Expiry Date" type="date" />
        <DocumentDropZone
          previewUrl={previewUrl}
          fileName={file?.name}
          onFileSelected={applyFile}
          onRemove={() => applyFile(null)}
        />
        {!expiryDate && (
          <p className="text-xs text-text-muted">No expiry date set — this document won't be flagged for renewal.</p>
        )}
      </div>
    </Modal>
  );
}
