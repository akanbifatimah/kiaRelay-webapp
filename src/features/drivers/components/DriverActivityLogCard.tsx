import { Card } from "../../../components/Card";
import { Timeline, type TimelineStep } from "../../../components/Timeline";

interface DriverActivityLogCardProps {
  steps: TimelineStep[];
  onViewFull?: () => void;
}

export function DriverActivityLogCard({ steps, onViewFull }: DriverActivityLogCardProps) {
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-label text-text-muted">Activity Log</h3>
        {onViewFull && (
          <button type="button" onClick={onViewFull} className="text-xs font-medium text-primary hover:underline">
            View Full Log
          </button>
        )}
      </div>
      <Timeline steps={steps} />
    </Card>
  );
}
