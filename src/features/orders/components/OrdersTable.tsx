import { DataTable, type Column } from "../../../components/DataTable";
import { Avatar } from "../../../components/Avatar";
import { TagChip } from "../../../components/TagChip";
import { StatusBadge } from "../../../components/StatusBadge";
import type { Order } from "../data";

const columns: Column<Order>[] = [
  { header: "Order ID", accessor: (row) => <span className="font-medium">{row.id}</span> },
  { header: "Customer", accessor: (row) => row.customer },
  { header: "Type", accessor: (row) => <TagChip type={row.type} /> },
  { header: "Industry", accessor: (row) => row.industry },
  {
    header: "Route",
    accessor: (row) => (
      <span className="text-text-muted">
        {row.pickup} &rarr; {row.dropoff}
      </span>
    ),
  },
  {
    header: "Driver",
    accessor: (row) => (
      <div className="flex items-center gap-2">
        <Avatar name={row.driver} shape="square" size="sm" />
        <span>{row.driver}</span>
      </div>
    ),
  },
  { header: "Price", accessor: (row) => row.price, align: "right" },
  { header: "Status", accessor: (row) => <StatusBadge status={row.status} /> },
];

export function OrdersTable({ rows }: { rows: Order[] }) {
  return <DataTable columns={columns} rows={rows} rowKey={(row) => row.id} />;
}
