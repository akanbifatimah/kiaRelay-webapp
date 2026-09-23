import { useRef, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { FileText, Send, X } from "lucide-react";
import { cn } from "../../../lib/cn";
import { Button } from "../../../components/Button";
import { FormattingToolbar } from "../../marketing/components/FormattingToolbar";
import { replyTemplates } from "../ticketWorkspace";

export type ComposerMode = "reply" | "internal";

interface ReplyComposerProps {
  customerName: string;
  revisedEta: string;
  disabled?: boolean;
  onSend: (mode: ComposerMode, body: string) => void;
  onSaveDraft: (mode: ComposerMode, body: string) => void;
  onCloseTicket: () => void;
}

export function ReplyComposer({ customerName, revisedEta, disabled, onSend, onSaveDraft, onCloseTicket }: ReplyComposerProps) {
  const [mode, setMode] = useState<ComposerMode>("reply");
  const [isTemplateMenuOpen, setIsTemplateMenuOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const { control, handleSubmit, setValue, reset } = useForm<{ body: string }>({ defaultValues: { body: "" } });
  const body = useWatch({ control, name: "body" });

  function submit({ body: value }: { body: string }) {
    onSend(mode, value.trim());
    reset({ body: "" });
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-3 border-t border-border pt-4">
      <div className="flex gap-4 text-sm font-medium">
        {(["reply", "internal"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setMode(tab)}
            className={cn("-mb-px border-b-2 pb-1.5", mode === tab ? "border-sidebar text-text" : "border-transparent text-text-muted hover:text-text")}
          >
            {tab === "reply" ? "Reply to Customer" : "Add Internal Note"}
          </button>
        ))}
      </div>
      <div className={cn("rounded-lg border", mode === "internal" ? "border-warning/40 bg-tag-warning-bg/30" : "border-border")}>
        <div className="relative flex items-center gap-2 border-b border-border px-2 py-1">
          <FormattingToolbar textareaRef={textareaRef} onChange={(value) => setValue("body", value)} includeImage={false} />
          <button
            type="button"
            onClick={() => setIsTemplateMenuOpen((prev) => !prev)}
            className="flex items-center gap-1 rounded px-1.5 py-1 text-xs font-medium text-text-muted hover:bg-bg hover:text-text"
          >
            <FileText className="h-3.5 w-3.5" />
            Use Template
          </button>
          {isTemplateMenuOpen && (
            <div role="menu" className="absolute left-24 top-full z-20 mt-1 w-64 rounded-lg border border-border bg-surface py-1 shadow-lg">
              {replyTemplates.map((template) => (
                <button
                  key={template.label}
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setValue("body", template.body.replace("{eta}", revisedEta));
                    setIsTemplateMenuOpen(false);
                  }}
                  className="block w-full px-3 py-2 text-left text-sm text-text hover:bg-bg"
                >
                  {template.label}
                </button>
              ))}
            </div>
          )}
        </div>
        <Controller
          name="body"
          control={control}
          rules={{ validate: (value) => value.trim().length > 0 }}
          render={({ field }) => (
            <textarea
              {...field}
              ref={(el) => {
                field.ref(el);
                textareaRef.current = el;
              }}
              rows={3}
              disabled={disabled}
              placeholder={mode === "reply" ? `Type your response to ${customerName}...` : "Add a note only agents can see..."}
              className="w-full resize-y bg-transparent px-3 py-2 text-sm text-text placeholder:text-text-muted focus:outline-none"
            />
          )}
        />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          onClick={onCloseTicket}
          disabled={disabled}
          className="inline-flex items-center gap-2 rounded-lg border border-danger/40 px-4 py-2 text-sm font-medium text-danger hover:bg-tag-danger-bg disabled:cursor-not-allowed disabled:opacity-50"
        >
          <X className="h-4 w-4" />
          Close Ticket
        </button>
        <div className="flex items-center gap-2">
          <Button type="button" variant="ghost" disabled={disabled || !body.trim()} onClick={() => onSaveDraft(mode, body)}>
            Save Draft
          </Button>
          <Button type="submit" variant="dark" disabled={disabled || !body.trim()}>
            {mode === "reply" ? "Send" : "Add Note"}
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </form>
  );
}
