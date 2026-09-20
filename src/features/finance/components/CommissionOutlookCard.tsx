import { useState } from "react";
import { ArrowUp } from "lucide-react";
import { CommissionTierBreakdownModal } from "./CommissionTierBreakdownModal";
import { commissionTiers, type CommissionOutlook } from "../revenueDetail";

// Dark card, same bg-sidebar template as OperationalInsightCard/
// QuickFinancialActionsCard.
export function CommissionOutlookCard({ outlook }: { outlook: CommissionOutlook }) {
  const [isBreakdownOpen, setIsBreakdownOpen] = useState(false);

  return (
    <div className="flex flex-col gap-3 rounded-[var(--radius-card)] border border-border bg-sidebar p-5 text-white shadow-sm">
      <h3 className="text-label text-white/70">Commission Outlook</h3>
      <p className="text-sm">{outlook.note}</p>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-label text-white/60">Projected Increase</p>
          <span className="inline-flex items-center gap-1 text-lg font-semibold text-success">
            <ArrowUp className="h-4 w-4" />+{outlook.projectedIncreasePct}%
          </span>
        </div>
        <button
          type="button"
          onClick={() => setIsBreakdownOpen(true)}
          className="rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-medium text-white hover:bg-white/20"
        >
          Details
        </button>
      </div>

      {isBreakdownOpen && (
        <CommissionTierBreakdownModal tiers={commissionTiers} outlook={outlook} onClose={() => setIsBreakdownOpen(false)} />
      )}
    </div>
  );
}
