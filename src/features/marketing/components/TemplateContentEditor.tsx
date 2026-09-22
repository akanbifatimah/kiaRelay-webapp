import { useRef } from "react";
import { Controller, type Control } from "react-hook-form";
import { MessageSquareText } from "lucide-react";
import type { CreateTemplateFormValues } from "../createTemplateForm";
import { FormattingToolbar } from "./FormattingToolbar";

interface TemplateContentEditorProps {
  control: Control<CreateTemplateFormValues>;
}

// Toolbar is real formatting (FormattingToolbar) — this editor doubles as
// its own live preview, since the fields it edits (headline/subtitle/body)
// render directly in the rendered-looking card below.
export function TemplateContentEditor({ control }: TemplateContentEditorProps) {
  const messageRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div className="rounded-lg border border-border">
      <div className="border-b border-border bg-bg px-2 py-1.5">
        <Controller
          name="message"
          control={control}
          render={({ field: { onChange } }) => (
            <FormattingToolbar textareaRef={messageRef} onChange={onChange} includeUnderline includeDivider />
          )}
        />
      </div>
      <div className="flex flex-col gap-4 bg-surface p-5">
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-sidebar text-white">
          <MessageSquareText className="h-4 w-4" />
        </span>
        <Controller
          name="contentHeadline"
          control={control}
          render={({ field }) => (
            <input {...field} className="text-lg font-semibold text-text placeholder:text-text-muted focus:outline-none" />
          )}
        />
        <Controller
          name="contentSubtitle"
          control={control}
          render={({ field }) => (
            <input {...field} className="-mt-3 text-sm text-text-muted placeholder:text-text-muted focus:outline-none" />
          )}
        />
        <Controller
          name="message"
          control={control}
          rules={{ required: "Content can't be empty" }}
          render={({ field: { ref, onChange, ...field } }) => (
            <textarea
              {...field}
              onChange={onChange}
              ref={(el) => {
                ref(el);
                messageRef.current = el;
              }}
              rows={7}
              className="w-full resize-none text-sm leading-relaxed text-text-muted placeholder:text-text-muted focus:outline-none"
            />
          )}
        />
        <button type="button" className="w-fit rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground" disabled>
          View Full Report
        </button>
      </div>
    </div>
  );
}
