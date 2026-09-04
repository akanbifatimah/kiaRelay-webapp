import { Controller, type Control, type FieldValues, type Path, type RegisterOptions } from "react-hook-form";

type FieldType = "text" | "textarea" | "select" | "datetime-local" | "number";

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
}: FormFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-text-muted">{label}</span>
          {type === "textarea" ? (
            <textarea
              {...field}
              placeholder={placeholder}
              rows={2}
              className="rounded-md border border-border px-3 py-2 text-sm text-text placeholder:text-text-muted"
            />
          ) : type === "select" ? (
            <select
              {...field}
              className="rounded-md border border-border px-3 py-2 text-sm text-text"
            >
              {options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              {...field}
              type={type}
              placeholder={placeholder}
              className="rounded-md border border-border px-3 py-2 text-sm text-text placeholder:text-text-muted"
            />
          )}
          {fieldState.error && <span className="text-xs text-danger">{fieldState.error.message}</span>}
        </label>
      )}
    />
  );
}
