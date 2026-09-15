import { Pencil, ArrowUp } from "lucide-react";
import { Card } from "../../../components/Card";
import { Tooltip } from "../../../components/Tooltip";
import type { DriverPayoutSummary } from "../driverPayoutHistory";

function formatCurrency(value: number): string {
  const sign = value < 0 ? "-" : "";
  return `${sign}$${Math.abs(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

interface DriverPayoutStatsRowProps {
  summary: DriverPayoutSummary;
  onConfigureCycle: () => void;
}

export function DriverPayoutStatsRow({ summary, onConfigureCycle }: DriverPayoutStatsRowProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <Card className="flex flex-col gap-2">
        <span className="text-label text-text-muted">Wallet Balance</span>
        <span className="text-2xl font-semibold text-text">{formatCurrency(summary.walletBalance)}</span>
        <span className="inline-flex items-center gap-0.5 text-xs font-medium text-success">
          <ArrowUp className="h-3 w-3" />
          {summary.walletDeltaPct}% vs last week
        </span>
      </Card>
      <Card className="flex flex-col gap-2">
        <span className="text-label text-text-muted">Pending Earnings</span>
        <span className="text-2xl font-semibold text-text">{formatCurrency(summary.pendingEarnings)}</span>
        <span className="text-xs text-text-muted">{summary.pendingNote}</span>
      </Card>
      <div className="flex flex-col gap-2 rounded-[var(--radius-card)] bg-sidebar p-5 text-white">
        <span className="text-label text-white/60">Lifetime Earned</span>
        <span className="text-2xl font-semibold">{formatCurrency(summary.lifetimeEarned)}</span>
        <span className="text-xs text-white/60">Lifetime</span>
      </div>
      <Card className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-label text-text-muted">Payout Cycle</span>
          <Tooltip label="Configure payout cycle">
            <button
              type="button"
              aria-label="Configure payout cycle"
              onClick={onConfigureCycle}
              className="text-text-muted hover:text-text"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
          </Tooltip>
        </div>
        <span className="text-2xl font-semibold text-text">{summary.cycleLabel}</span>
      </Card>
    </div>
  );
}
