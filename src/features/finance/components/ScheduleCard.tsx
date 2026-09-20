import { Sun, CalendarDays, Repeat, Zap, Check, Pencil, type LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "../../../components/Tooltip";
import { cn } from "../../../lib/cn";
import type { PayoutSchedule } from "../payoutSchedules";

const iconByFrequency: Record<PayoutSchedule["frequency"], LucideIcon> = {
  "end-of-day": Sun,
  "first-of-week": CalendarDays,
  "bi-weekly": Repeat,
  "on-demand": Zap,
  custom: CalendarDays,
};

interface ScheduleCardProps {
  schedule: PayoutSchedule;
  onEdit: () => void;
  onSetGlobalDefault: () => void;
  onActivate: () => void;
}

// Plain styled div, not Card + a conflicting className — the default
// schedule needs a full border-color override (border-2 border-primary vs
// every other card's border border-border), which is the same
// non-conflicting-vs-conflicting distinction this session keeps re-hitting.
export function ScheduleCard({ schedule, onEdit, onSetGlobalDefault, onActivate }: ScheduleCardProps) {
  const navigate = useNavigate();
  const Icon = iconByFrequency[schedule.frequency];

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/finance/payout-schedules/${schedule.id}/assign`)}
      onKeyDown={(e) => e.key === "Enter" && navigate(`/finance/payout-schedules/${schedule.id}/assign`)}
      className={cn(
        "flex cursor-pointer flex-col gap-3 rounded-[var(--radius-card)] border bg-surface p-5 shadow-sm",
        schedule.isGlobalDefault ? "border-2 border-primary" : "border border-border",
      )}
    >
      <div className="flex items-center justify-between">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-tag-warning-bg text-tag-warning-fg">
          <Icon className="h-4 w-4" />
        </span>
        <div className="flex items-center gap-1.5">
          {schedule.isGlobalDefault && (
            <span className="text-badge rounded-full bg-tag-warning-bg px-2 py-0.5 text-tag-warning-fg">Default</span>
          )}
          {schedule.isActive && (
            <span className="text-badge rounded-full bg-tag-healthcare-bg px-2 py-0.5 text-tag-healthcare-fg">Active</span>
          )}
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-text">{schedule.name}</p>
        <p className="mt-1 text-xs text-text-muted">{schedule.description}</p>
      </div>

      <div className="flex items-center gap-4 rounded-lg bg-bg px-3 py-2">
        <div>
          <p className="text-[10px] uppercase text-text-muted">Drivers</p>
          <p className="text-sm font-medium text-text">{schedule.driverCount.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase text-text-muted">{schedule.feeLabel ? "Fee" : "Next Date"}</p>
          <p className="text-sm font-medium text-text">{schedule.feeLabel ?? schedule.nextPayoutDate}</p>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-border pt-3">
        {schedule.isGlobalDefault ? (
          <span className="flex items-center gap-1 text-xs font-medium text-success">
            <Check className="h-3.5 w-3.5" />
            Primary Default
          </span>
        ) : !schedule.isActive ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onActivate();
            }}
            className="text-xs font-medium text-primary hover:underline"
          >
            Activate Schedule
          </button>
        ) : (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSetGlobalDefault();
            }}
            className="text-xs font-medium text-primary hover:underline"
          >
            Set as Global Default
          </button>
        )}
        <Tooltip label="Edit schedule">
          <button
            type="button"
            aria-label="Edit schedule"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="text-text-muted hover:text-text"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
        </Tooltip>
      </div>
    </div>
  );
}
