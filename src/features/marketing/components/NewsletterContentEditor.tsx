import { useRef } from "react";
import { Controller, type Control, type UseFormSetValue } from "react-hook-form";
import { Card } from "../../../components/Card";
import { useToast } from "../../../components/toast/ToastContext";
import type { CreateNewsletterFormValues } from "../createNewsletterForm";
import type { Template } from "../templates";
import { InsertTemplateMenu } from "./InsertTemplateMenu";
import { FormattingToolbar } from "./FormattingToolbar";
import { NewsletterHeaderImageField } from "./NewsletterHeaderImageField";

interface NewsletterContentEditorProps {
  control: Control<CreateNewsletterFormValues>;
  setValue: UseFormSetValue<CreateNewsletterFormValues>;
}

// "Insert Template" applies a real template's content in place (was
// navigating to the Templates library and losing the in-progress draft);
// the toolbar is real formatting (FormattingToolbar), not decorative.
export function NewsletterContentEditor({ control, setValue }: NewsletterContentEditorProps) {
  const { showToast } = useToast();
  const messageRef = useRef<HTMLTextAreaElement>(null);

  function applyTemplate(template: Template) {
    setValue("headline", template.headline, { shouldDirty: true });
    setValue("message", template.message, { shouldDirty: true });
    showToast("success", `"${template.name}" template applied.`);
  }

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text">Content Editor</h3>
        <InsertTemplateMenu onSelect={applyTemplate} />
      </div>
      <div className="rounded-lg border border-border">
        <Controller
          name="message"
          control={control}
          rules={{ required: "Message can't be empty" }}
          render={({ field: { ref, onChange, ...field } }) => (
            <>
              <div className="border-b border-border bg-bg px-2 py-1.5">
                <FormattingToolbar textareaRef={messageRef} onChange={onChange} />
              </div>
              <div className="flex flex-col gap-3 p-3">
                <Controller
                  name="headline"
                  control={control}
                  rules={{ required: "Headline can't be empty" }}
                  render={({ field: headlineField }) => (
                    <input {...headlineField} className="text-sm font-semibold text-text placeholder:text-text-muted focus:outline-none" />
                  )}
                />
                <NewsletterHeaderImageField control={control} />
                <textarea
                  {...field}
                  onChange={onChange}
                  ref={(el) => {
                    ref(el);
                    messageRef.current = el;
                  }}
                  rows={5}
                  className="w-full resize-none text-sm text-text placeholder:text-text-muted focus:outline-none"
                />
              </div>
            </>
          )}
        />
      </div>
    </Card>
  );
}
