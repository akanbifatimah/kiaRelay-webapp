import { Clock } from "lucide-react";
import { Button } from "../../../components/Button";
import { TagChip } from "../../../components/TagChip";
import { cn } from "../../../lib/cn";
import type { QueuedOrder } from "../data";

interface OrderQueueCardProps {
  order: QueuedOrder;
  onAssign: () => void;
}

const accentBorder: Record<QueuedOrder["type"], string> = {
  express: "border-l-4 border-l-tag-express-fg",
  standard: "border-l-4 border-l-tag-standard-fg",
  freight: "border-l-4 border-l-tag-freight-fg",
  healthcare: "border-l-4 border-l-tag-healthcare-fg",
  overnight: "border-l-4 border-l-tag-overnight-fg",
};

const tintedBox: Record<QueuedOrder["type"], string> = {
  express: "bg-tag-express-bg",
  standard: "bg-tag-standard-bg",
  freight: "bg-tag-freight-bg",
  healthcare: "bg-tag-healthcare-bg",
  overnight: "bg-tag-overnight-bg",
};

export function OrderQueueCard({ order, onAssign }: OrderQueueCardProps) {
  return (
    <div className={cn("flex flex-col gap-2 rounded-lg border border-border bg-surface p-3", accentBorder[order.type])}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-text">{order.id}</span>
        <TagChip type={order.type} />
      </div>
      <p className="text-sm font-medium text-text">{order.title}</p>
      <div className={cn("flex flex-col gap-1 rounded-md p-2 text-xs text-text", tintedBox[order.type])}>
        <p>
          <span className="text-text-muted">Package:</span> {order.packageDescription} ({order.weightKg}kg)
        </p>
        <p>
          <span className="text-text-muted">Route:</span> {order.pickupLabel} &rarr; {order.dropoffLabel}
        </p>
      </div>
      <div className="flex items-center justify-between pt-1">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-wide text-text-muted">Wait Time</span>
          <span className="inline-flex items-center gap-1 text-sm font-medium text-text">
            <Clock className="h-3.5 w-3.5 text-text-muted" />
            {order.waitTimeLabel}
          </span>
        </div>
        <Button type="button" size="sm" variant="dark" onClick={onAssign}>
          Assign
        </Button>
      </div>
    </div>
  );
}
