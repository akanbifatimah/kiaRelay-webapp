import type { ReactNode } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { Card } from "../../../components/Card";
import { cn } from "../../../lib/cn";

interface ReportStatCardProps {
  label: string;
  value: string;
  /** Optional muted line under the label, e.g. "Avg orders per account by tier". */
  hint?: string;
  unit?: string;
  delta?: { label: string; direction: "up" | "down" | "flat"; /** Set when "down" is the good direction (claim rate). */ invert?: boolean };
  icon?: ReactNode;
  onClick?: () => void;
}

// Report KPI tile — monospaced figure per the report designs, distinct from
// StatTile's colored left-border treatment used on operational screens.
export function ReportStatCard({ label, value, hint, unit, delta, icon, onClick }: ReportStatCardProps) {
  const good = delta && delta.direction !== "flat" && (delta.direction === "up") !== Boolean(delta.invert);
  const DeltaIcon = delta?.direction === "down" ? TrendingDown : TrendingUp;
  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-label text-text-muted">{label}</p>
          {hint && <p className="mt-0.5 text-xs text-text-muted">{hint}</p>}
        </div>
        {icon && <span className="text-text-muted">{icon}</span>}
      </div>
      <div className="flex flex-wrap items-baseline gap-2">
        <span className="font-mono text-2xl font-semibold tabular-nums text-text">{value}</span>
        {unit && <span className="text-sm text-text-muted">{unit}</span>}
        {delta && delta.direction !== "flat" && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-medium",
              good ? "bg-success/10 text-success" : "bg-danger/10 text-danger",
            )}
          >
            <DeltaIcon className="h-3 w-3" />
            {delta.label}
          </span>
        )}
      </div>
    </>
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className="text-left">
        <Card className="flex h-full flex-col gap-3 transition-colors hover:border-text-muted">{body}</Card>
      </button>
    );
  }
  return <Card className="flex h-full flex-col gap-3">{body}</Card>;
}
