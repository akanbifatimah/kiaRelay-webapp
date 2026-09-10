import { Link } from "react-router-dom";
import { Card } from "../../../components/Card";
import { DataTable, type Column } from "../../../components/DataTable";
import { StatusBadge } from "../../../components/StatusBadge";
import type { RecentOrder } from "../customerDetails";

const columns: Column<RecentOrder>[] = [
  { header: "Order ID", accessor: (row) => <span className="font-medium">{row.id}</span> },
  { header: "Date", accessor: (row) => row.date },
  { header: "Status", accessor: (row) => <StatusBadge status={row.status} /> },
  { header: "Amount", accessor: (row) => row.amount, align: "right" },
];

interface RecentOrdersCardProps {
  orders: RecentOrder[];
  viewAllHref: string;
}

export function RecentOrdersCard({ orders, viewAllHref }: RecentOrdersCardProps) {
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-label text-text-muted">Recent Orders</h3>
        <Link to={viewAllHref} className="text-xs font-medium text-primary hover:underline">
          View All
        </Link>
      </div>
      {orders.length === 0 ? (
        <p className="py-6 text-center text-sm text-text-muted">No orders yet.</p>
      ) : (
        <DataTable columns={columns} rows={orders} rowKey={(row) => row.id} />
      )}
    </Card>
  );
}
