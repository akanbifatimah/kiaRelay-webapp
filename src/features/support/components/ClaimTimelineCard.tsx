import { Check, Eye, Hourglass } from "lucide-react";
import { Card } from "../../../components/Card";
import { cn } from "../../../lib/cn";
import type { ClaimTimelineEntry } from "../claimInvestigation";

const markerClasses: Record<ClaimTimelineEntry["status"], string> = {
  done: "bg-success text-white",
  active: "bg-primary text-primary-foreground",
  pending: "border-2 border-border bg-surface text-text-muted",
};

const icons = { done: Check, active: Eye, pending: Hourglass };

// Own markup rather than the shared Timeline: this one needs a description
// line and icon markers per step (the screenshot's check / eye / hourglass),
// which the order-tracking Timeline doesn't carry.
export function ClaimTimelineCard({ entries }: { entries: ClaimTimelineEntry[] }) {
  return (
    <Card className="flex flex-col gap-4">
      <h3 className="text-base font-semibold text-text">Timeline</h3>
      <ol className="flex flex-col gap-5">
        {entries.map((entry, index) => {
          const Icon = icons[entry.status];
          return (
            <li key={entry.id} className="relative flex gap-3">
              {index < entries.length - 1 && <span className="absolute left-3.5 top-8 h-[calc(100%-0.75rem)] w-px bg-border" />}
              <span className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-full", markerClasses[entry.status])}>
                <Icon className="h-3.5 w-3.5" />
              </span>
              <div className={cn("min-w-0 flex-1", entry.status === "pending" && "opacity-60")}>
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-sm font-semibold text-text">{entry.title}</p>
                  {entry.time && <span className="whitespace-nowrap text-xs text-text-muted">{entry.time}</span>}
                </div>
                <p className="text-xs text-text-muted">{entry.description}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </Card>
  );
}
