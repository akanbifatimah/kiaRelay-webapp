import { AlertCircle, CalendarDays, CheckCircle2, ClipboardList, Search } from "lucide-react";
import { Card } from "../../../components/Card";
import { cn } from "../../../lib/cn";
import type { ClaimTileStat } from "../claimStats";

const ICONS: Record<ClaimTileStat["key"], { icon: typeof Search; className: string }> = {
  open: { icon: ClipboardList, className: "text-info" },
  "in-review": { icon: Search, className: "text-warning" },
  escalated: { icon: AlertCircle, className: "text-danger" },
  resolved: { icon: CheckCircle2, className: "text-success" },
  month: { icon: CalendarDays, className: "text-primary" },
};

// Not the shared StatTile: this design puts the icon top-right and colors
// the delta per metric (a rising Escalated count is bad news, a rising
// Resolved count is good), which StatTile's fixed up=green scheme can't say.
const BAD_WHEN_UP: ClaimTileStat["key"][] = ["open", "escalated", "in-review", "month"];

export function ClaimStatTiles({ tiles, activeKey, onSelect }: { tiles: ClaimTileStat[]; activeKey?: string; onSelect: (key: ClaimTileStat["key"]) => void }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
      {tiles.map((tile) => {
        const { icon: Icon, className } = ICONS[tile.key];
        const bad = tile.trend === "flat" ? null : BAD_WHEN_UP.includes(tile.key) === (tile.trend === "up");
        return (
          <button key={tile.key} type="button" onClick={() => onSelect(tile.key)} className="text-left">
            <Card className={cn("flex h-full flex-col gap-2 transition-colors hover:border-primary/40", activeKey === tile.key && "border-primary ring-1 ring-primary")}>
              <div className="flex items-start justify-between gap-2">
                <span className="text-sm text-text-muted">{tile.label}</span>
                <Icon className={cn("h-4 w-4", className)} />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-text">{tile.value.toLocaleString()}</span>
                <span className={cn("text-xs font-medium", bad === null ? "text-text-muted" : bad ? "text-danger" : "text-success")}>{tile.delta}</span>
              </div>
            </Card>
          </button>
        );
      })}
    </div>
  );
}
