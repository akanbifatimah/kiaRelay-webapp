import { Link } from "react-router-dom";
import { Package, CreditCard, LifeBuoy, History } from "lucide-react";
import { Card } from "../../../components/Card";

interface QuickActionsCardProps {
  ordersHref: string;
  paymentsHref: string;
  supportHref: string;
}

export function QuickActionsCard({ ordersHref, paymentsHref, supportHref }: QuickActionsCardProps) {
  const actions = [
    { label: "Orders", icon: Package, href: ordersHref },
    { label: "Payments", icon: CreditCard, href: paymentsHref },
    { label: "Support", icon: LifeBuoy, href: supportHref },
    { label: "Activity Log", icon: History, href: `${supportHref}?tab=audit-log` },
  ];

  return (
    <Card className="flex flex-col gap-3">
      <h3 className="text-label text-text-muted">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-2">
        {actions.map(({ label, icon: Icon, href }) => (
          <Link
            key={label}
            to={href}
            className="flex flex-col items-center gap-1.5 rounded-lg border border-border p-3 text-xs font-medium text-text hover:bg-bg"
          >
            <Icon className="h-4 w-4 text-primary" />
            {label}
          </Link>
        ))}
      </div>
    </Card>
  );
}
