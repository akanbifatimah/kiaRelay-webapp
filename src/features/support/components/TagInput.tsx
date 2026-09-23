import { useState } from "react";
import { Tag, X } from "lucide-react";
import { Tooltip } from "../../../components/Tooltip";

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
}

// "Add a tag and press Enter" from Create Article. Comma also commits;
// Backspace on an empty input removes the last tag. Duplicates (case-
// insensitive) are ignored. Meant to sit inside a Controller (rule 7).
export function TagInput({ value, onChange }: TagInputProps) {
  const [draft, setDraft] = useState("");

  function commit() {
    const tag = draft.trim().replace(/,$/, "");
    if (tag && !value.some((existing) => existing.toLowerCase() === tag.toLowerCase())) onChange([...value, tag]);
    setDraft("");
  }

  return (
    <div className="flex flex-col gap-2">
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {value.map((tag) => (
            <span key={tag} className="inline-flex items-center gap-1 rounded bg-bg px-2 py-0.5 text-xs font-medium text-text">
              {tag}
              <Tooltip label={`Remove ${tag}`}>
                <button type="button" aria-label={`Remove ${tag}`} onClick={() => onChange(value.filter((t) => t !== tag))} className="text-text-muted hover:text-danger">
                  <X className="h-3 w-3" />
                </button>
              </Tooltip>
            </span>
          ))}
        </div>
      )}
      <div className="flex items-center gap-2 rounded-md border border-border px-3 py-2">
        <Tag className="h-4 w-4 text-text-muted" />
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === ",") {
              event.preventDefault();
              commit();
            } else if (event.key === "Backspace" && !draft && value.length) {
              onChange(value.slice(0, -1));
            }
          }}
          onBlur={commit}
          placeholder="Add a tag and press Enter..."
          className="w-full bg-transparent text-sm text-text placeholder:text-text-muted focus:outline-none"
        />
      </div>
    </div>
  );
}
