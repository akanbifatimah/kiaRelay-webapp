import { Flag, FileSearch, AlertTriangle } from "lucide-react";
import { Button } from "../../../components/Button";
import { Tooltip } from "../../../components/Tooltip";
import { DocumentStatusBadge } from "./DocumentStatusBadge";
import type { ComplianceDocument, DocAction } from "../complianceDocuments";

interface ComplianceDocumentRowProps {
  document: ComplianceDocument;
  onAction: (document: ComplianceDocument, action: DocAction) => void;
}

// Each row's action set is data-driven (document.actions) instead of one
// hardcoded button group, since the 7 mock rows each show a different
// combination (view+flag / approveNow+reject / requestUpdate / fullReport /
// view+approve+reject).
export function ComplianceDocumentRow({ document, onAction }: ComplianceDocumentRowProps) {
  return (
    <div className="flex flex-col gap-3 border-b border-border py-3 last:border-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <img src={document.thumbnail} alt={document.title} className="h-12 w-16 rounded-md border border-border object-cover" />
        <div>
          <p className="text-sm font-semibold text-text">{document.title}</p>
          <p className={document.expiryUrgent ? "flex items-center gap-1 text-xs text-danger" : "text-xs text-text-muted"}>
            {document.expiryUrgent && <AlertTriangle className="h-3 w-3" />}
            {document.expiryLabel}
          </p>
          <p className="text-xs text-text-muted">
            {document.uploadedBy ? `Uploaded by ${document.uploadedBy}` : document.note}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 sm:pl-4">
        <DocumentStatusBadge status={document.status} />
        {document.actions.map((action) => {
          if (action === "flag") {
            return (
              <Tooltip key={action} label="Flag document">
                <button
                  type="button"
                  aria-label="Flag document"
                  onClick={() => onAction(document, action)}
                  className="text-text-muted hover:text-danger"
                >
                  <Flag className="h-4 w-4" />
                </button>
              </Tooltip>
            );
          }
          if (action === "view") {
            return (
              <Button key={action} variant="secondary" size="sm" onClick={() => onAction(document, action)}>
                View Detail
              </Button>
            );
          }
          if (action === "approveNow" || action === "approve") {
            return (
              <Button key={action} size="sm" onClick={() => onAction(document, action)}>
                {action === "approveNow" ? "Approve Now" : "Approve"}
              </Button>
            );
          }
          if (action === "reject") {
            return (
              <button
                key={action}
                type="button"
                onClick={() => onAction(document, action)}
                className="text-sm font-medium text-danger hover:underline"
              >
                Reject
              </button>
            );
          }
          if (action === "requestUpdate") {
            return (
              <Button key={action} variant="dark" size="sm" onClick={() => onAction(document, action)}>
                Request Update
              </Button>
            );
          }
          return (
            <Button key={action} variant="secondary" size="sm" onClick={() => onAction(document, action)}>
              <FileSearch className="h-4 w-4" />
              Full Report
            </Button>
          );
        })}
      </div>
    </div>
  );
}
