import { useState } from "react";
import { Filter, Download } from "lucide-react";
import { Card } from "../../../components/Card";
import { Button } from "../../../components/Button";
import { Pagination } from "../../../components/Pagination";
import { ConfirmModal } from "../../../components/ConfirmModal";
import { useToast } from "../../../components/toast/ToastContext";
import { DriverPayoutStatsRow } from "./DriverPayoutStatsRow";
import { DriverTransactionTable } from "./DriverTransactionTable";
import { PayoutSettingsCard } from "./PayoutSettingsCard";
import { ConfigurePayoutCycleModal } from "./ConfigurePayoutCycleModal";
import { getPayoutSummary, getPayoutSettings, getTransactions } from "../driverPayoutHistory";
import { exportDriverTransactionsToCsv } from "../exportDriverTransactions";

export function DriverPayoutsSection({ driverId, driverName }: { driverId: string; driverName: string }) {
  const { showToast } = useToast();
  const [summary, setSummary] = useState(() => getPayoutSummary(driverId));
  const [settings, setSettings] = useState(() => getPayoutSettings(driverId));
  const [transactions] = useState(() => getTransactions(driverId));
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const pageCount = Math.max(1, Math.ceil(transactions.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pageRows = transactions.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const frequencyLabels: Record<string, string> = { weekly: "Weekly", "bi-weekly": "Bi-Weekly", "on-demand": "On-Demand" };

  return (
    <div className="flex flex-col gap-6">
      <DriverPayoutStatsRow summary={summary} onConfigureCycle={() => setIsConfiguring(true)} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="flex flex-col gap-4 lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-text">Transaction History</h2>
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" onClick={() => setIsConfiguring(true)}>
                <Filter className="h-4 w-4" />
                Configure Payout Cycle
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  exportDriverTransactionsToCsv(transactions, `${driverName.replace(/\s+/g, "-").toLowerCase()}-ledger.csv`);
                  showToast("success", "Ledger exported.");
                }}
              >
                <Download className="h-4 w-4" />
                Export Ledger
              </Button>
              <Button variant="dark" size="sm" onClick={() => setIsProcessing(true)}>
                Process Withdrawal
              </Button>
            </div>
          </div>
          <DriverTransactionTable rows={pageRows} />
          <Pagination
            page={currentPage}
            pageCount={pageCount}
            total={transactions.length}
            pageSize={pageSize}
            itemLabel="transactions"
            onPageChange={setPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setPage(1);
            }}
          />
        </Card>

        <PayoutSettingsCard settings={settings} driverName={driverName} onConfigureCycle={() => setIsConfiguring(true)} />
      </div>

      {isConfiguring && (
        <ConfigurePayoutCycleModal
          driverName={driverName}
          onClose={() => setIsConfiguring(false)}
          onSave={(frequency) => {
            const label = frequencyLabels[frequency];
            setSummary((prev) => ({ ...prev, cycleLabel: label }));
            setSettings((prev) => ({ ...prev, cycle: label }));
            showToast("success", "Payout cycle updated.");
          }}
        />
      )}

      {isProcessing && (
        <ConfirmModal
          title="Process Withdrawal"
          message={`Process ${driverName}'s current wallet balance as a withdrawal now? This cannot be undone.`}
          confirmLabel="Process Withdrawal"
          onCancel={() => setIsProcessing(false)}
          onConfirm={() => {
            setIsProcessing(false);
            showToast("success", "Withdrawal processed.");
          }}
        />
      )}
    </div>
  );
}
