import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";
import type { LucideIcon } from "lucide-react";
import { Switch } from "../../../components/Switch";
import { cn } from "../../../lib/cn";

interface SettingsToggleRowProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  title: string;
  description: string;
  icon?: LucideIcon;
  /** e.g. "Mandatory Field" / "Handshake" / "Optional" chip after the title. */
  tag?: { label: string; tone: "danger" | "neutral" };
  /** Mandatory requirements stay on — shown but not switchable. */
  locked?: boolean;
  tone?: "primary" | "dark";
}

export function SettingsToggleRow<T extends FieldValues>({ control, name, title, description, icon: Icon, tag, locked, tone = "primary" }: SettingsToggleRowProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange } }) => (
        <div className="flex items-center justify-between gap-4 rounded-lg bg-bg p-4">
          <div className="flex min-w-0 items-start gap-3">
            {Icon && (
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-surface text-text-muted">
                <Icon className="h-4 w-4" />
              </span>
            )}
            <div className="min-w-0">
              <p className="flex flex-wrap items-center gap-2 text-sm font-semibold text-text">
                {title}
                {tag && (
                  <span className={cn("text-label rounded px-1.5 py-0.5", tag.tone === "danger" ? "bg-tag-express-bg text-tag-express-fg" : "bg-surface text-text-muted")}>
                    {tag.label}
                  </span>
                )}
              </p>
              <p className="mt-0.5 text-xs text-text-muted">{description}</p>
              {locked && <p className="mt-1 text-[11px] text-text-muted">Required for compliance — can't be turned off.</p>}
            </div>
          </div>
          <Switch checked={Boolean(value)} onChange={onChange} label={title} disabled={locked} tone={tone} />
        </div>
      )}
    />
  );
}
