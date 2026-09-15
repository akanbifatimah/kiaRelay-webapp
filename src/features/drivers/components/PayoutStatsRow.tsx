import { useState } from "react";
import { ArrowUp, Clock } from "lucide-react";
import { Card } from "../../../components/Card";
import { Button } from "../../../components/Button";
import { ConfirmModal } from "../../../components/ConfirmModal";
import { useToast } from "../../../components/toast/ToastContext";
import { payoutSummary } from "../driverPayouts";

function formatCurrency(value: number): string {
  return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// "Process All" moves real money for every ready driver in the queue — gated
// behind ConfirmModal per working rule 9 (destructive/high-stakes actions).
export function PayoutStatsRow() {
  const { showToast } = useToast();
  const [isConfirming, setIsConfirming] = useState(false);
  const {
    totalPendingVolume,
    totalPendingDeltaPct,
    processedToday,
    processedTransactionCount,
    scheduledPayments,
    scheduledWindowHours,
    nextAutoBatchLabel,
  } = payoutSummary;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-end">
        <Button onClick={() => setIsConfirming(true)}>Process All</Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="flex flex-col gap-2">
          <span className="text-label text-text-muted">Total Pending Volume</span>
          <span className="text-2xl font-semibold text-text">{formatCurrency(totalPendingVolume)}</span>
          <span className="inline-flex items-center gap-0.5 text-xs font-medium text-success">
            <ArrowUp className="h-3 w-3" />
            {totalPendingDeltaPct}% vs last week
          </span>
        </Card>
        <Card className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-label text-text-muted">Processed Today</span>
            <span className="text-badge rounded-full bg-tag-warning-bg px-2 py-0.5 text-tag-warning-fg">
              On Track
            </span>
          </div>
          <span className="text-2xl font-semibold text-text">{formatCurrency(processedToday)}</span>
          <span className="text-xs text-text-muted">{processedTransactionCount} transactions cleared</span>
        </Card>
        <div className="flex flex-col gap-2 rounded-[var(--radius-card)] bg-sidebar p-5 text-white">
          <span className="flex items-center gap-1.5 text-label text-white/60">
            <Clock className="h-3 w-3" />
            Scheduled Payments ({scheduledWindowHours}h)
          </span>
          <span className="text-2xl font-semibold">{formatCurrency(scheduledPayments)}</span>
          <span className="text-xs text-white/60">Next Auto-Batch: {nextAutoBatchLabel}</span>
        </div>
      </div>

      {isConfirming && (
        <ConfirmModal
          title="Process All Ready Payouts"
          message="This releases funds to every driver currently marked Ready in the payout queue. This cannot be undone."
          confirmLabel="Process All"
          onCancel={() => setIsConfirming(false)}
          onConfirm={() => {
            setIsConfirming(false);
            showToast("success", "Payout batch processed.");
          }}
        />
      )}
    </div>
  );
}
