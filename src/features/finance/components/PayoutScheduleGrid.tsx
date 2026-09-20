import { ScheduleCard } from "./ScheduleCard";
import { AddNewPolicyCard } from "./AddNewPolicyCard";
import type { PayoutSchedule } from "../payoutSchedules";

interface PayoutScheduleGridProps {
  schedules: PayoutSchedule[];
  onEdit: (schedule: PayoutSchedule) => void;
  onSetGlobalDefault: (schedule: PayoutSchedule) => void;
  onActivate: (schedule: PayoutSchedule) => void;
  onAddNewPolicy: () => void;
}

export function PayoutScheduleGrid({ schedules, onEdit, onSetGlobalDefault, onActivate, onAddNewPolicy }: PayoutScheduleGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {schedules.map((schedule) => (
        <ScheduleCard
          key={schedule.id}
          schedule={schedule}
          onEdit={() => onEdit(schedule)}
          onSetGlobalDefault={() => onSetGlobalDefault(schedule)}
          onActivate={() => onActivate(schedule)}
        />
      ))}
      <AddNewPolicyCard onClick={onAddNewPolicy} />
    </div>
  );
}
