import { DataTable, type Column } from "../../../components/DataTable";
import type { RevenueDetailRow } from "../revenueDetailRows";

function formatCurrency(value: number): string {
  const sign = value < 0 ? "-" : "";
  return `${sign}$${Math.abs(value).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
}

const columns: Column<RevenueDetailRow>[] = [
  { header: "Date/Period", accessor: (row) => <span className="font-medium text-text">{row.period}</span> },
  { header: "Deliveries", accessor: (row) => row.deliveries.toLocaleString() },
  { header: "Gross Rev", accessor: (row) => formatCurrency(row.gross) },
  { header: "Driver Payouts", accessor: (row) => formatCurrency(row.payouts) },
  { header: "Adjustments", accessor: (row) => <span className="text-danger">{formatCurrency(row.adjustments)}</span> },
  { header: "Platform Fees", accessor: (row) => formatCurrency(row.fees) },
  { header: "Net Rev", accessor: (row) => <span className="font-semibold text-text">{formatCurrency(row.net)}</span> },
];

export function RevenueDetailsTable({ rows }: { rows: RevenueDetailRow[] }) {
  return <DataTable columns={columns} rows={rows} rowKey={(row) => row.id} />;
}
