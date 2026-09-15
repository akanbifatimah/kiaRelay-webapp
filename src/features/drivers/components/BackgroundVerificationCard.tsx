import { useState } from "react";
import { ShieldCheck, RotateCw, FileText } from "lucide-react";
import { Card } from "../../../components/Card";
import { Button } from "../../../components/Button";
import { useToast } from "../../../components/toast/ToastContext";
import { BackgroundReportModal } from "./BackgroundReportModal";
import { backgroundVerification } from "../complianceDocuments";

// TODO: "Re-run Check" has no real background-check integration to call
// yet — toast for now. "View Full Report" opens a real breakdown modal.
export function BackgroundVerificationCard() {
  const { showToast } = useToast();
  const [isViewingReport, setIsViewingReport] = useState(false);
  const { provider, resultSummary, scopeNote, reportId, ssnTraceStatus, completedOn } = backgroundVerification;

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-text">Background Verification</h2>
          <p className="text-xs text-text-muted">Powered by {provider}</p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-badge rounded-full bg-tag-healthcare-bg px-2.5 py-0.5 text-tag-healthcare-fg">
          <ShieldCheck className="h-3.5 w-3.5" />
          Cleared
        </span>
      </div>

      <div>
        <p className="text-label text-text-muted">Result Summary</p>
        <p className="text-sm text-text">{resultSummary}</p>
        <p className="mt-1 text-xs text-text-muted">{scopeNote}</p>
      </div>

      <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
        <div>
          <p className="text-label text-text-muted">Report ID</p>
          <p className="text-text">{reportId}</p>
        </div>
        <div>
          <p className="text-label text-text-muted">SSN Trace</p>
          <p className="text-success">{ssnTraceStatus}</p>
        </div>
        <div>
          <p className="text-label text-text-muted">Completed On</p>
          <p className="text-text">{completedOn}</p>
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="secondary" size="sm" onClick={() => setIsViewingReport(true)}>
          <FileText className="h-4 w-4" />
          View Full Report
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => showToast("success", "Re-running background check.")}
        >
          <RotateCw className="h-4 w-4" />
          Re-run Check
        </Button>
      </div>

      {isViewingReport && <BackgroundReportModal onClose={() => setIsViewingReport(false)} />}
    </Card>
  );
}
