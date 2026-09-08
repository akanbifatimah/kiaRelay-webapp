import { DataTable, type Column } from "../../../components/DataTable";
import { Avatar } from "../../../components/Avatar";
import { TagChip } from "../../../components/TagChip";
import { StatusBadge } from "../../../components/StatusBadge";
import type { Order } from "../data";

const columns: Column<Order>[] = [
  {
    header: "Order ID",
    accessor: (row) => <span className="whitespace-nowrap font-medium">{row.id}</span>,
  },
  {
    header: "Customer",
    accessor: (row) => (
      <div className="flex flex-col">
        <span className="font-semibold text-text">{row.customer}</span>
        {row.plan && <span className="text-label text-text-muted">{row.plan}</span>}
      </div>
    ),
  },
  { header: "Type", accessor: (row) => <TagChip type={row.type} /> },
  { header: "Industry", accessor: (row) => row.industry },
  {
    header: "Route (Pickup → Drop)",
    accessor: (row) => (
      <span className="whitespace-nowrap text-text-muted">
        {row.pickup} &rarr; {row.dropoff}
      </span>
    ),
  },
  {
    header: "Driver",
    accessor: (row) => (
      <div className="flex items-center gap-2">
        {/* TODO: swap for the driver's real photo once Driver Management
            stores one — reusing the header's placeholder avatar for now. */}
        <Avatar name={row.driver} src="/profile_img.png" size="sm" />
        <span className="whitespace-nowrap">{row.driver}</span>
      </div>
    ),
  },
  { header: "Price", accessor: (row) => row.price, align: "right" },
  { header: "Status", accessor: (row) => <StatusBadge status={row.status} /> },
];

interface OrdersTableProps {
  rows: Order[];
  onRowClick?: (row: Order) => void;
}

export function OrdersTable({ rows, onRowClick }: OrdersTableProps) {
  return <DataTable columns={columns} rows={rows} rowKey={(row) => row.id} onRowClick={onRowClick} />;
}
