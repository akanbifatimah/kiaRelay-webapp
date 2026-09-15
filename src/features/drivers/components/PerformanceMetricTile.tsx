import type { LucideIcon } from "lucide-react";
import { Card } from "../../../components/Card";

interface PerformanceMetricTileProps {
  icon: LucideIcon;
  label: string;
  value: string;
  qualifier: string;
}

export function PerformanceMetricTile({ icon: Icon, label, value, qualifier }: PerformanceMetricTileProps) {
  return (
    <Card className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-tag-healthcare-bg text-tag-healthcare-fg">
          <Icon className="h-4 w-4" />
        </span>
        <span className="text-badge rounded-full bg-tag-healthcare-bg px-2 py-0.5 text-tag-healthcare-fg">
          {qualifier}
        </span>
      </div>
      <div>
        <p className="text-xs text-text-muted">{label}</p>
        <p className="text-lg font-semibold text-text">{value}</p>
      </div>
    </Card>
  );
}
