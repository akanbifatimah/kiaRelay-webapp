import { useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import { cn } from "../../../lib/cn";
import { templates, type Template } from "../templates";

interface InsertTemplateMenuProps {
  onSelect: (template: Template) => void;
}

// A named-trigger popover, not the shared DropdownMenu (that one's trigger
// is hardcoded to a 3-dot icon button) — same click-outside/ESC handling.
// Inserts the picked template's content into the current draft in place,
// rather than navigating to the Templates library and losing it.
export function InsertTemplateMenu({ onSelect }: InsertTemplateMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) setIsOpen(false);
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
      >
        <Sparkles className="h-3.5 w-3.5" />
        Insert Template
      </button>
      {isOpen && (
        <div role="menu" className="absolute right-0 top-full z-20 mt-1 w-64 rounded-lg border border-border bg-surface py-1 shadow-lg">
          {templates.map((template) => (
            <button
              key={template.id}
              type="button"
              role="menuitem"
              onClick={() => {
                onSelect(template);
                setIsOpen(false);
              }}
              className="flex w-full flex-col items-start gap-0.5 px-3 py-2 text-left hover:bg-bg"
            >
              <span className="flex items-center gap-1.5 text-sm font-medium text-text">
                {template.name}
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-[10px] font-medium",
                    template.type === "email" ? "bg-tag-freight-bg text-tag-freight-fg" : "bg-tag-overnight-bg text-tag-overnight-fg",
                  )}
                >
                  {template.type === "email" ? "Email" : "Newsletter"}
                </span>
              </span>
              <span className="text-xs text-text-muted">{template.description}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
