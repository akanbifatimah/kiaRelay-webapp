import type { ReactNode } from "react";
import { Controller, type Control, type FieldValues, type Path, type RegisterOptions } from "react-hook-form";
import { cn } from "../../../lib/cn";
import { Select } from "../../../components/Select";
import type { Option } from "../settingsOptions";

interface SettingsInputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  helper?: string;
  /** Renders a select instead of a text input. */
  options?: Option[];
  type?: "text" | "email" | "tel" | "url" | "number" | "time";
  /** Trailing icon (design's mail/phone/globe/pin glyphs). */
  icon?: ReactNode;
  /** Leading text, e.g. "#" before the invoice prefix or "$" before an amount. */
  prefix?: string;
  suffix?: string;
  mono?: boolean;
  rules?: RegisterOptions<T, Path<T>>;
  onValueChange?: (value: string) => void;
}

// Settings screens use the small-caps label + filled grey input style from
// the designs, which FormField's stacked label doesn't match — so this is a
// settings-local field, still Controller-driven per rule 7.
export function SettingsInput<T extends FieldValues>({ control, name, label, helper, options, type = "text", icon, prefix, suffix, mono, rules, onValueChange }: SettingsInputProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => {
        // A <label> would forward clicks on the listbox's options back to
        // its trigger button and reopen it, so selects use a <div> and label
        // themselves through aria-label.
        const Wrapper = options ? "div" : "label";
        return (
        <Wrapper className="flex flex-col gap-1.5">
          <span className="text-label text-text-muted">{label}</span>
          <span className={cn("flex items-center gap-2 rounded-md bg-bg px-3 py-2.5 text-sm text-text", fieldState.error && "ring-1 ring-danger")}>
            {prefix && <span className="text-text-muted">{prefix}</span>}
            {options ? (
              // Custom listbox instead of <select> so the dropdown list has
              // real padding (TC-07, 2026-09-28).
              <Select
                value={String(field.value ?? "")}
                options={options}
                ariaLabel={label}
                onBlur={field.onBlur}
                onChange={(value) => {
                  field.onChange(value);
                  onValueChange?.(value);
                }}
              />
            ) : (
              <input
                {...field}
                type={type}
                onChange={(event) => field.onChange(type === "number" ? event.target.valueAsNumber : event.target.value)}
                value={type === "number" && Number.isNaN(field.value) ? "" : field.value}
                className={cn("w-full min-w-0 bg-transparent focus:outline-none", mono && "font-mono")}
              />
            )}
            {suffix && <span className="text-xs text-text-muted">{suffix}</span>}
            {!options && icon && <span className="shrink-0 text-text-muted">{icon}</span>}
          </span>
          {fieldState.error ? <span className="text-xs text-danger">{fieldState.error.message}</span> : helper && <span className="text-xs text-text-muted">{helper}</span>}
        </Wrapper>
        );
      }}
    />
  );
}
