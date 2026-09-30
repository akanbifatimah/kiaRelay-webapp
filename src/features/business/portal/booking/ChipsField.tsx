import { Check } from "lucide-react";
import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";
import { cn } from "../../../../lib/cn";

interface ChipsFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  options: readonly string[];
  label?: string;
  /** Checkbox inside each chip ("Handling Requirements"). */
  checkbox?: boolean;
}

/** Multi-select pill chips bound to a string[] field. */
export function ChipsField<T extends FieldValues>({ control, name, options, label, checkbox }: ChipsFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange } }) => {
        const selected = (value ?? []) as string[];
        return (
          <fieldset className="flex flex-col gap-2">
            {label && <legend className="mb-2 text-sm text-text-muted">{label}</legend>}
            <div className="flex flex-wrap gap-2">
              {options.map((option) => {
                const on = selected.includes(option);
                return (
                  <button
                    key={option}
                    type="button"
                    role="checkbox"
                    aria-checked={on}
                    onClick={() => onChange(on ? selected.filter((v) => v !== option) : [...selected, option])}
                    className={cn("flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium", on ? "border-primary bg-primary/10 text-primary" : "border-border bg-bg text-text hover:border-text-muted")}
                  >
                    {checkbox && (
                      <span className={cn("flex h-4 w-4 items-center justify-center rounded border", on ? "border-primary bg-primary" : "border-text-muted bg-surface")}>
                        {on && <Check className="h-3 w-3 text-primary-foreground" strokeWidth={3} />}
                      </span>
                    )}
                    {option}
                  </button>
                );
              })}
            </div>
          </fieldset>
        );
      }}
    />
  );
}
