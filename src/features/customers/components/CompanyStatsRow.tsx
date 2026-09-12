import { ArrowUpRight } from "lucide-react";
import { Card } from "../../../components/Card";

interface CompanyStatsRowProps {
  totalDeliveries: number;
  deliveriesDelta: string;
  activeDeliveries: number;
  pendingDeliveries: number;
}

export function CompanyStatsRow({
  totalDeliveries,
  deliveriesDelta,
  activeDeliveries,
  pendingDeliveries,
}: CompanyStatsRowProps) {
  const stats = [
    { label: "Total Deliveries", value: totalDeliveries.toLocaleString(), delta: deliveriesDelta },
    { label: "Active Deliveries", value: String(activeDeliveries), badge: activeDeliveries > 0 ? "Live now" : undefined },
    { label: "Pending Deliveries", value: String(pendingDeliveries) },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.label} className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-text-muted">{stat.label}</span>
            {stat.badge && (
              <span className="text-badge rounded-full bg-primary/10 px-2 py-1 text-primary">{stat.badge}</span>
            )}
          </div>
          <div className="flex items-end gap-2">
            <span className="text-[2.2rem] font-semibold leading-none tracking-[-0.04em] text-text">{stat.value}</span>
            {stat.delta && (
              <span className="mb-1 inline-flex items-center gap-0.5 text-xs font-medium text-success">
                <ArrowUpRight className="h-3.5 w-3.5" />
                {stat.delta}
              </span>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
