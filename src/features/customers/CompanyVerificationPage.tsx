import { useState } from "react";
import { ArrowLeft, Download, AlertTriangle } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import { Button } from "../../components/Button";
import { useToast } from "../../components/toast/ToastContext";
import { downloadFile } from "../../lib/downloadFile";
import { BusinessIdentityCard } from "./components/BusinessIdentityCard";
import { DocumentReviewCard } from "./components/DocumentReviewCard";
import { VerificationHistoryCard } from "./components/VerificationHistoryCard";
import { customers } from "./data";
import { getCustomerDetail } from "./customerDetails";
import { getCompanyVerificationDetail, type CompanyVerificationDetail } from "./companyVerification";

const DOCUMENT_CHECKLIST_LABEL = "Business Registration";

// TODO: replace with real POST /customers/:id/verification/approve|reject
// once the Compliance API exists — this is the deeper, document-level
// review a company's verification lands on after its ID checklist is
// approved from IdVerificationReviewModal.
export function CompanyVerificationPage() {
  const { accountType, id } = useParams<{ accountType: string; id: string }>();
  const { showToast } = useToast();

  const customer = customers.find((c) => c.id === id);
  const detail = customer ? getCustomerDetail(customer) : null;
  const [verification, setVerification] = useState<CompanyVerificationDetail | null>(
    () => (detail ? getCompanyVerificationDetail(detail) : null),
  );
  const [isUrgent, setIsUrgent] = useState(false);

  if (!customer || !detail || detail.accountType !== "company" || !verification) {
    return <Navigate to={`/customers/${accountType ?? "company"}`} replace />;
  }

  function addHistoryEntry(description: string, tone: "success" | "warning") {
    setVerification((prev) =>
      prev
        ? {
            ...prev,
            history: [
              { id: `vh-${Date.now()}`, description, timestamp: "Just now", tone },
              ...prev.history,
            ],
          }
        : prev,
    );
  }

  function updateDocumentChecklistStatus(status: "verified" | "rejected") {
    setVerification((prev) =>
      prev
        ? {
            ...prev,
            checklist: prev.checklist.map((item) =>
              item.label === DOCUMENT_CHECKLIST_LABEL ? { ...item, status } : item,
            ),
          }
        : prev,
    );
  }

  function handleApprove() {
    updateDocumentChecklistStatus("verified");
    addHistoryEntry(`${verification!.document.name} approved and verified by admin.`, "success");
    showToast("success", `${verification!.document.name} approved.`);
  }

  function handleReject() {
    updateDocumentChecklistStatus("rejected");
    addHistoryEntry(`${verification!.document.name} rejected — company notified to resubmit.`, "warning");
    showToast("error", `${verification!.document.name} rejected.`);
  }

  function handleRequestNew() {
    addHistoryEntry(`New ${verification!.document.name} requested from company.`, "warning");
    showToast("success", "Request sent to the company for a new document.");
  }

  return (
    <div className="flex flex-col gap-4">
      <Link
        to={`/customers/${detail.accountType}/${detail.id}`}
        className="flex w-fit items-center gap-1.5 text-sm text-text-muted hover:text-text"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Profile
      </Link>

      <p className="text-label text-text-muted">
        Customers • Verification • {verification.companyLegalName}
      </p>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-heading-1 text-text">Company Verification</h1>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              // Only one document exists in this mock model today, so
              // "all files" is that one — genuinely downloads it (not a
              // placeholder), and extends to a real loop once a company
              // can have more than one verification document.
              downloadFile(verification.document.previewSrc, `${verification.document.name.replace(/\s+/g, "-")}.svg`);
              showToast("success", "Downloading verification files.");
            }}
            className="flex items-center gap-1.5 text-sm font-medium text-text-muted hover:text-text"
          >
            <Download className="h-4 w-4" />
            Download All Files
          </button>
          <Button
            type="button"
            onClick={() => {
              setIsUrgent((prev) => !prev);
              showToast("success", isUrgent ? "No longer marked urgent." : "Marked as urgent.");
            }}
          >
            <AlertTriangle className="h-4 w-4" />
            {isUrgent ? "Urgent" : "Mark as Urgent"}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_1.3fr]">
        <BusinessIdentityCard detail={verification} />
        <DocumentReviewCard
          doc={verification.document}
          onApprove={handleApprove}
          onReject={handleReject}
          onRequestNew={handleRequestNew}
        />
      </div>

      <VerificationHistoryCard
        entries={verification.history}
        auditLogHref={`/customers/${detail.accountType}/${detail.id}/support?tab=audit-log`}
      />
    </div>
  );
}
