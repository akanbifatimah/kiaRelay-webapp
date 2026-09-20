import { useState } from "react";
import { ArrowLeft, History, PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { PageHeader } from "../../components/PageHeader";
import { Button } from "../../components/Button";
import { useToast } from "../../components/toast/ToastContext";
import { PayoutScheduleGrid } from "./components/PayoutScheduleGrid";
import { DriverOverridesSection } from "./components/DriverOverridesSection";
import { CreateEditPayoutPolicyModal } from "./components/CreateEditPayoutPolicyModal";
import { AddScheduleOverrideModal } from "./components/AddScheduleOverrideModal";
import { ScheduleChangeLogModal } from "./components/ScheduleChangeLogModal";
import { payoutSchedules as initialSchedules, driverOverrides as initialOverrides, type PayoutSchedule, type DriverOverride } from "./payoutSchedules";
import { scheduleChangeLog } from "./scheduleChangeLog";

export function PayoutSchedulesPage() {
  const { showToast } = useToast();
  const [schedules, setSchedules] = useState<PayoutSchedule[]>(initialSchedules);
  const [overrides, setOverrides] = useState<DriverOverride[]>(initialOverrides);
  const [editingSchedule, setEditingSchedule] = useState<PayoutSchedule | null>(null);
  const [isCreatingSchedule, setIsCreatingSchedule] = useState(false);
  const [isAddingOverride, setIsAddingOverride] = useState(false);
  const [isViewingChanges, setIsViewingChanges] = useState(false);

  function upsertSchedule(schedule: PayoutSchedule) {
    setSchedules((prev) => (prev.some((s) => s.id === schedule.id) ? prev.map((s) => (s.id === schedule.id ? schedule : s)) : [schedule, ...prev]));
  }

  function upsertOverride(override: DriverOverride) {
    setOverrides((prev) => (prev.some((o) => o.id === override.id) ? prev.map((o) => (o.id === override.id ? override : o)) : [override, ...prev]));
  }

  return (
    <div className="flex flex-col gap-6">
      <Link to="/finance" className="flex w-fit items-center gap-1.5 text-sm text-text-muted hover:text-text">
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Finance
      </Link>

      <PageHeader
        title="Payout Schedule Management"
        subtitle="Configure and manage automated payment frequencies for the fleet and individual contractors."
        actions={
          <>
            <Button type="button" variant="secondary" onClick={() => setIsViewingChanges(true)}>
              <History className="h-4 w-4" />
              View Changes
            </Button>
            <Button type="button" variant="danger" onClick={() => setIsAddingOverride(true)}>
              <PlusCircle className="h-4 w-4" />
              Add Schedule Override
            </Button>
          </>
        }
      />

      <PayoutScheduleGrid
        schedules={schedules}
        onEdit={setEditingSchedule}
        onSetGlobalDefault={(schedule) => {
          setSchedules((prev) => prev.map((s) => ({ ...s, isGlobalDefault: s.id === schedule.id })));
          showToast("success", `${schedule.name} is now the global default schedule.`);
        }}
        onActivate={(schedule) => {
          setSchedules((prev) => prev.map((s) => (s.id === schedule.id ? { ...s, isActive: true } : s)));
          showToast("success", `${schedule.name} schedule activated.`);
        }}
        onAddNewPolicy={() => setIsCreatingSchedule(true)}
      />

      <DriverOverridesSection overrides={overrides} onUpdateOverride={upsertOverride} />

      {(editingSchedule || isCreatingSchedule) && (
        <CreateEditPayoutPolicyModal
          schedule={editingSchedule ?? undefined}
          onClose={() => {
            setEditingSchedule(null);
            setIsCreatingSchedule(false);
          }}
          onSubmit={(schedule) => {
            upsertSchedule(schedule);
            showToast("success", `Policy "${schedule.name}" saved.`);
          }}
        />
      )}

      {isAddingOverride && (
        <AddScheduleOverrideModal
          onClose={() => setIsAddingOverride(false)}
          onSubmit={(override) => {
            upsertOverride(override);
            showToast("success", `Schedule override added for ${override.subjectName}.`);
          }}
        />
      )}

      {isViewingChanges && <ScheduleChangeLogModal events={scheduleChangeLog} onClose={() => setIsViewingChanges(false)} />}
    </div>
  );
}
