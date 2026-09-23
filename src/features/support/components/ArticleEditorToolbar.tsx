import { useRef, useState, type RefObject } from "react";
import { Bold, Code, Image, Italic, Link2, List, ListOrdered, Underline } from "lucide-react";
import { Tooltip } from "../../../components/Tooltip";
import { applyFormatResult, insertAtCursor, wrapSelection, type FormatResult } from "../../marketing/textareaFormatting";
import { currentBlockType, setBlockType, toggleList, wrapCodeBlock, type BlockType } from "../articleFormatting";

interface ArticleEditorToolbarProps {
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  onChange: (value: string) => void;
}

const BLOCK_OPTIONS: { value: BlockType; label: string }[] = [
  { value: "p", label: "Normal Text" },
  { value: "h1", label: "Heading 1" },
  { value: "h2", label: "Heading 2" },
  { value: "h3", label: "Heading 3" },
];

type Formatter = (el: HTMLTextAreaElement) => FormatResult;

interface ToolButtonProps extends ArticleEditorToolbarProps {
  label: string;
  icon: typeof Bold;
  format: Formatter;
}

// onMouseDown preventDefault keeps the textarea's selection while clicking.
function ToolButton({ label, icon: Icon, format, textareaRef, onChange }: ToolButtonProps) {
  return (
    <Tooltip label={label}>
      <button
        type="button"
        aria-label={label}
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => {
          const el = textareaRef.current;
          if (el) applyFormatResult(el, onChange, format(el));
        }}
        className="rounded p-1.5 text-text-muted hover:bg-surface hover:text-text"
      >
        <Icon className="h-4 w-4" />
      </button>
    </Tooltip>
  );
}

// Matches the Create Article screenshot's toolbar: block type · B/I/U ·
// lists · link/image/code. Every button really edits the markdown in the
// textarea (same zero-dependency mechanic as marketing's FormattingToolbar),
// and ArticleContent.tsx renders it back in Preview / Article details.
export function ArticleEditorToolbar({ textareaRef, onChange }: ArticleEditorToolbarProps) {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [blockType, setBlockTypeState] = useState<BlockType>("p");

  function run(format: Formatter) {
    const el = textareaRef.current;
    if (el) applyFormatResult(el, onChange, format(el));
  }
  const shared = { textareaRef, onChange };

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-border bg-bg px-2 py-1.5">
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) run((el) => insertAtCursor(el, `\n\n![${file.name}](${URL.createObjectURL(file)})\n\n`));
          event.target.value = "";
        }}
      />
      <select
        aria-label="Text style"
        value={blockType}
        onFocus={() => textareaRef.current && setBlockTypeState(currentBlockType(textareaRef.current))}
        onChange={(event) => {
          const type = event.target.value as BlockType;
          setBlockTypeState(type);
          run((el) => setBlockType(el, type));
        }}
        className="rounded border-none bg-transparent px-1 py-1 text-xs font-medium text-text focus:outline-none"
      >
        {BLOCK_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
      <span className="mx-1 h-4 w-px bg-border" />
      <ToolButton {...shared} label="Bold" icon={Bold} format={(el) => wrapSelection(el, "**", "**", "bold text")} />
      <ToolButton {...shared} label="Italic" icon={Italic} format={(el) => wrapSelection(el, "*", "*", "italic text")} />
      <ToolButton {...shared} label="Underline" icon={Underline} format={(el) => wrapSelection(el, "__", "__", "underlined text")} />
      <span className="mx-1 h-4 w-px bg-border" />
      <ToolButton {...shared} label="Bulleted list" icon={List} format={(el) => toggleList(el, "bullet")} />
      <ToolButton {...shared} label="Numbered list" icon={ListOrdered} format={(el) => toggleList(el, "numbered")} />
      <span className="mx-1 h-4 w-px bg-border" />
      <ToolButton {...shared} label="Link" icon={Link2} format={(el) => wrapSelection(el, "[", "](https://)", "link text")} />
      <Tooltip label="Insert image">
        <button type="button" aria-label="Insert image" onClick={() => imageInputRef.current?.click()} className="rounded p-1.5 text-text-muted hover:bg-surface hover:text-text">
          <Image className="h-4 w-4" />
        </button>
      </Tooltip>
      <ToolButton {...shared} label="Code block" icon={Code} format={wrapCodeBlock} />
    </div>
  );
}
