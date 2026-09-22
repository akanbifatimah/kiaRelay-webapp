import { MousePointerClick } from "lucide-react";
import type { Control } from "react-hook-form";
import { FormField } from "../../../components/FormField";
import type { CreateEmailFormValues } from "../createEmailForm";

interface EmailActionButtonFieldsProps {
  control: Control<CreateEmailFormValues>;
}

export function EmailActionButtonFields({ control }: EmailActionButtonFieldsProps) {
  return (
    <div className="flex flex-col gap-3 rounded-lg bg-bg p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-2.5">
        <MousePointerClick className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <div>
          <p className="text-sm font-medium text-text">Action Button</p>
          <p className="text-xs text-text-muted">Prominent click target placed inside the message</p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:min-w-88 sm:grid-cols-2">
        <FormField control={control} name="actionLabel" label="Label" placeholder="Book a delivery" />
        <FormField control={control} name="actionUrl" label="URL" placeholder="https://app.kiarelay.com/…" />
      </div>
    </div>
  );
}
