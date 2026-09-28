import { useState } from "react";
import { Card } from "../../../components/Card";
import { DataTable, type Column } from "../../../components/DataTable";
import { StatusBadge } from "../../../components/StatusBadge";
import { DriverOrderHistoryModal } from "./DriverOrderHistoryModal";
import { buildDriverOrderHistory } from "../driverOrderHistory";
import { useOrders } from "../../orders/ordersStore";
import type { DriverDetail, DriverOrderSummary } from "../driverDetails";

const columns: Column<DriverOrderSummary>[] = [
  { header: "Order ID", accessor: (row) => <span className="font-medium">{row.id}</span> },
  { header: "Amount", accessor: (row) => row.amount },
  { header: "Status", accessor: (row) => <StatusBadge status={row.status} /> },
  { header: "", accessor: (row) => <span className="text-text-muted">{row.timeLabel}</span>, align: "right" },
];

// Mirrors RecentOrdersCard's shape — "See All" opens a real, paginated order
// history modal instead of toasting.
export function DriverRecentOrdersCard({ detail }: { detail: DriverDetail }) {
  const [isViewingAll, setIsViewingAll] = useState(false);
  // Rides handed to this driver via Assign Ride / Reassign Driver (TC-12)
  // appear first, read live from ordersStore.
  const assigned: DriverOrderSummary[] = useOrders()
    .filter((order) => order.driverId === detail.id)
    .map((order) => ({ id: order.id, amount: order.price, status: order.status, timeLabel: "Assigned by admin" }));
  const rows = [...assigned, ...detail.recentOrders.filter((order) => !assigned.some((a) => a.id === order.id))];

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-label text-text-muted">Recent Orders</h3>
        <button
          type="button"
          onClick={() => setIsViewingAll(true)}
          className="text-xs font-medium text-primary hover:underline"
        >
          See All
        </button>
      </div>
      {rows.length === 0 ? (
        <p className="py-6 text-center text-sm text-text-muted">No orders yet.</p>
      ) : (
        <DataTable columns={columns} rows={rows} rowKey={(row) => row.id} />
      )}

      {isViewingAll && (
        <DriverOrderHistoryModal
          driverName={detail.name}
          orders={buildDriverOrderHistory(detail)}
          onClose={() => setIsViewingAll(false)}
        />
      )}
    </Card>
  );
}
