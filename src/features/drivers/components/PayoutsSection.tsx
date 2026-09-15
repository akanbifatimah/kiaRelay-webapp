import { useState } from "react";
import { Card } from "../../../components/Card";
import { Pagination } from "../../../components/Pagination";
import { ConfirmModal } from "../../../components/ConfirmModal";
import { useToast } from "../../../components/toast/ToastContext";
import { PayoutStatsRow } from "./PayoutStatsRow";
import { PayoutQueueTable } from "./PayoutQueueTable";
import { TransactionLogTable } from "./TransactionLogTable";
import { payoutQueue, transactionLog, type PayoutQueueRow } from "../driverPayouts";
import { exportTransactionLogToCsv } from "../exportTransactionLog";

export function PayoutsSection() {
  const { showToast } = useToast();
  const [queuePage, setQueuePage] = useState(1);
  const [queuePageSize, setQueuePageSize] = useState(10);
  const [logPage, setLogPage] = useState(1);
  const [logPageSize, setLogPageSize] = useState(10);
  const [approving, setApproving] = useState<PayoutQueueRow | null>(null);

  const queuePageCount = Math.max(1, Math.ceil(payoutQueue.length / queuePageSize));
  const queueRows = payoutQueue.slice((queuePage - 1) * queuePageSize, queuePage * queuePageSize);

  const logPageCount = Math.max(1, Math.ceil(transactionLog.length / logPageSize));
  const logRows = transactionLog.slice((logPage - 1) * logPageSize, logPage * logPageSize);

  return (
    <div className="flex flex-col gap-6">
      <PayoutStatsRow />

      <Card className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold text-text">Payout Queue</h2>
        <PayoutQueueTable
          rows={queueRows}
          onApproveWithdrawal={setApproving}
          onVerifyDetails={(row) => showToast("success", `Reviewing details for ${row.driverName}.`)}
          onViewAlert={(row) => showToast("error", `${row.driverName}'s payout is on hold.`)}
        />
        <Pagination
          page={queuePage}
          pageCount={queuePageCount}
          total={payoutQueue.length}
          pageSize={queuePageSize}
          itemLabel="drivers"
          onPageChange={setQueuePage}
          onPageSizeChange={(size) => {
            setQueuePageSize(size);
            setQueuePage(1);
          }}
        />
      </Card>

      <Card className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-text">Global Transaction Log</h2>
          {/* The table below already paginates the entire log, so "View Full
              History" would have opened a redundant duplicate view — export
              is the real distinct action here instead. */}
          <button
            type="button"
            onClick={() => {
              exportTransactionLogToCsv(transactionLog);
              showToast("success", "Transaction log exported.");
            }}
            className="text-xs font-medium text-primary hover:underline"
          >
            Export Log
          </button>
        </div>
        <TransactionLogTable rows={logRows} />
        <Pagination
          page={logPage}
          pageCount={logPageCount}
          total={transactionLog.length}
          pageSize={logPageSize}
          itemLabel="transactions"
          onPageChange={setLogPage}
          onPageSizeChange={(size) => {
            setLogPageSize(size);
            setLogPage(1);
          }}
        />
      </Card>

      {approving && (
        <ConfirmModal
          title="Approve Withdrawal"
          message={`Release ${approving.driverName}'s available wallet balance now? This cannot be undone.`}
          confirmLabel="Approve Withdrawal"
          onCancel={() => setApproving(null)}
          onConfirm={() => {
            showToast("success", `Withdrawal approved for ${approving.driverName}.`);
            setApproving(null);
          }}
        />
      )}
    </div>
  );
}
