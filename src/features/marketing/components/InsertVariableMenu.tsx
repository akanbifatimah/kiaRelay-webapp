import { useEffect, useRef, useState, type RefObject } from "react";
import { ChevronDown } from "lucide-react";
import { applyFormatResult, insertAtCursor } from "../textareaFormatting";

const VARIABLES = [
  { token: "{{first_name}}", label: "First Name" },
  { token: "{{last_name}}", label: "Last Name" },
  { token: "{{company_name}}", label: "Company Name" },
  { token: "{{driver_name}}", label: "Driver Name" },
  { token: "{{order_id}}", label: "Order ID" },
];

interface InsertVariableMenuProps {
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  onChange: (value: string) => void;
}

// Real merge-field insertion — was a disabled button. Same
// click-outside/ESC popover pattern as InsertTemplateMenu.
export function InsertVariableMenu({ textareaRef, onChange }: InsertVariableMenuProps) {
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

  function insertVariable(token: string) {
    const el = textareaRef.current;
    if (!el) return;
    applyFormatResult(el, onChange, insertAtCursor(el, token));
    setIsOpen(false);
  }

  return (
    <div ref={containerRef} className="relative ml-1">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1 rounded px-2 py-1 text-xs text-text-muted hover:bg-surface hover:text-text"
      >
        Insert Variable
        <ChevronDown className="h-3 w-3" />
      </button>
      {isOpen && (
        <div role="menu" className="absolute left-0 top-full z-20 mt-1 w-44 rounded-lg border border-border bg-surface py-1 shadow-lg">
          {VARIABLES.map((variable) => (
            <button
              key={variable.token}
              type="button"
              role="menuitem"
              onClick={() => insertVariable(variable.token)}
              className="flex w-full items-center justify-between px-3 py-1.5 text-left text-sm text-text hover:bg-bg"
            >
              {variable.label}
              <span className="text-xs text-text-muted">{variable.token}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
