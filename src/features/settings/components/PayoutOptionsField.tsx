import { Controller, type Control } from "react-hook-form";
import { Check } from "lucide-react";
import { cn } from "../../../lib/cn";
import { PAYOUT_OPTIONS, type PayoutFrequency } from "../payoutOptions";
import type { FinanceSettings } from "../settingsStore";

interface PayoutOptionsFieldProps {
  control: Control<FinanceSettings>;
  /** Lets the page keep the default schedule inside the offered set. */
  onOptionsChange: (next: PayoutFrequency[]) => void;
}

// Multi-select payout options (TC-08, 2026-09-28). Drivers choose among
// every option switched on here, so different preferences are covered. The
// default schedule is picked separately from the enabled ones.
export function PayoutOptionsField({ control, onOptionsChange }: PayoutOptionsFieldProps) {
  return (
    <Controller
      name="payoutOptions"
      control={control}
      rules={{ validate: (value) => value.length > 0 || "Offer drivers at least one payout option." }}
      render={({ field: { value, onChange }, fieldState }) => (
        <div className="flex flex-col gap-2">
          <p className="text-label text-text-muted">Payout Options Offered to Drivers</p>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {PAYOUT_OPTIONS.map((option) => {
              const checked = value.includes(option.value);
              return (
                <button
                  key={option.value}
                  type="button"
                  role="checkbox"
                  aria-checked={checked}
                  onClick={() => {
                    // Keep catalog order so the list reads the same everywhere.
                    const next = PAYOUT_OPTIONS.map((o) => o.value).filter((v) => (v === option.value ? !checked : value.includes(v)));
                    onChange(next);
                    onOptionsChange(next);
                  }}
                  className={cn("flex items-start gap-3 rounded-lg p-4 text-left transition-colors", checked ? "bg-bg" : "bg-bg/60 opacity-70 hover:opacity-100")}
                >
                  <span className={cn("mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-[3px] border", checked ? "border-info bg-info text-white" : "border-border bg-surface")}>
                    {checked && <Check className="h-3 w-3" strokeWidth={3} />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="text-sm font-semibold text-text">{option.label}</span>
                    <span className="block text-xs text-text-muted">{option.description}</span>
                  </span>
                </button>
              );
            })}
          </div>
          {fieldState.error ? (
            <p className="text-xs text-danger">{fieldState.error.message}</p>
          ) : (
            <p className="text-xs text-text-muted">Drivers pick one of these in their payout settings. Switching an option off moves its drivers to the default at the next cycle.</p>
          )}
        </div>
      )}
    />
  );
}
