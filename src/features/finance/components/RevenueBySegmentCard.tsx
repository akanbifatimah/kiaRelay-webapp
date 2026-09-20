import { Card } from "../../../components/Card";
import type { RevenueSegment } from "../revenueDetail";

function formatCompact(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value}`;
}

export function RevenueBySegmentCard({ segments }: { segments: RevenueSegment[] }) {
  return (
    <Card className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold text-text">Revenue by Segment</h3>
      <div className="flex flex-col gap-3">
        {segments.map((segment) => (
          <div key={segment.key} className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-text">{segment.label}</span>
              <span className="font-medium text-text">
                {formatCompact(segment.revenue)} ({segment.sharePct}%)
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-border">
              <div className="h-full rounded-full bg-sidebar" style={{ width: `${segment.sharePct}%` }} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
