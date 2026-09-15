import { DataTable, type Column } from "../../../components/DataTable";
import { TransactionStatusBadge } from "./TransactionStatusBadge";
import type { TransactionLogEntry } from "../driverPayouts";

function formatAmount(value: number): string {
  const sign = value < 0 ? "-" : "";
  return `${sign}$${Math.abs(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function TransactionLogTable({ rows }: { rows: TransactionLogEntry[] }) {
  const columns: Column<TransactionLogEntry>[] = [
    {
      header: "Transaction",
      accessor: (row) => (
        <div>
          <p className="whitespace-nowrap font-medium text-text">{row.title}</p>
          <p className="whitespace-nowrap text-xs text-text-muted">{row.subtitle}</p>
        </div>
      ),
    },
    { header: "Time", accessor: (row) => <span className="whitespace-nowrap text-text-muted">{row.timestamp}</span> },
    {
      header: "Amount",
      accessor: (row) => (
        <span className={row.amount < 0 ? "font-medium text-danger" : "font-medium text-success"}>
          {formatAmount(row.amount)}
        </span>
      ),
    },
    { header: "Status", accessor: (row) => <TransactionStatusBadge status={row.status} /> },
  ];

  return <DataTable columns={columns} rows={rows} rowKey={(row) => row.id} />;
}
