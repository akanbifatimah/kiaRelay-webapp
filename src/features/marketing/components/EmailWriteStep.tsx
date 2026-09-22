import { Controller, type Control } from "react-hook-form";
import { Bold, Italic, Link2, Image, Code2, ChevronDown } from "lucide-react";
import { FormField } from "../../../components/FormField";
import { Tooltip } from "../../../components/Tooltip";
import type { CreateEmailFormValues } from "../createEmailForm";
import { EmailTemplatePicker } from "./EmailTemplatePicker";
import { EmailActionButtonFields } from "./EmailActionButtonFields";

interface EmailWriteStepProps {
  control: Control<CreateEmailFormValues>;
}

// Toolbar icons are decorative — the textarea only supports plain text per
// working rule 4 (Insert Variable, bold/italic etc. are TODO: a real rich
// text editor would replace this whole block).
export function EmailWriteStep({ control }: EmailWriteStepProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          control={control}
          name="internalName"
          label="Internal email name"
          placeholder="May Weekend Delivery Update"
          rules={{ required: "Required" }}
        />
        <FormField
          control={control}
          name="subject"
          label="Subject line"
          placeholder="Reliable freight dispatch across Texas this weekend"
          rules={{ required: "Required" }}
        />
      </div>
      <p className="-mt-3 grid grid-cols-1 gap-4 text-xs text-text-muted sm:grid-cols-2">
        <span>Only your dispatch team sees this.</span>
        <span>This is the first thing they see in their inbox.</span>
      </p>

      <EmailTemplatePicker control={control} />

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-text">Write your message</span>
          <span className="text-xs text-text-muted">Supports plain text formatting</span>
        </div>
        <div className="rounded-lg border border-border">
          <div className="flex items-center gap-1 border-b border-border bg-bg px-2 py-1.5">
            {[Bold, Italic, Link2, Image, Code2].map((Icon, i) => (
              <Tooltip key={i} label="Formatting — coming soon">
                <button type="button" className="rounded p-1.5 text-text-muted hover:bg-surface" disabled>
                  <Icon className="h-3.5 w-3.5" />
                </button>
              </Tooltip>
            ))}
            <button type="button" className="ml-1 flex items-center gap-1 rounded px-2 py-1 text-xs text-text-muted hover:bg-surface" disabled>
              Insert Variable
              <ChevronDown className="h-3 w-3" />
            </button>
          </div>
          <Controller
            name="message"
            control={control}
            rules={{ required: "Message can't be empty" }}
            render={({ field }) => (
              <textarea
                {...field}
                rows={6}
                placeholder="Hi there,"
                className="w-full resize-none rounded-b-lg px-3 py-3 text-sm text-text placeholder:text-text-muted focus:outline-none"
              />
            )}
          />
        </div>
      </div>

      <EmailActionButtonFields control={control} />
    </div>
  );
}
