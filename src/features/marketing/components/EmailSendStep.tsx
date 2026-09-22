import { Controller, type Control, useWatch } from "react-hook-form";
import { Zap, CalendarClock, Trash2 } from "lucide-react";
import { cn } from "../../../lib/cn";
import { Button } from "../../../components/Button";
import type { CreateEmailFormValues } from "../createEmailForm";

interface EmailSendStepProps {
  control: Control<CreateEmailFormValues>;
  recipientCount: number;
  onDiscard: () => void;
  onDownloadHtml: () => void;
}

// datetime-local wants "YYYY-MM-DDTHH:mm" in the viewer's own local time, not
// UTC — offsetting by getTimezoneOffset() before slicing keeps `min` (and the
// past-date check below) from being off by however many hours the viewer is
// from UTC.
function nowAsDatetimeLocal(): string {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
}

export function EmailSendStep({ control, recipientCount, onDiscard, onDownloadHtml }: EmailSendStepProps) {
  const sendTiming = useWatch({ control, name: "sendTiming" });

  return (
    <div className="flex flex-col gap-4">
      <Controller
        name="sendTiming"
        control={control}
        render={({ field: { onChange } }) => (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => onChange("now")}
              className={cn(
                "flex items-start gap-2.5 rounded-lg border p-4 text-left",
                sendTiming === "now" ? "border-primary bg-primary/5" : "border-border hover:bg-bg",
              )}
            >
              <Zap className={cn("mt-0.5 h-4 w-4 shrink-0", sendTiming === "now" ? "text-primary" : "text-text-muted")} />
              <div>
                <p className="text-sm font-medium text-text">Send now</p>
                <p className="text-xs text-text-muted">Deploys immediately to all {recipientCount.toLocaleString()} recipients across relay nodes.</p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => onChange("scheduled")}
              className={cn(
                "flex items-start gap-2.5 rounded-lg border p-4 text-left",
                sendTiming === "scheduled" ? "border-primary bg-primary/5" : "border-border hover:bg-bg",
              )}
            >
              <CalendarClock className={cn("mt-0.5 h-4 w-4 shrink-0", sendTiming === "scheduled" ? "text-primary" : "text-text-muted")} />
              <div>
                <p className="text-sm font-medium text-text">Pick a date and time</p>
                <p className="text-xs text-text-muted">Queue during optimal opening hours (e.g. Mon 7:00 AM Central).</p>
              </div>
            </button>
          </div>
        )}
      />

      {sendTiming === "scheduled" && (
        <Controller
          name="scheduledAt"
          control={control}
          rules={{
            required: "Pick a date and time",
            validate: (value) => new Date(value).getTime() > Date.now() || "Scheduled time must be in the future",
          }}
          render={({ field, fieldState }) => (
            <label className="flex max-w-xs flex-col gap-1 text-sm">
              <span className="text-text-muted">Send at</span>
              <input
                {...field}
                type="datetime-local"
                min={nowAsDatetimeLocal()}
                className="rounded-md border border-border px-3 py-2 text-sm text-text"
              />
              {fieldState.error && <span className="text-xs text-danger">{fieldState.error.message}</span>}
            </label>
          )}
        />
      )}

      <Button type="submit" className="w-full justify-center" size="md">
        {sendTiming === "now" ? `Send email now (${recipientCount.toLocaleString()} recipients)` : `Schedule email for ${recipientCount.toLocaleString()} recipients`}
      </Button>
      <p className="-mt-2 text-center text-xs text-text-muted">You can cancel dispatch within 10 minutes after sending.</p>

      <div className="flex flex-col gap-2 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
        <button type="button" onClick={onDiscard} className="inline-flex items-center gap-1.5 text-sm font-medium text-danger hover:underline">
          <Trash2 className="h-3.5 w-3.5" />
          Discard draft
        </button>
        <div className="flex items-center gap-3 text-xs text-text-muted">
          <span>All changes stored locally</span>
          <button type="button" onClick={onDownloadHtml} className="font-medium text-primary hover:underline">
            Download HTML
          </button>
        </div>
      </div>
    </div>
  );
}
