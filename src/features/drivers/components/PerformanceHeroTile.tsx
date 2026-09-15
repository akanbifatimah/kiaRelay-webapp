import { Star, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "../../../lib/cn";

interface PerformanceHeroTileProps {
  onTimePct: number;
  deltaPct: number;
  rating: number;
  deliveriesCount: number;
}

// Plain styled div, not Card + a bg-primary override (cn() is plain
// concatenation, not a Tailwind merge — see Button's className-override
// precedent in CLAUDE.md; Card's baked-in bg-surface isn't safely
// overridable the same way).
export function PerformanceHeroTile({ onTimePct, deltaPct, rating, deliveriesCount }: PerformanceHeroTileProps) {
  const DeltaIcon = deltaPct < 0 ? ArrowDown : ArrowUp;

  return (
    <div className="flex h-full flex-col gap-3 rounded-[var(--radius-card)] border border-border bg-primary p-5 text-primary-foreground shadow-sm">
      <span className="text-label text-primary-foreground/80">On-Time Performance</span>
      <div>
        <p className="text-4xl font-semibold">{onTimePct}%</p>
        {deltaPct !== 0 && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 text-xs font-medium",
              deltaPct < 0 ? "text-primary-foreground/70" : "text-primary-foreground",
            )}
          >
            <DeltaIcon className="h-3 w-3" />
            {Math.abs(deltaPct)}% MoM
          </span>
        )}
      </div>
      <div className="flex items-center gap-1 text-sm">
        <Star className="h-4 w-4 fill-primary-foreground text-primary-foreground" />
        {rating.toFixed(1)}
        <span className="text-primary-foreground/80">· Based on {deliveriesCount.toLocaleString()} deliveries</span>
      </div>
    </div>
  );
}
