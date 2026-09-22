import { useRef } from "react";
import { Controller, type Control } from "react-hook-form";
import { FormField } from "../../../components/FormField";
import type { CreateEmailFormValues } from "../createEmailForm";
import { EmailTemplatePicker } from "./EmailTemplatePicker";
import { EmailActionButtonFields } from "./EmailActionButtonFields";
import { FormattingToolbar } from "./FormattingToolbar";
import { InsertVariableMenu } from "./InsertVariableMenu";

interface EmailWriteStepProps {
  control: Control<CreateEmailFormValues>;
}

export function EmailWriteStep({ control }: EmailWriteStepProps) {
  const messageRef = useRef<HTMLTextAreaElement>(null);

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
        <Controller
          name="message"
          control={control}
          rules={{ required: "Message can't be empty" }}
          render={({ field: { ref, onChange, ...field } }) => (
            <div className="rounded-lg border border-border">
              <div className="flex items-center border-b border-border bg-bg px-2 py-1.5">
                <FormattingToolbar textareaRef={messageRef} onChange={onChange} />
                <InsertVariableMenu textareaRef={messageRef} onChange={onChange} />
              </div>
              <textarea
                {...field}
                onChange={onChange}
                ref={(el) => {
                  ref(el);
                  messageRef.current = el;
                }}
                rows={6}
                placeholder="Hi there,"
                className="w-full resize-none rounded-b-lg px-3 py-3 text-sm text-text placeholder:text-text-muted focus:outline-none"
              />
            </div>
          )}
        />
      </div>

      <EmailActionButtonFields control={control} />
    </div>
  );
}
