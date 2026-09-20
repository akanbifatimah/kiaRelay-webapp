import { Package, Zap, Calendar, type LucideIcon } from "lucide-react";
import { Card } from "../../../components/Card";
import type { DeliveryTypeKey, DeliveryTypeRevenue } from "../data";

const iconByType: Record<DeliveryTypeKey, LucideIcon> = {
  standard: Package,
  express: Zap,
  scheduled: Calendar,
};

const iconBoxByType: Record<DeliveryTypeKey, string> = {
  standard: "bg-tag-standard-bg text-tag-standard-fg",
  express: "bg-tag-express-bg text-tag-express-fg",
  scheduled: "bg-tag-overnight-bg text-tag-overnight-fg",
};

function formatCurrency(value: number): string {
  return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
}

export function RevenueByDeliveryTypeCard({ rows }: { rows: DeliveryTypeRevenue[] }) {
  return (
    <Card className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold text-text">Revenue by Delivery Type</h3>
      <div className="flex flex-col divide-y divide-border">
        {rows.map((row) => {
          const Icon = iconByType[row.type];
          return (
            <div key={row.type} className="flex flex-wrap items-center justify-between gap-2 py-2.5">
              <div className="flex items-center gap-2">
                <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${iconBoxByType[row.type]}`}>
                  <Icon className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-medium text-text">{row.label}</p>
                  <p className="text-xs text-text-muted">{row.deliveries.toLocaleString()} Deliveries</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="text-right">
                  <p className="text-label text-text-muted">Avg Order</p>
                  <p className="font-medium text-text">${row.avgOrder.toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <p className="text-label text-text-muted">Total Bill</p>
                  <p className="font-medium text-text">{formatCurrency(row.totalBill)}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
