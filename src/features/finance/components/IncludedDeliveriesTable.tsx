import { useState } from "react";
import { Card } from "../../../components/Card";
import { DataTable, type Column } from "../../../components/DataTable";
import type { IncludedDelivery } from "../payoutDetail";

const PREVIEW_COUNT = 5;

function formatCurrency(value: number): string {
  return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
}

export function IncludedDeliveriesTable({ deliveries }: { deliveries: IncludedDelivery[] }) {
  const [expanded, setExpanded] = useState(false);
  const rows = expanded ? deliveries : deliveries.slice(0, PREVIEW_COUNT);

  const columns: Column<IncludedDelivery>[] = [
    { header: "Order ID", accessor: (row) => <span className="font-medium text-primary">{row.orderId}</span> },
    { header: "Route", accessor: (row) => <span className="whitespace-nowrap">{row.route}</span> },
    { header: "Date", accessor: (row) => <span className="whitespace-nowrap">{row.date}</span> },
    { header: "Amount", accessor: (row) => <span className="font-medium text-text">{formatCurrency(row.amount)}</span> },
  ];

  return (
    <Card className="flex h-full flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text">Included Deliveries</h3>
        <span className="text-xs text-text-muted">{deliveries.length} Deliveries</span>
      </div>
      <DataTable columns={columns} rows={rows} rowKey={(row) => row.orderId} />
      {!expanded && deliveries.length > PREVIEW_COUNT && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="text-left text-sm font-medium text-primary hover:underline"
        >
          View all {deliveries.length} deliveries
        </button>
      )}
    </Card>
  );
}
