import { Controller, type Control, useWatch } from "react-hook-form";
import { Users, User, Building2, Truck, Filter, Mail, ShieldCheck } from "lucide-react";
import { cn } from "../../../lib/cn";
import { SwitchField } from "../../../components/SwitchField";
import { marketingAreas, EVERYWHERE_ELSE_COUNT } from "../data";
import type { CreateEmailFormValues, RecipientType } from "../createEmailForm";

const recipientTypes: { id: RecipientType; label: string; icon: typeof Users }[] = [
  { id: "everyone", label: "Everyone", icon: Users },
  { id: "individuals", label: "Only individuals", icon: User },
  { id: "businesses", label: "Only businesses", icon: Building2 },
  { id: "drivers", label: "Drivers", icon: Truck },
];

const areaOptions = [...marketingAreas, { id: "everywhere-else", name: "Everywhere else", customerCount: EVERYWHERE_ELSE_COUNT, tone: "okay" as const }];

interface EmailAudienceStepProps {
  control: Control<CreateEmailFormValues>;
  recipientCount: number;
}

export function EmailAudienceStep({ control, recipientCount }: EmailAudienceStepProps) {
  const recipientType = useWatch({ control, name: "recipientType" });
  const sendToAllAreas = useWatch({ control, name: "sendToAllAreas" });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-text">Recipient type</span>
        <Controller
          name="recipientType"
          control={control}
          render={({ field: { onChange } }) => (
            <div className="flex flex-wrap gap-2">
              {recipientTypes.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => onChange(type.id)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium",
                    recipientType === type.id ? "border-primary bg-primary text-primary-foreground" : "border-border text-text hover:bg-bg",
                  )}
                >
                  <type.icon className="h-3.5 w-3.5" />
                  {type.label}
                </button>
              ))}
            </div>
          )}
        />
        <p className="text-xs text-text-muted">Individuals are single customers. Businesses are enterprise accounts with credit terms.</p>
      </div>

      <div className="rounded-lg bg-bg p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-start gap-2">
            <Filter className="mt-0.5 h-4 w-4 text-text-muted" />
            <div>
              <p className="text-sm font-medium text-text">Which areas?</p>
              <p className="text-xs text-text-muted">Filter by regional dispatch coverage</p>
            </div>
          </div>
          <SwitchField control={control} name="sendToAllAreas" label="Send to all areas" />
        </div>
        <Controller
          name="selectedAreaIds"
          control={control}
          render={({ field: { value, onChange } }) => (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {areaOptions.map((area) => {
                const selected = sendToAllAreas || value.includes(area.id);
                return (
                  <button
                    key={area.id}
                    type="button"
                    disabled={sendToAllAreas}
                    onClick={() => onChange(value.includes(area.id) ? value.filter((id: string) => id !== area.id) : [...value, area.id])}
                    className={cn(
                      "flex items-center justify-between rounded-lg border bg-surface px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-60",
                      selected && !sendToAllAreas ? "border-primary" : "border-border",
                    )}
                  >
                    <span className="text-text">{area.name}</span>
                    <span className="rounded-full bg-bg px-2 py-0.5 text-xs font-medium text-text-muted">
                      {area.customerCount.toLocaleString()}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        />
      </div>

      <label className="flex flex-col gap-1 text-sm">
        <span className="text-text-muted">Only send to people who…</span>
        <Controller
          name="sendCondition"
          control={control}
          render={({ field }) => (
            <select {...field} className="rounded-md border border-border px-3 py-2 text-sm text-text">
              <option value="everyone-active">Everyone on the active dispatch list</option>
              <option value="opened-last">Opened the last campaign</option>
              <option value="no-recent-booking">Have not booked in 30 days</option>
            </select>
          )}
        />
      </label>

      <div className="flex flex-col gap-2 rounded-lg bg-primary/10 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-2.5">
          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Mail className="h-3.5 w-3.5" />
          </span>
          <div>
            <p className="text-sm font-medium text-text">This email will go to {recipientCount.toLocaleString()} people</p>
            <p className="text-xs text-text-muted">No duplicate contacts. Cleaned bounces automatically excluded.</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 self-start rounded-full bg-tag-healthcare-bg px-3 py-1 text-xs font-medium text-success sm:self-center">
          <ShieldCheck className="h-3.5 w-3.5" />
          100% Validated
        </span>
      </div>
    </div>
  );
}
