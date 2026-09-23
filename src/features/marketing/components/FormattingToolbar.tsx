import { useRef, type RefObject } from "react";
import { Bold, Italic, Underline, Link2, Image, Minus } from "lucide-react";
import { Tooltip } from "../../../components/Tooltip";
import { applyFormatResult, insertAtCursor, wrapSelection } from "../textareaFormatting";

interface FormattingToolbarProps {
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  onChange: (value: string) => void;
  includeUnderline?: boolean;
  includeDivider?: boolean;
  /** Defaults on (every marketing editor has it); Support's reply composer
   * turns it off since ticket replies are text-only. */
  includeImage?: boolean;
}

// Real formatting — wraps the textarea's current selection in markdown-style
// markers (rendered back into styled output by parseInlineMarkdown.tsx /
// MessageBlocks.tsx), rather than the disabled "coming soon" toolbar this
// replaces. Shared by EmailWriteStep, NewsletterContentEditor, and
// TemplateContentEditor so all three compose flows behave identically.
// Renders just the button row (no bordered/bg wrapper) — the caller owns
// that, since it may sit alongside other toolbar controls (e.g. Insert
// Variable) in the same row.
export function FormattingToolbar({ textareaRef, onChange, includeUnderline, includeDivider, includeImage = true }: FormattingToolbarProps) {
  const imageInputRef = useRef<HTMLInputElement>(null);

  function format(before: string, after: string, placeholder: string) {
    const el = textareaRef.current;
    if (!el) return;
    applyFormatResult(el, onChange, wrapSelection(el, before, after, placeholder));
  }

  function insertDivider() {
    const el = textareaRef.current;
    if (!el) return;
    applyFormatResult(el, onChange, insertAtCursor(el, "\n\n---\n\n"));
  }

  // Selects the URL placeholder (not the label) after inserting, so typing
  // immediately replaces "https://" — the label is usually already right.
  function insertLink() {
    const el = textareaRef.current;
    if (!el) return;
    const { selectionStart, selectionEnd, value } = el;
    const label = value.slice(selectionStart, selectionEnd) || "link text";
    const urlPlaceholder = "https://";
    const before = value.slice(0, selectionStart);
    const next = `${before}[${label}](${urlPlaceholder})${value.slice(selectionEnd)}`;
    const urlStart = before.length + label.length + 3;
    applyFormatResult(el, onChange, { value: next, selectionStart: urlStart, selectionEnd: urlStart + urlPlaceholder.length });
  }

  function handleImageFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    const el = textareaRef.current;
    if (file && el) {
      const url = URL.createObjectURL(file);
      applyFormatResult(el, onChange, insertAtCursor(el, `\n\n![${file.name}](${url})\n\n`));
    }
    event.target.value = "";
  }

  return (
    <div className="flex items-center gap-1">
      <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageFile} />
      <Tooltip label="Bold">
        <button type="button" aria-label="Bold" onClick={() => format("**", "**", "bold text")} className="rounded p-1.5 text-text-muted hover:bg-surface hover:text-text">
          <Bold className="h-3.5 w-3.5" />
        </button>
      </Tooltip>
      <Tooltip label="Italic">
        <button type="button" aria-label="Italic" onClick={() => format("*", "*", "italic text")} className="rounded p-1.5 text-text-muted hover:bg-surface hover:text-text">
          <Italic className="h-3.5 w-3.5" />
        </button>
      </Tooltip>
      {includeUnderline && (
        <Tooltip label="Underline">
          <button type="button" aria-label="Underline" onClick={() => format("__", "__", "underlined text")} className="rounded p-1.5 text-text-muted hover:bg-surface hover:text-text">
            <Underline className="h-3.5 w-3.5" />
          </button>
        </Tooltip>
      )}
      <Tooltip label="Link">
        <button type="button" aria-label="Link" onClick={insertLink} className="rounded p-1.5 text-text-muted hover:bg-surface hover:text-text">
          <Link2 className="h-3.5 w-3.5" />
        </button>
      </Tooltip>
      {includeImage && (
        <Tooltip label="Insert image">
          <button type="button" aria-label="Insert image" onClick={() => imageInputRef.current?.click()} className="rounded p-1.5 text-text-muted hover:bg-surface hover:text-text">
            <Image className="h-3.5 w-3.5" />
          </button>
        </Tooltip>
      )}
      {includeDivider && (
        <Tooltip label="Divider">
          <button type="button" aria-label="Divider" onClick={insertDivider} className="rounded p-1.5 text-text-muted hover:bg-surface hover:text-text">
            <Minus className="h-3.5 w-3.5" />
          </button>
        </Tooltip>
      )}
    </div>
  );
}
