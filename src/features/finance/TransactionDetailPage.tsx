import { useState } from "react";
import { ArrowLeft, Printer, Flag } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import { Card } from "../../components/Card";
import { Button } from "../../components/Button";
import { Timeline } from "../../components/Timeline";
import { useToast } from "../../components/toast/ToastContext";
import { FinanceTransactionStatusBadge } from "./components/FinanceTransactionStatusBadge";
import { FinancialBreakdownCard } from "./components/FinancialBreakdownCard";
import { EntityLinkageCard } from "./components/EntityLinkageCard";
import { ReportDiscrepancyModal } from "./components/ReportDiscrepancyModal";
import { financeTransactions, signedAmount } from "./financeTransactions";
import { getTransactionDetail } from "./transactionDetail";

const typeLabel: Record<string, string> = {
  "delivery-payment": "Delivery Payment",
  "company-invoice": "Company Invoice",
  "driver-payout": "Driver Payout",
  refund: "Refund",
};

function formatAmount(value: number): string {
  const sign = value < 0 ? "-" : "+";
  return `${sign}$${Math.abs(value).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
}

export function TransactionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { showToast } = useToast();
  const [isReporting, setIsReporting] = useState(false);

  const transaction = financeTransactions.find((t) => t.id === `#${id}` || t.id === id);
  if (!transaction) return <Navigate to="/finance" replace />;

  const detail = getTransactionDetail(transaction);
  const amount = signedAmount(transaction);

  return (
    <div className="flex flex-col gap-6">
      <Link to="/finance" className="flex w-fit items-center gap-1.5 text-sm text-text-muted hover:text-text">
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Finance
      </Link>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-heading-1 text-text">{transaction.id}</h1>
            <FinanceTransactionStatusBadge status={transaction.status} />
          </div>
          <p className="text-body mt-1 text-text-muted">{typeLabel[transaction.type]}</p>
        </div>
        <div className="text-right">
          <p className="text-label text-text-muted">Amount Settled</p>
          <p className="text-xl font-semibold text-text">{formatAmount(amount)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="flex flex-col gap-1">
          <p className="text-label text-text-muted">Created Date</p>
          <p className="text-sm text-text">{detail.createdLabel}</p>
        </Card>
        <Card className="flex flex-col gap-1">
          <p className="text-label text-text-muted">Processed Date</p>
          <p className="text-sm text-text">{detail.processedLabel}</p>
        </Card>
        <Card className="flex flex-col gap-1">
          <p className="text-label text-text-muted">Payment Method</p>
          <p className="text-sm text-text">{detail.paymentMethod}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <FinancialBreakdownCard lines={detail.breakdown} netRevenue={detail.netRevenue} />
        </div>
        <div className="flex flex-col gap-4">
          <EntityLinkageCard detail={detail} />
          <Card className="flex flex-col gap-3">
            <h3 className="text-label text-text-muted">Activity Log</h3>
            <Timeline steps={detail.activityLog} />
          </Card>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="dark" onClick={() => window.print()}>
          <Printer className="h-4 w-4" />
          Print Settlement Statement
        </Button>
        <Button variant="secondary" onClick={() => setIsReporting(true)}>
          <Flag className="h-4 w-4" />
          Report Discrepancy
        </Button>
      </div>

      {isReporting && (
        <ReportDiscrepancyModal
          transactionId={transaction.id}
          onClose={() => setIsReporting(false)}
          onSubmitReport={() => showToast("success", `Discrepancy report filed for ${transaction.id}.`)}
        />
      )}
    </div>
  );
}
