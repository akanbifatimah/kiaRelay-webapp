import { Controller, type Control } from "react-hook-form";
import { CheckCircle2 } from "lucide-react";
import { cn } from "../../../lib/cn";
import type { CreateEmailFormValues, EmailTemplate } from "../createEmailForm";

const templates: { id: EmailTemplate; label: string; description: string }[] = [
  { id: "simple-letter", label: "Simple letter", description: "Clean, human & direct" },
  { id: "big-announcement", label: "Big announcement", description: "Hero banner & headline" },
  { id: "special-offer", label: "Special offer", description: "Promo code & perks" },
];

// Mini layout mockups per template — three stacked bars whose weight/color
// varies just enough to read as distinct at a glance, matching the
// screenshot's thumbnail previews.
function TemplatePreview({ id }: { id: EmailTemplate }) {
  return (
    <div className="flex flex-col gap-1.5 rounded-md bg-bg p-3">
      <div className={cn("h-2 rounded-full bg-text", id === "big-announcement" ? "w-full" : "w-1/2")} />
      <div className="h-1.5 w-full rounded-full bg-border" />
      <div className="h-1.5 w-4/5 rounded-full bg-border" />
      <div className={cn("h-1.5 w-1/3 rounded-full", id === "special-offer" ? "bg-primary" : "bg-primary/70")} />
    </div>
  );
}

interface EmailTemplatePickerProps {
  control: Control<CreateEmailFormValues>;
}

export function EmailTemplatePicker({ control }: EmailTemplatePickerProps) {
  return (
    <Controller
      name="template"
      control={control}
      render={({ field: { value, onChange } }) => (
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-text">Pick a look</span>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {templates.map((template) => (
              <button
                key={template.id}
                type="button"
                onClick={() => onChange(template.id)}
                className={cn(
                  "relative flex flex-col gap-3 rounded-lg border p-3 text-left",
                  value === template.id ? "border-primary bg-primary/5" : "border-border hover:bg-bg",
                )}
              >
                {value === template.id && <CheckCircle2 className="absolute right-2 top-2 h-4 w-4 text-primary" />}
                <TemplatePreview id={template.id} />
                <div>
                  <p className="text-sm font-medium text-text">{template.label}</p>
                  <p className="text-xs text-text-muted">{template.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    />
  );
}
