import { cn } from "../../../lib/cn";
import { payoutSchedules, type ScheduleFrequency } from "../payoutSchedules";

const classesByFrequency: Record<ScheduleFrequency, string> = {
  "end-of-day": "bg-tag-healthcare-bg text-tag-healthcare-fg",
  "first-of-week": "bg-tag-info-bg text-tag-info-fg",
  "bi-weekly": "bg-tag-warning-bg text-tag-warning-fg",
  "on-demand": "bg-tag-standard-bg text-tag-standard-fg",
  custom: "bg-tag-standard-bg text-tag-standard-fg",
};

const labelsByFrequency: Record<ScheduleFrequency, string> = {
  "end-of-day": "End of Day",
  "first-of-week": "First of Week",
  "bi-weekly": "Bi-Weekly",
  "on-demand": "Manual Only",
  custom: "Custom",
};

export function PayoutScheduleTypeBadge({ scheduleId }: { scheduleId: string }) {
  const schedule = payoutSchedules.find((s) => s.id === scheduleId);
  const frequency = schedule?.frequency ?? "custom";
  const label = frequency === "custom" && schedule ? schedule.name : labelsByFrequency[frequency];

  return <span className={cn("text-badge rounded-full px-2.5 py-0.5", classesByFrequency[frequency])}>{label}</span>;
}
