import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card } from "../../../components/Card";
import { cn } from "../../../lib/cn";

interface BranchStatsRowProps {
  totalActiveHubs: number;
  hubsDeltaLabel: string;
  globalDispatchRate: string;
  activeOperationalUsers: number;
  operationalUserCap: number;
  totalNetworkSpend: string;
  networkSpendDeltaLabel: string;
}

export function BranchStatsRow({
  totalActiveHubs,
  hubsDeltaLabel,
  globalDispatchRate,
  activeOperationalUsers,
  operationalUserCap,
  totalNetworkSpend,
  networkSpendDeltaLabel,
}: BranchStatsRowProps) {
  const stats = [
    { label: "Total Active Hubs", value: String(totalActiveHubs), delta: hubsDeltaLabel, tone: "success" as const },
    { label: "Global Dispatch Rate", value: globalDispatchRate, tone: "success" as const, iconOnly: true },
    {
      label: "Active Operational Users",
      value: String(activeOperationalUsers),
      suffix: `/ ${operationalUserCap} cap`,
    },
    {
      label: "Total Network Spend",
      value: totalNetworkSpend,
      delta: networkSpendDeltaLabel,
      tone: "danger" as const,
      valueClass: "text-primary",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const DeltaIcon = stat.tone === "danger" ? ArrowDownRight : ArrowUpRight;
        return (
          <Card key={stat.label} className="flex flex-col gap-3">
            <span className="text-label text-text-muted">{stat.label}</span>
            <div className="flex items-baseline gap-2">
              <span className={cn("text-2xl font-semibold", stat.valueClass ?? "text-text")}>{stat.value}</span>
              {stat.suffix && <span className="text-sm text-text-muted">{stat.suffix}</span>}
              {stat.tone && (
                <span
                  className={cn(
                    "inline-flex items-center gap-0.5 text-xs font-medium",
                    stat.tone === "danger" ? "text-danger" : "text-success",
                  )}
                >
                  <DeltaIcon className="h-3.5 w-3.5" />
                  {!stat.iconOnly && stat.delta}
                </span>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
