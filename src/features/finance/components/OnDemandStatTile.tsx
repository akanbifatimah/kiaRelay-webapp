import { AlertTriangle } from "lucide-react";

function formatCurrency(value: number): string {
  return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
}

// Dark/urgent tile, same bg-sidebar template as FinancialImpactCard — kept
// separate from FinanceStatTile since its icon-badge shape doesn't apply
// here (an always-urgent stat, not a delta-driven one).
export function OnDemandStatTile({ value, urgentCount }: { value: number; urgentCount: number }) {
  return (
    <div className="flex min-w-0 flex-col gap-3 rounded-[var(--radius-card)] border border-border bg-sidebar p-5 text-white shadow-sm">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-danger/20 text-danger">
        <AlertTriangle className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="text-label text-white/70">On-Demand Withdrawals</p>
        <p className="truncate text-xl font-semibold" title={formatCurrency(value)}>
          {formatCurrency(value)}
        </p>
      </div>
      <span className="text-xs font-medium text-danger">{urgentCount} urgent request{urgentCount === 1 ? "" : "s"}</span>
    </div>
  );
}
