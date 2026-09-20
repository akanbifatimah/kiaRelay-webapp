import { Paperclip, CheckCircle2, Search, ArrowRight } from "lucide-react";
import { Card } from "../../../components/Card";
import { useToast } from "../../../components/toast/ToastContext";
import type { AdjustmentReason } from "../adjustmentDetail";

// Orange left-border card, matches LicenseExpiryBanner's urgent-banner convention.
export function AdjustmentReasonCard({ reason }: { reason: AdjustmentReason }) {
  const { showToast } = useToast();

  return (
    <Card className="flex flex-col gap-3 border-l-4 border-l-warning">
      <h3 className="text-label text-text-muted">Adjustment Reason</h3>
      <p className="text-sm italic text-text">"{reason.text}"</p>
      <div className="flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1 text-badge rounded-full bg-tag-healthcare-bg px-2.5 py-0.5 text-tag-healthcare-fg">
          <Paperclip className="h-3 w-3" />
          Proof Attached
        </span>
        <span className="inline-flex items-center gap-1 text-badge rounded-full bg-tag-healthcare-bg px-2.5 py-0.5 text-tag-healthcare-fg">
          <CheckCircle2 className="h-3 w-3" />
          SLA Compliant
        </span>
      </div>
      <div className="flex items-center justify-between gap-2 rounded-lg border border-border bg-bg px-3 py-2">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-text-muted" />
          <div>
            <p className="text-sm font-medium text-text">View Full Claim Investigation</p>
            <p className="text-xs text-text-muted">
              Case {reason.claimCaseId} • Last updated {reason.claimLastUpdatedLabel}
            </p>
          </div>
        </div>
        {/* TODO: Claims module isn't built yet — toasts for now. */}
        <button
          type="button"
          onClick={() => showToast("success", "Claim investigation — coming soon.")}
          className="flex shrink-0 items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          Open Investigation
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </Card>
  );
}
