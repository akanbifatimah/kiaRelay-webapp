import { Controller, type Control, type Path } from "react-hook-form";
import { Check } from "lucide-react";
import { cn } from "../../../lib/cn";
import type { FinanceSettings } from "../settingsStore";

type MethodField = Extract<Path<FinanceSettings>, `method${string}`>;

interface PaymentMethodTileProps {
  control: Control<FinanceSettings>;
  name: MethodField;
  title: string;
  description: string;
}

const atLeastOne = (_: unknown, values: FinanceSettings) =>
  values.methodAch || values.methodCard || values.methodCredit || values.methodDirectHandoff || "Accept at least one payment method.";

// One "Accepted Payment Methods" tile. Disabled methods read "Inactive" as in
// the design; the at-least-one rule rides on every tile so the error clears
// as soon as any method is switched back on.
export function PaymentMethodTile({ control, name, title, description }: PaymentMethodTileProps) {
  return (
    <Controller
      name={name}
      control={control}
      rules={{ validate: atLeastOne }}
      render={({ field: { value, onChange } }) => (
        <button
          type="button"
          role="checkbox"
          aria-checked={value}
          onClick={() => onChange(!value)}
          className={cn("flex items-start gap-3 rounded-lg p-4 text-left transition-colors", value ? "bg-bg" : "bg-bg/60 opacity-70 hover:opacity-100")}
        >
          <span className={cn("mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-[3px] border", value ? "border-info bg-info text-white" : "border-border bg-surface")}>
            {value && <Check className="h-3 w-3" strokeWidth={3} />}
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex items-center justify-between gap-2 text-sm font-semibold text-text">
              {title}
              {!value && <span className="text-label rounded bg-surface px-1.5 py-0.5 text-text-muted">Inactive</span>}
            </span>
            <span className="text-xs text-text-muted">{description}</span>
          </span>
        </button>
      )}
    />
  );
}
