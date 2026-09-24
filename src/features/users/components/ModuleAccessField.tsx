import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";
import { Check } from "lucide-react";
import { cn } from "../../../lib/cn";
import { ALL_MODULES, MODULES, type ModuleKey } from "../../access/modules";

interface ModuleAccessFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  /** Super Admin: every module granted and not editable. */
  locked?: boolean;
}

// "Module Access" block from the Add Team Member design — a Controller over
// a ModuleKey[] field (rule 7), with Grant All / Clear All shortcuts.
export function ModuleAccessField<T extends FieldValues>({ control, name, locked }: ModuleAccessFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      rules={{ validate: (value: ModuleKey[]) => locked || value.length > 0 || "Grant at least one module." }}
      render={({ field: { value, onChange }, fieldState }) => {
        const selected: ModuleKey[] = locked ? ALL_MODULES : value;
        const toggle = (key: ModuleKey) => onChange(selected.includes(key) ? selected.filter((m) => m !== key) : [...selected, key]);
        return (
          <div className="flex flex-col gap-2">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-label text-text-muted">Module Access</p>
                <p className="text-xs text-text-muted">Select authorized applications for this account</p>
              </div>
              {!locked && (
                <div className="flex items-center gap-1.5 text-xs">
                  <button type="button" onClick={() => onChange(ALL_MODULES)} className="font-medium text-primary hover:underline">
                    Grant All Modules
                  </button>
                  <span className="text-text-muted">·</span>
                  <button type="button" onClick={() => onChange([])} className="text-text-muted hover:text-text">
                    Clear All
                  </button>
                </div>
              )}
            </div>
            <div className={cn("grid grid-cols-1 gap-x-6 gap-y-2.5 rounded-lg bg-bg p-3 sm:grid-cols-2", fieldState.error && "ring-1 ring-danger")}>
              {MODULES.map((module) => {
                const checked = selected.includes(module.key);
                return (
                  <label key={module.key} className={cn("flex items-center gap-2 text-sm text-text", locked ? "cursor-not-allowed opacity-70" : "cursor-pointer")}>
                    <input type="checkbox" className="sr-only" checked={checked} disabled={locked} onChange={() => toggle(module.key)} />
                    <span
                      aria-hidden="true"
                      className={cn(
                        "flex h-4 w-4 items-center justify-center rounded-[3px] border",
                        checked ? "border-primary bg-primary text-primary-foreground" : "border-border bg-surface",
                      )}
                    >
                      {checked && <Check className="h-3 w-3" strokeWidth={3} />}
                    </span>
                    {module.label}
                  </label>
                );
              })}
            </div>
            {fieldState.error && <p className="text-xs text-danger">{fieldState.error.message}</p>}
          </div>
        );
      }}
    />
  );
}
