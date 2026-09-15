import { useState } from "react";
import { History, RefreshCw, Plus } from "lucide-react";
import { Card } from "../../../components/Card";
import { Button } from "../../../components/Button";
import { useToast } from "../../../components/toast/ToastContext";
import { BackgroundVerificationCard } from "./BackgroundVerificationCard";
import { ComplianceDocumentRow } from "./ComplianceDocumentRow";
import { AddDocumentModal } from "./AddDocumentModal";
import {
  complianceDocuments as initialDocuments,
  portfolioMeta,
  type ComplianceDocument,
  type DocAction,
} from "../complianceDocuments";

const actionResult: Record<DocAction, { status?: "approved" | "pending"; message: (title: string) => string }> = {
  view: { message: (title) => `Opening ${title}.` },
  flag: { message: (title) => `${title} flagged for review.` },
  approveNow: { status: "approved", message: (title) => `${title} approved.` },
  approve: { status: "approved", message: (title) => `${title} approved.` },
  reject: { status: "pending", message: (title) => `${title} rejected — awaiting a new upload.` },
  requestUpdate: { message: (title) => `Update requested for ${title}.` },
  fullReport: { message: (title) => `Opening full report for ${title}.` },
};

interface DocumentsSectionProps {
  onViewHistory: () => void;
}

export function DocumentsSection({ onViewHistory }: DocumentsSectionProps) {
  const { showToast } = useToast();
  const [documents, setDocuments] = useState<ComplianceDocument[]>(initialDocuments);
  const [isAddOpen, setIsAddOpen] = useState(false);

  function handleAction(document: ComplianceDocument, action: DocAction) {
    const result = actionResult[action];
    if (result.status) {
      setDocuments((prev) => prev.map((doc) => (doc.id === document.id ? { ...doc, status: result.status! } : doc)));
    }
    showToast(action === "reject" ? "error" : "success", result.message(document.title));
  }

  return (
    <div className="flex flex-col gap-6">
      <BackgroundVerificationCard />

      <Card className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold text-text">Compliance Portfolio</h2>
            <p className="text-xs text-text-muted">
              {portfolioMeta.totalMandatory} Mandatory Documents · Last scan {portfolioMeta.lastScanLabel}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* This driver already has a real, full Activity Log tab — reuse
                it instead of building a second document-scoped history view
                (same precedent as VerificationHistoryCard linking into the
                existing Support & Audit Log tab). */}
            <Button variant="secondary" size="sm" onClick={onViewHistory}>
              <History className="h-4 w-4" />
              History
            </Button>
            <Button variant="dark" size="sm" onClick={() => showToast("success", "Rescanning all documents.")}>
              <RefreshCw className="h-4 w-4" />
              Refresh All
            </Button>
          </div>
        </div>

        <div className="flex flex-col">
          {documents.map((document) => (
            <ComplianceDocumentRow key={document.id} document={document} onAction={handleAction} />
          ))}
        </div>

        <button
          type="button"
          onClick={() => setIsAddOpen(true)}
          className="flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border py-4 text-sm font-medium text-text-muted hover:border-primary hover:text-primary"
        >
          <Plus className="h-4 w-4" />
          Add Document
        </button>
      </Card>

      {isAddOpen && (
        <AddDocumentModal
          onClose={() => setIsAddOpen(false)}
          onAdd={(document) => {
            setDocuments((prev) => [document, ...prev]);
            showToast("success", `${document.title} added — pending review.`);
          }}
        />
      )}
    </div>
  );
}
