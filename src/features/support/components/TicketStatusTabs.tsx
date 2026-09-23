import { cn } from "../../../lib/cn";
import { statusLabels, type TicketStatus } from "../types";

const TABS: TicketStatus[] = ["open", "awaiting-customer", "awaiting-internal", "resolved"];

interface TicketStatusTabsProps {
  value: TicketStatus;
  counts: Record<TicketStatus, number>;
  onChange: (status: TicketStatus) => void;
}

// Resolved has no count chip in the screenshot — it's history, not a queue.
export function TicketStatusTabs({ value, counts, onChange }: TicketStatusTabsProps) {
  return (
    <div role="tablist" className="flex gap-6 overflow-x-auto border-b border-border">
      {TABS.map((tab) => {
        const active = tab === value;
        return (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab)}
            className={cn(
              "-mb-px flex items-center gap-2 whitespace-nowrap border-b-2 pb-3 text-sm font-medium",
              active ? "border-primary text-primary" : "border-transparent text-text-muted hover:text-text",
            )}
          >
            {statusLabels[tab]}
            {tab !== "resolved" && (
              <span
                className={cn(
                  "rounded-full px-1.5 text-xs",
                  active ? "bg-primary/10 text-primary" : "bg-bg text-text-muted",
                )}
              >
                {counts[tab]}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
