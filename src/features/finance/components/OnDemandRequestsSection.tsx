import { useState } from "react";
import { PenLine } from "lucide-react";
import { Card } from "../../../components/Card";
import { Button } from "../../../components/Button";
import { ConfirmModal } from "../../../components/ConfirmModal";
import { useToast } from "../../../components/toast/ToastContext";
import { ManualPayoutEntryModal } from "./ManualPayoutEntryModal";
import { onDemandRequests as initialRequests, type OnDemandRequest } from "../driverPayoutsOverview";

function formatCurrency(value: number): string {
  return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
}

export function OnDemandRequestsSection() {
  const { showToast } = useToast();
  const [requests, setRequests] = useState<OnDemandRequest[]>(initialRequests);
  const [pendingAction, setPendingAction] = useState<{ request: OnDemandRequest; kind: "approve" | "reject" } | null>(null);
  const [showManualEntry, setShowManualEntry] = useState(false);

  function resolveRequest(id: string, kind: "approve" | "reject") {
    setRequests((prev) => prev.filter((r) => r.id !== id));
    showToast("success", kind === "approve" ? "Withdrawal approved and queued for payout." : "Withdrawal request rejected.");
    setPendingAction(null);
  }

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text">On-Demand Withdrawal Requests</h3>
        <Button type="button" variant="secondary" size="sm" onClick={() => setShowManualEntry(true)}>
          <PenLine className="h-4 w-4" />
          Manual Entry
        </Button>
      </div>

      {requests.length === 0 ? (
        <p className="text-sm text-text-muted">No pending on-demand requests.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {requests.map((request) => (
            <div
              key={request.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border px-4 py-3"
            >
              <div>
                <p className="flex items-center gap-2 text-sm font-medium text-text">
                  {request.driverName}
                  {request.urgent && <span className="text-badge rounded-full bg-tag-danger-bg px-2 py-0.5 text-tag-danger-fg">Urgent</span>}
                </p>
                <p className="text-xs text-text-muted">{request.note}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-medium text-text">{formatCurrency(request.amount)}</span>
                <Button type="button" variant="secondary" size="sm" onClick={() => setPendingAction({ request, kind: "reject" })}>
                  Reject
                </Button>
                <Button type="button" size="sm" onClick={() => setPendingAction({ request, kind: "approve" })}>
                  Approve
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {pendingAction && (
        <ConfirmModal
          title={pendingAction.kind === "approve" ? "Approve Withdrawal" : "Reject Withdrawal"}
          message={`${pendingAction.kind === "approve" ? "Approve" : "Reject"} ${pendingAction.request.driverName}'s on-demand withdrawal of ${formatCurrency(pendingAction.request.amount)}?`}
          confirmLabel={pendingAction.kind === "approve" ? "Approve Withdrawal" : "Reject Withdrawal"}
          tone={pendingAction.kind === "reject" ? "danger" : "default"}
          onCancel={() => setPendingAction(null)}
          onConfirm={() => resolveRequest(pendingAction.request.id, pendingAction.kind)}
        />
      )}

      {showManualEntry && (
        <ManualPayoutEntryModal
          onClose={() => setShowManualEntry(false)}
          onCreate={(request) => {
            setRequests((prev) => [request, ...prev]);
            showToast("success", `Manual entry added for ${request.driverName}.`);
          }}
        />
      )}
    </Card>
  );
}
