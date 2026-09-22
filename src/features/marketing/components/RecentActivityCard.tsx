import { Card } from "../../../components/Card";
import { cn } from "../../../lib/cn";
import type { RecentActivityEntry } from "../data";

interface RecentActivityCardProps {
  entries: RecentActivityEntry[];
}

// Dot-timeline, mirrors VerificationHistoryCard's layout. "scheduled" reuses
// the existing --color-tag-overnight-fg token for its purple dot rather than
// inventing a new color (rule 6).
export function RecentActivityCard({ entries }: RecentActivityCardProps) {
  return (
    <Card className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold text-text">Recent Activity</h3>
      <div className="flex flex-col gap-3">
        {entries.map((entry) => (
          <div key={entry.id} className="flex gap-3">
            <span
              className={cn(
                "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full",
                entry.tone === "success" ? "bg-success" : "bg-tag-overnight-fg",
              )}
            />
            <div>
              <p className="text-sm font-medium text-text">{entry.title}</p>
              <p className="text-sm text-text-muted">{entry.description}</p>
              <p className="text-xs text-text-muted">{entry.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
