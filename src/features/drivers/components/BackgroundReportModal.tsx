import { CheckCircle2 } from "lucide-react";
import { Modal } from "../../../components/Modal";
import { backgroundVerification } from "../complianceDocuments";

export function BackgroundReportModal({ onClose }: { onClose: () => void }) {
  const { provider, resultSummary, scopeNote, reportId, completedOn, checks } = backgroundVerification;

  return (
    <Modal title="Full Background Report" subtitle={`Powered by ${provider} · Report ${reportId}`} onClose={onClose}>
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-label text-text-muted">Result Summary</p>
          <p className="text-sm text-text">{resultSummary}</p>
          <p className="mt-1 text-xs text-text-muted">{scopeNote}</p>
          <p className="mt-1 text-xs text-text-muted">Completed on {completedOn}</p>
        </div>
        <div>
          <p className="text-label text-text-muted mb-2">Checks Performed</p>
          <div className="flex flex-col divide-y divide-border rounded-lg border border-border">
            {checks.map((check) => (
              <div key={check.label} className="flex items-center justify-between px-3 py-2 text-sm">
                <span className="text-text">{check.label}</span>
                <span className="inline-flex items-center gap-1.5 font-medium text-success">
                  <CheckCircle2 className="h-4 w-4" />
                  {check.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
