import { History } from "lucide-react";
import { Modal } from "../../../components/Modal";
import { Button } from "../../../components/Button";
import { cn } from "../../../lib/cn";
import type { ScheduleChangeEvent, ScheduleChangeTone } from "../scheduleChangeLog";

const dotClasses: Record<ScheduleChangeTone, string> = {
  success: "bg-success",
  warning: "bg-warning",
  muted: "bg-text-muted",
};

export function ScheduleChangeLogModal({ events, onClose }: { events: ScheduleChangeEvent[]; onClose: () => void }) {
  return (
    <Modal
      title={
        <>
          <History className="h-5 w-5 text-primary" />
          Schedule Change Log
        </>
      }
      onClose={onClose}
      footer={
        <Button type="button" variant="secondary" onClick={onClose}>
          Close
        </Button>
      }
    >
      <ol className="flex flex-col gap-4">
        {events.map((event, index) => (
          <li key={event.id} className="relative flex gap-3">
            {index < events.length - 1 && <span className="absolute left-[3px] top-4 h-full w-px bg-border" />}
            <span className={cn("mt-1 h-1.5 w-1.5 shrink-0 rounded-full", dotClasses[event.tone])} />
            <div>
              <p className="text-sm font-medium text-text">{event.action}</p>
              <p className="text-xs text-text-muted">
                {event.actor} · {event.timestamp}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </Modal>
  );
}
