import { Wallet } from "lucide-react";
import type { PayoutDetail } from "../payoutDetail";

function formatCurrency(value: number): string {
  return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
}

// Dark card, same bg-sidebar template as FinancialImpactCard/
// QuickFinancialActionsCard.
export function PayoutSummaryCard({ detail }: { detail: PayoutDetail }) {
  const { payout, bonuses } = detail;
  return (
    <div className="flex flex-col gap-3 rounded-[var(--radius-card)] border border-border bg-sidebar p-5 text-white shadow-sm">
      <h3 className="flex items-center gap-2 text-label text-white/70">
        <Wallet className="h-3.5 w-3.5" />
        Payout Summary
      </h3>
      <div className="flex items-center justify-between text-sm">
        <span className="text-white/70">Gross Earnings</span>
        <span className="font-medium">{formatCurrency(payout.gross)}</span>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-white/70">Performance Bonuses</span>
        <span className="font-medium text-success">+{formatCurrency(bonuses)}</span>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-white/70">Deductions</span>
        <span className="font-medium text-danger">-{formatCurrency(payout.deductions)}</span>
      </div>
      <div className="flex items-center justify-between rounded-lg bg-white/10 px-3 py-2">
        <span className="text-label text-white/70">Net Payout</span>
        <div className="text-right">
          <p className="text-lg font-semibold text-primary">{formatCurrency(payout.net + bonuses)}</p>
          <p className="text-[10px] text-white/60">{payout.schedule.toUpperCase()} · {payout.nextPayoutDate}</p>
        </div>
      </div>
    </div>
  );
}
