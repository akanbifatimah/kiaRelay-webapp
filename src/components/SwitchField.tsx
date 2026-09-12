import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";
import { cn } from "../lib/cn";

interface SwitchFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
}

// Controller-wrapped per working rule 7, like every other form input.
export function SwitchField<T extends FieldValues>({ control, name, label }: SwitchFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange } }) => (
        <label className="flex cursor-pointer items-center gap-2 text-sm text-text">
          <span
            role="switch"
            aria-checked={Boolean(value)}
            tabIndex={0}
            onClick={() => onChange(!value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onChange(!value);
              }
            }}
            className={cn(
              "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors",
              value ? "bg-primary" : "bg-border",
            )}
          >
            <span
              className={cn(
                "inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform",
                value ? "translate-x-4" : "translate-x-1",
              )}
            />
          </span>
          {label}
        </label>
      )}
    />
  );
}
