import { useState } from "react";
import { FileText, ZoomIn, ZoomOut, Printer, MoreHorizontal } from "lucide-react";
import { Card } from "../../../components/Card";
import { Button } from "../../../components/Button";
import { Avatar } from "../../../components/Avatar";
import { Tooltip } from "../../../components/Tooltip";
import { ConfirmModal } from "../../../components/ConfirmModal";
import type { CompanyVerificationDocument } from "../companyVerification";

interface DocumentReviewCardProps {
  doc: CompanyVerificationDocument;
  onApprove: () => void;
  onReject: () => void;
  onRequestNew: () => void;
}

const toolbarButtons = [
  { label: "Zoom in", icon: ZoomIn },
  { label: "Zoom out", icon: ZoomOut },
  { label: "Print", icon: Printer },
  { label: "More options", icon: MoreHorizontal },
];

export function DocumentReviewCard({ doc, onApprove, onReject, onRequestNew }: DocumentReviewCardProps) {
  const [isRejectConfirmOpen, setIsRejectConfirmOpen] = useState(false);

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" />
          <div>
            <p className="text-sm font-semibold text-text">{doc.name}</p>
            <p className="text-xs text-text-muted">
              {doc.fileId} • {doc.sizeLabel}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {toolbarButtons.map(({ label, icon: Icon }) => (
            <Tooltip key={label} label={label}>
              <button
                type="button"
                aria-label={label}
                className="rounded p-1.5 text-text-muted hover:bg-bg hover:text-text"
              >
                <Icon className="h-4 w-4" />
              </button>
            </Tooltip>
          ))}
        </div>
      </div>

      <div className="flex justify-center rounded-lg bg-bg p-6">
        <img src={doc.previewSrc} alt={doc.name} className="max-h-[28rem] w-auto rounded shadow-sm" />
      </div>

      <div className="grid grid-cols-2 gap-4 border-t border-border pt-4 sm:grid-cols-4">
        <div>
          <p className="text-label text-text-muted">Registration Number</p>
          <p className="mt-1 text-sm font-medium text-text">{doc.registrationNumber}</p>
        </div>
        <div>
          <p className="text-label text-text-muted">Submission Date</p>
          <p className="mt-1 text-sm font-medium text-text">{doc.submissionDate}</p>
        </div>
        <div>
          <p className="text-label text-text-muted">Reviewer</p>
          <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-text">
            <Avatar name={doc.reviewer} size="sm" />
            {doc.reviewer}
          </p>
        </div>
        <div>
          <p className="text-label text-text-muted">Last Updated</p>
          <p className="mt-1 text-sm font-medium text-text">{doc.lastUpdated}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2">
        <Button type="button" variant="danger" onClick={() => setIsRejectConfirmOpen(true)}>
          Reject Document
        </Button>
        <Button type="button" variant="secondary" onClick={onRequestNew}>
          Request New
        </Button>
        <Button type="button" variant="success" onClick={onApprove}>
          Approve & Verify
        </Button>
      </div>

      {isRejectConfirmOpen && (
        <ConfirmModal
          title="Reject this document?"
          message={`${doc.name} will be flagged as rejected and the company will be notified to resubmit it.`}
          confirmLabel="Reject Document"
          tone="danger"
          onConfirm={() => {
            setIsRejectConfirmOpen(false);
            onReject();
          }}
          onCancel={() => setIsRejectConfirmOpen(false)}
        />
      )}
    </Card>
  );
}
