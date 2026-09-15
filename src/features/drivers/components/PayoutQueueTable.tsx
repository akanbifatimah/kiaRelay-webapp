import { DataTable, type Column } from "../../../components/DataTable";
import { Avatar } from "../../../components/Avatar";
import { PayoutStatusBadge } from "./PayoutStatusBadge";
import type { PayoutQueueRow } from "../driverPayouts";

interface PayoutQueueTableProps {
  rows: PayoutQueueRow[];
  onApproveWithdrawal: (row: PayoutQueueRow) => void;
  onVerifyDetails: (row: PayoutQueueRow) => void;
  onViewAlert: (row: PayoutQueueRow) => void;
}

function formatCurrency(value: number): string {
  return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

const actionLabel: Record<PayoutQueueRow["status"], string> = {
  ready: "Approve Withdrawal",
  pending: "Verify Details",
  "on-hold": "View Alert",
};

export function PayoutQueueTable({ rows, onApproveWithdrawal, onVerifyDetails, onViewAlert }: PayoutQueueTableProps) {
  function handleAction(row: PayoutQueueRow) {
    if (row.status === "ready") onApproveWithdrawal(row);
    else if (row.status === "pending") onVerifyDetails(row);
    else onViewAlert(row);
  }

  const columns: Column<PayoutQueueRow>[] = [
    {
      header: "Driver",
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <Avatar name={row.driverName} size="sm" />
          <div>
            <p className="whitespace-nowrap font-medium text-text">{row.driverName}</p>
            <p className="whitespace-nowrap text-xs text-text-muted">ID: {row.id}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Wallet Balance",
      accessor: (row) => <span className="font-medium text-text">{formatCurrency(row.walletBalance)}</span>,
    },
    { header: "Cycle", accessor: (row) => row.cycle },
    {
      header: "Schedule",
      accessor: (row) => (
        <div>
          <p className="whitespace-nowrap text-text">{row.lastPayoutLabel}</p>
          <p className="whitespace-nowrap text-xs text-text-muted">{row.nextPayoutLabel}</p>
        </div>
      ),
    },
    { header: "Status", accessor: (row) => <PayoutStatusBadge status={row.status} /> },
    {
      header: "Action",
      align: "right",
      accessor: (row) => (
        <button
          type="button"
          onClick={() => handleAction(row)}
          className={
            row.status === "on-hold"
              ? "text-sm font-medium text-danger hover:underline"
              : "text-sm font-medium text-primary hover:underline"
          }
        >
          {actionLabel[row.status]}
        </button>
      ),
    },
  ];

  return <DataTable columns={columns} rows={rows} rowKey={(row) => row.id} />;
}
