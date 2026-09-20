import { CreditCard } from "lucide-react";
import type { Adjustment } from "../adjustments";

function formatAmount(value: number): string {
  const sign = value < 0 ? "-" : "";
  return `${sign}$${Math.abs(value).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
}

interface FinancialImpactCardProps {
  adjustment: Adjustment;
  remainingCharge: number;
}

// Dark card, same bg-sidebar template as OperationalInsightCard/
// FinancialBreakdownCard's total row.
export function FinancialImpactCard({ adjustment, remainingCharge }: FinancialImpactCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-[var(--radius-card)] border border-border bg-sidebar p-5 text-white shadow-sm">
      <h3 className="flex items-center gap-2 text-label text-white/70">
        <CreditCard className="h-3.5 w-3.5" />
        Financial Impact
      </h3>
      <div className="flex items-center justify-between text-sm">
        <span className="text-white/70">Original Order Amount</span>
        <span className="font-medium">{formatAmount(adjustment.original)}</span>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-white/70">Adjustment Amount</span>
        <span className={adjustment.adjustment < 0 ? "font-medium text-danger" : "font-medium text-success"}>
          {formatAmount(adjustment.adjustment)}
        </span>
      </div>
      <div className="flex items-center justify-between rounded-lg bg-white/10 px-3 py-2">
        <span className="text-label text-white/70">Remaining Charge</span>
        <div className="text-right">
          <p className="text-lg font-semibold text-primary">{formatAmount(remainingCharge)}</p>
          <p className="text-[10px] text-white/60">NET BALANCE</p>
        </div>
      </div>
    </div>
  );
}
