import { DataTable, type Column } from "../../../components/DataTable";
import { TagChip } from "../../../components/TagChip";
import { StatusBadge } from "../../../components/StatusBadge";
import { CardMenuButton } from "../../../components/CardMenuButton";
import type { CustomerOrderRecord } from "../customerOrderHistory";

const columns: Column<CustomerOrderRecord>[] = [
  { header: "Order ID", accessor: (row) => <span className="whitespace-nowrap font-medium">{row.id}</span> },
  { header: "Date", accessor: (row) => <span className="whitespace-nowrap">{row.date}</span> },
  { header: "Delivery Type", accessor: (row) => <TagChip type={row.deliveryType} /> },
  { header: "Status", accessor: (row) => <StatusBadge status={row.status} /> },
  { header: "Payment Method", accessor: (row) => <span className="whitespace-nowrap">{row.paymentMethod}</span> },
  { header: "Amount", accessor: (row) => row.amount, align: "right" },
  { header: "", accessor: () => <CardMenuButton />, align: "right" },
];

export function CustomerOrderHistoryTable({ rows }: { rows: CustomerOrderRecord[] }) {
  return <DataTable columns={columns} rows={rows} rowKey={(row) => row.id} />;
}
