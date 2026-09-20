import { User, Briefcase, Truck, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "../../../components/Card";
import type { FinanceTransactionDetail } from "../transactionDetail";

export function EntityLinkageCard({ detail }: { detail: FinanceTransactionDetail }) {
  const rows = [
    detail.customerName && {
      label: "Customer",
      value: detail.customerName,
      icon: User,
      href:
        detail.customerId && detail.customerAccountType
          ? `/customers/${detail.customerAccountType}/${detail.customerId}`
          : undefined,
    },
    { label: "Order Reference", value: detail.orderRef, icon: Briefcase, href: undefined },
    detail.driverName && {
      label: "Assigned Driver",
      value: detail.driverName,
      icon: Truck,
      href: detail.driverId ? `/drivers/${detail.driverId}` : undefined,
    },
  ].filter(Boolean) as { label: string; value: string; icon: typeof User; href?: string }[];

  return (
    <Card className="flex flex-col gap-3">
      <h3 className="text-label text-text-muted">Entity Linkage</h3>
      <div className="flex flex-col divide-y divide-border">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-2 py-2.5 text-sm">
            <span className="flex items-center gap-2 text-text-muted">
              <row.icon className="h-4 w-4" />
              {row.label}
            </span>
            {row.href ? (
              <Link to={row.href} className="flex items-center gap-1 font-medium text-primary hover:underline">
                {row.value}
                <ExternalLink className="h-3 w-3" />
              </Link>
            ) : (
              <span className="font-medium text-text">{row.value}</span>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
