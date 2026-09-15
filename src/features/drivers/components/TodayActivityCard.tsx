import { Card } from "../../../components/Card";
import { Button } from "../../../components/Button";
import { cn } from "../../../lib/cn";
import type { TodayActivityEntry, TodayActivityType } from "../driverPerformanceDetail";

const dotClasses: Record<TodayActivityType, string> = {
  delivery: "bg-success",
  status: "bg-info",
  maintenance: "bg-danger",
  shift: "bg-text-muted",
};

interface TodayActivityCardProps {
  entries: TodayActivityEntry[];
  onViewHistory: () => void;
}

// Distinct from DriverActivityLogCard/Timeline (Overview's compliance-style
// audit trail) — this is today's live driving feed, own layout: colored dot,
// title + description, timestamp top-right.
export function TodayActivityCard({ entries, onViewHistory }: TodayActivityCardProps) {
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text">Activity Log</h3>
        <span className="text-label text-text-muted">Today</span>
      </div>

      {entries.length === 0 ? (
        <p className="py-6 text-center text-sm text-text-muted">No activity recorded today.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {entries.map((entry) => (
            <div key={entry.id} className="flex items-start gap-2.5">
              <span className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", dotClasses[entry.type])} />
              <div className="flex flex-1 items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-text">{entry.title}</p>
                  <p className="text-xs text-text-muted">{entry.description}</p>
                </div>
                <span className="shrink-0 text-xs text-text-muted">{entry.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <Button variant="secondary" onClick={onViewHistory}>
        View History
      </Button>
    </Card>
  );
}
