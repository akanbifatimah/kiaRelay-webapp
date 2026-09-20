import {
  TrendingUp,
  Landmark,
  Truck,
  FileClock,
  RotateCcw,
  Percent,
  BadgePercent,
  PlusCircle,
  ClipboardList,
  ArrowUp,
  ArrowDown,
  type LucideIcon,
} from "lucide-react";
import { Card } from "../../../components/Card";
import { cn } from "../../../lib/cn";
import type { FinanceStat, FinanceStatType } from "../data";

const iconByType: Record<FinanceStatType, LucideIcon> = {
  revenue: TrendingUp,
  net: Landmark,
  payouts: Truck,
  pending: FileClock,
  refunds: RotateCcw,
  fees: Percent,
  commission: BadgePercent,
  credits: PlusCircle,
  adjustments: ClipboardList,
};

const iconBoxByType: Record<FinanceStatType, string> = {
  revenue: "bg-tag-warning-bg text-tag-warning-fg",
  net: "bg-tag-healthcare-bg text-tag-healthcare-fg",
  payouts: "bg-tag-warning-bg text-tag-warning-fg",
  pending: "bg-tag-danger-bg text-tag-danger-fg",
  refunds: "bg-tag-danger-bg text-tag-danger-fg",
  fees: "bg-tag-standard-bg text-tag-standard-fg",
  commission: "bg-tag-standard-bg text-tag-standard-fg",
  credits: "bg-tag-healthcare-bg text-tag-healthcare-fg",
  adjustments: "bg-tag-warning-bg text-tag-warning-fg",
};

function formatCurrency(value: number): string {
  const sign = value < 0 ? "-" : "";
  return `${sign}$${Math.abs(value).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
}

// Own component, not an extension of shared StatTile — the icon-badge shape
// doesn't exist on StatTile, and this avoids risking StatTile's ~15 other
// call sites for one page's needs (same reasoning as PerformanceHeroTile/
// PerformanceMetricTile on the driver side).
export function FinanceStatTile({ type, label, value, isCurrency = true, deltaPct, invertDeltaColor, secondaryLabel }: FinanceStat) {
  const Icon = iconByType[type];
  const isGoodDelta = deltaPct !== undefined && (invertDeltaColor ? deltaPct < 0 : deltaPct > 0);
  const DeltaIcon = deltaPct !== undefined && deltaPct < 0 ? ArrowDown : ArrowUp;

  return (
    // min-w-0 lets the value text wrap/shrink instead of blowing out the
    // grid track — flex/grid items default to min-width: auto, so a long
    // formatted currency string ($4,200,000.00) was forcing horizontal
    // overflow on the whole page instead of wrapping inside its own tile.
    <Card className="flex min-w-0 flex-col gap-3">
      <span className={cn("flex h-8 w-8 items-center justify-center rounded-lg", iconBoxByType[type])}>
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="text-label text-text-muted">{label}</p>
        <p className="truncate text-xl font-semibold text-text" title={isCurrency ? formatCurrency(value) : value.toLocaleString()}>
          {isCurrency ? formatCurrency(value) : value.toLocaleString()}
        </p>
      </div>
      {deltaPct !== undefined ? (
        <span
          className={cn(
            "inline-flex items-center gap-0.5 text-xs font-medium",
            isGoodDelta ? "text-success" : "text-danger",
          )}
        >
          <DeltaIcon className="h-3 w-3" />
          {Math.abs(deltaPct)}% {secondaryLabel ?? "vs last period"}
        </span>
      ) : (
        secondaryLabel && <span className="text-xs text-text-muted">{secondaryLabel}</span>
      )}
    </Card>
  );
}
