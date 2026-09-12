import type { ReactNode } from "react";
import { Controller, type Control, type FieldValues, type Path, type RegisterOptions } from "react-hook-form";
import { cn } from "../lib/cn";

type FieldType = "text" | "textarea" | "select" | "date" | "time" | "datetime-local" | "number";

interface SelectOption {
  value: string;
  label: string;
}

interface FormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  type?: FieldType;
  placeholder?: string;
  options?: SelectOption[];
  rules?: RegisterOptions<T, Path<T>>;
  /** Trailing icon inside the input, e.g. a search icon on a lookup field. */
  icon?: ReactNode;
  /** Visually greyed-out and non-editable — e.g. a value derived from another field. */
  readOnly?: boolean;
}

// All form inputs in this project go through react-hook-form's Controller,
// including plain text fields — see CLAUDE.md working rule 7.
export function FormField<T extends FieldValues>({
  control,
  name,
  label,
  type = "text",
  placeholder,
  options,
  rules,
  icon,
  readOnly,
}: FormFieldProps<T>) {
  const inputClasses = cn(
    "rounded-md border border-border px-3 py-2 text-sm text-text placeholder:text-text-muted",
    readOnly && "bg-bg text-text-muted",
  );

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-text-muted">{label}</span>
          {type === "textarea" ? (
            <textarea {...field} placeholder={placeholder} rows={2} className={inputClasses} readOnly={readOnly} />
          ) : type === "select" ? (
            <select {...field} className={inputClasses}>
              {options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : icon ? (
            <div className={cn("flex items-center gap-2", inputClasses)}>
              <input
                {...field}
                type={type}
                placeholder={placeholder}
                readOnly={readOnly}
                className="w-full min-w-0 bg-transparent focus:outline-none"
              />
              <span className="shrink-0 text-text-muted">{icon}</span>
            </div>
          ) : (
            <input {...field} type={type} placeholder={placeholder} readOnly={readOnly} className={inputClasses} />
          )}
          {fieldState.error && <span className="text-xs text-danger">{fieldState.error.message}</span>}
        </label>
      )}
    />
  );
}
