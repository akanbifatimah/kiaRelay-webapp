import { ClipboardList, Pencil } from "lucide-react";
import { Card } from "../../../components/Card";
import { Avatar } from "../../../components/Avatar";
import type { ClaimInvestigation } from "../claimInvestigation";

interface ClaimSummaryCardProps {
  claim: ClaimInvestigation;
  onEdit: () => void;
}

export function ClaimSummaryCard({ claim, onEdit }: ClaimSummaryCardProps) {
  const isFinal = claim.status === "resolved" || claim.status === "escalated";

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-base font-semibold text-text">
          <ClipboardList className="h-4 w-4 text-primary" />
          Claim Summary
        </h2>
        {!isFinal && (
          <button type="button" onClick={onEdit} className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </button>
        )}
      </div>
      <div className="grid gap-5 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-label uppercase text-text-muted">Incident Description</p>
            <p className="mt-1 text-sm text-text">{claim.incidentDescription}</p>
          </div>
          <div>
            <p className="text-label uppercase text-text-muted">Customer Statement</p>
            <blockquote className="mt-1 border-l-4 border-primary bg-bg px-3 py-2 text-sm italic text-text">
              &ldquo;{claim.customerStatement}&rdquo;
            </blockquote>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-label uppercase text-text-muted">Reviewer</p>
              <div className="mt-1 flex items-center gap-2 text-sm font-medium text-text">
                <Avatar name={claim.reviewer} src="/profile_img.png" size="sm" />
                {claim.reviewer}
              </div>
            </div>
            <div>
              <p className="text-label uppercase text-text-muted">Resolution State</p>
              <p className="mt-1 text-sm font-medium text-warning">{claim.resolutionState}</p>
            </div>
          </div>
          <div>
            <p className="text-label uppercase text-text-muted">Internal Notes</p>
            <p className="mt-1 rounded-lg bg-tag-info-bg px-3 py-2 text-sm text-tag-info-fg">
              {claim.internalNotes || "No internal notes yet."}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
