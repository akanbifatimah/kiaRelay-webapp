import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";
import { Switch } from "./Switch";

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
        <div className="flex items-center gap-2 text-sm text-text">
          <Switch checked={Boolean(value)} onChange={onChange} label={label} />
          <span aria-hidden="true" className="cursor-pointer" onClick={() => onChange(!value)}>
            {label}
          </span>
        </div>
      )}
    />
  );
}
