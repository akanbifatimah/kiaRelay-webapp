import { Card } from "../../../components/Card";
import { cn } from "../../../lib/cn";
import type { InvoiceTimelineEvent, InvoiceTimelineTone } from "../invoiceDetail";

const dotClasses: Record<InvoiceTimelineTone, string> = {
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  muted: "bg-text-muted",
};

export function InvoiceTimelineCard({ events }: { events: InvoiceTimelineEvent[] }) {
  return (
    <Card className="flex h-full flex-col gap-4">
      <h3 className="text-sm font-semibold text-text">Invoice Timeline</h3>
      <ol className="flex flex-col gap-4">
        {events.map((event, index) => (
          <li key={event.label} className="relative flex gap-3">
            {index < events.length - 1 && <span className="absolute left-[3px] top-4 h-full w-px bg-border" />}
            <span className={cn("mt-1 h-1.5 w-1.5 shrink-0 rounded-full", dotClasses[event.tone])} />
            <div>
              <p className="text-sm font-medium text-text">{event.label}</p>
              <p className="text-xs text-text-muted">{event.timestamp}</p>
            </div>
          </li>
        ))}
      </ol>
    </Card>
  );
}
