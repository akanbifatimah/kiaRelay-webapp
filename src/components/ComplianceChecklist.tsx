import { Controller, type Control } from "react-hook-form";
import { cn } from "../lib/cn";
import type { ChecklistFormValues } from "./IdVerificationReviewModal";

export function ComplianceChecklist({
  control,
  labels,
}: {
  control: Control<ChecklistFormValues>;
  labels: string[];
}) {
  return (
    <div className="flex flex-col gap-2">
      {labels.map((label, index) => (
        <Controller
          key={label}
          name={`checks.${index}`}
          control={control}
          render={({ field: { value, onChange, ...field } }) => (
            <label
              className={cn(
                "flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm",
                value ? "bg-tag-healthcare-bg text-tag-healthcare-fg" : "text-text",
              )}
            >
              <input
                {...field}
                type="checkbox"
                checked={value}
                onChange={(event) => onChange(event.target.checked)}
                className="h-4 w-4 rounded accent-success"
              />
              {label}
            </label>
          )}
        />
      ))}
    </div>
  );
}
