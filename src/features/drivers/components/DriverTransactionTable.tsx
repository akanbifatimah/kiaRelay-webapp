import { DataTable, type Column } from "../../../components/DataTable";
import { useToast } from "../../../components/toast/ToastContext";
import { cn } from "../../../lib/cn";
import type { DriverTransaction } from "../driverPayoutHistory";

function formatCurrency(value: number): string {
  const sign = value < 0 ? "-" : "";
  return `${sign}$${Math.abs(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function DriverTransactionTable({ rows }: { rows: DriverTransaction[] }) {
  const { showToast } = useToast();

  const columns: Column<DriverTransaction>[] = [
    { header: "Date", accessor: (row) => <span className="whitespace-nowrap">{row.date}</span> },
    { header: "Transaction ID", accessor: (row) => row.txId },
    { header: "Type", accessor: (row) => row.type },
    {
      header: "Gross",
      accessor: (row) => (
        <span className={row.gross < 0 ? "text-danger" : "text-text"}>{formatCurrency(row.gross)}</span>
      ),
    },
    {
      header: "Net Payout",
      accessor: (row) => (
        <span className={cn("font-medium", row.net < 0 ? "text-danger" : "text-text")}>{formatCurrency(row.net)}</span>
      ),
    },
    {
      header: "Status",
      accessor: (row) => (
        <span
          className={cn(
            "text-badge rounded-full px-2.5 py-0.5",
            row.status === "completed" ? "bg-tag-healthcare-bg text-tag-healthcare-fg" : "bg-tag-warning-bg text-tag-warning-fg",
          )}
        >
          {row.status === "completed" ? "Completed" : "Processing"}
        </span>
      ),
    },
    {
      header: "Action",
      align: "right",
      accessor: (row) => (
        <button
          type="button"
          onClick={() => showToast("success", `Opening details for ${row.txId}.`)}
          className="text-sm font-medium text-primary hover:underline"
        >
          Details
        </button>
      ),
    },
  ];

  return <DataTable columns={columns} rows={rows} rowKey={(row) => row.id} />;
}
