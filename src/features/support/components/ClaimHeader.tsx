import { Calendar, FileWarning } from "lucide-react";
import { Button } from "../../../components/Button";
import { cn } from "../../../lib/cn";
import { claimStatusLabels, type ClaimInvestigation, type ClaimStatus } from "../claimInvestigation";

const statusClasses: Record<ClaimStatus, string> = {
  draft: "bg-tag-standard-bg text-tag-standard-fg",
  open: "bg-tag-info-bg text-tag-info-fg",
  "in-review": "bg-primary text-primary-foreground",
  resolved: "bg-success text-white",
  escalated: "bg-tag-danger-bg text-tag-danger-fg",
};

interface ClaimHeaderProps {
  claim: ClaimInvestigation;
  onMoveToReview: () => void;
  onResolve: () => void;
  onEscalate: () => void;
}

// Once resolved or escalated the claim has left this reviewer's hands, so
// all three actions lock — the status pill says why.
export function ClaimHeader({ claim, onMoveToReview, onResolve, onEscalate }: ClaimHeaderProps) {
  const isClosed = claim.status === "resolved" || claim.status === "escalated";

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="text-xs text-text-muted">Claims / Investigation</p>
        <div className="mt-1 flex flex-wrap items-center gap-3">
          <h1 className="text-heading-1 text-text">{claim.id}</h1>
          <span className={cn("text-badge rounded px-2 py-0.5", statusClasses[claim.status])}>{claimStatusLabels[claim.status]}</span>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-text-muted">
          <span className="flex items-center gap-1.5">
            <FileWarning className="h-4 w-4" />
            Type: {claim.type}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            Submitted: {claim.submitted}
          </span>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" onClick={onMoveToReview} disabled={claim.status !== "open"}>
          {claim.status === "open" ? "Move to In Review" : "In Review"}
        </Button>
        <Button variant="success" onClick={onResolve} disabled={isClosed}>
          Resolve Claim
        </Button>
        <Button onClick={onEscalate} disabled={isClosed}>
          Escalate Claim
        </Button>
      </div>
    </div>
  );
}
