import { useState } from "react";
import { Controller, type Control, type FieldValues, type Path, type RegisterOptions } from "react-hook-form";
import { Lock, Eye, EyeOff } from "lucide-react";

interface PasswordFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  rules?: RegisterOptions<T, Path<T>>;
}

export function PasswordField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder = "••••••••",
  rules,
}: PasswordFieldProps<T>) {
  const [show, setShow] = useState(false);

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <label className="flex flex-col gap-1 text-sm">
          {label && <span className="font-medium text-text">{label}</span>}
          <div className="flex items-center gap-2 rounded-md border border-border px-3 py-2">
            <Lock className="h-4 w-4 shrink-0 text-text-muted" />
            <input
              {...field}
              type={show ? "text" : "password"}
              placeholder={placeholder}
              className="w-full min-w-0 bg-transparent text-sm text-text placeholder:text-text-muted focus:outline-none"
            />
            <button
              type="button"
              aria-label={show ? "Hide password" : "Show password"}
              onClick={() => setShow((value) => !value)}
              className="shrink-0 text-text-muted hover:text-text"
            >
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {fieldState.error && <span className="text-xs text-danger">{fieldState.error.message}</span>}
        </label>
      )}
    />
  );
}
