import { Controller, useForm, useWatch } from "react-hook-form";
import { useToast } from "../../../components/toast/ToastContext";
import { SwitchField } from "../../../components/SwitchField";
import { cn } from "../../../lib/cn";
import { FREQUENCY_OPTIONS, parseRecipients, saveReportSchedule, useReportSchedule, validateRecipients, type ReportSchedule } from "../reportSchedules";

interface ReportScheduleFormProps {
  reportId: string;
  reportName: string;
}

const inputClasses = "rounded-md border border-border bg-surface px-2.5 py-1.5 text-sm text-text disabled:bg-bg disabled:text-text-muted";

// "Email Report Automation" strip under the Revenue ledger. Inline one-row
// layout per the design, so it uses Controller directly rather than
// FormField (whose stacked label/input layout doesn't fit a single row).
export function ReportScheduleForm({ reportId, reportName }: ReportScheduleFormProps) {
  const { showToast } = useToast();
  const saved = useReportSchedule(reportId);
  const { control, handleSubmit, formState } = useForm<ReportSchedule>({ defaultValues: saved });
  const enabled = useWatch({ control, name: "enabled" });

  function onSubmit(values: ReportSchedule) {
    saveReportSchedule(reportId, values);
    const count = parseRecipients(values.recipients).length;
    const frequency = FREQUENCY_OPTIONS.find((option) => option.value === values.frequency)?.label ?? values.frequency;
    showToast(
      "success",
      values.enabled
        ? `${reportName} will be emailed ${frequency.toLowerCase()} to ${count} recipient${count === 1 ? "" : "s"}.`
        : `Email automation for ${reportName} turned off.`,
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 rounded-lg bg-bg p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="shrink-0 font-semibold">
          <SwitchField control={control} name="enabled" label="Email Report Automation" />
        </div>
        <span className="hidden h-5 w-px bg-border lg:block" />
        <label className="flex items-center gap-2 text-sm text-text-muted">
          Frequency:
          <Controller
            name="frequency"
            control={control}
            render={({ field }) => (
              <select {...field} disabled={!enabled} className={inputClasses}>
                {FREQUENCY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}
          />
        </label>
        <Controller
          name="recipients"
          control={control}
          rules={{ validate: (value, values) => validateRecipients(value, values.enabled) }}
          render={({ field, fieldState }) => (
            <label className="flex min-w-0 flex-1 items-center gap-2 text-sm text-text-muted">
              Recipients:
              <input
                {...field}
                disabled={!enabled}
                placeholder="name@kiarelay.com, another@kiarelay.com"
                className={cn(inputClasses, "min-w-0 flex-1", fieldState.error && "border-danger")}
              />
            </label>
          )}
        />
      </div>
      {formState.errors.recipients && <p className="text-xs text-danger">{formState.errors.recipients.message}</p>}
      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" className="rounded-md bg-sidebar px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90">
          Save Schedule
        </button>
        {saved.savedAt && (
          <span className="text-xs text-text-muted">Last saved {new Date(saved.savedAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}</span>
        )}
      </div>
    </form>
  );
}
