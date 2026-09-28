import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "../lib/cn";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  onBlur?: () => void;
  ariaLabel?: string;
  className?: string;
}

// Custom listbox (TC-07, 2026-09-28). A native <select>'s popup can't be
// padded, so long lists like the State picker rendered flush against the
// edges. This one has an inset, scrollable panel with padded rows and keeps
// native keyboard behaviour: arrows, Home/End, Enter/Space, Esc and type-ahead.
export function Select({ value, options, onChange, onBlur, ariaLabel, className }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listId = useId();
  const selectedIndex = Math.max(0, options.findIndex((option) => option.value === value));

  useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) listRef.current?.children[active]?.scrollIntoView({ block: "nearest" });
  }, [isOpen, active]);

  function open() {
    setActive(selectedIndex);
    setIsOpen(true);
  }

  function choose(index: number) {
    const option = options[index];
    if (option) onChange(option.value);
    setIsOpen(false);
  }

  function handleKeyDown(event: KeyboardEvent) {
    const last = options.length - 1;
    const moves: Record<string, () => number> = {
      ArrowDown: () => Math.min(last, active + 1),
      ArrowUp: () => Math.max(0, active - 1),
      Home: () => 0,
      End: () => last,
    };
    if (moves[event.key]) {
      event.preventDefault();
      if (!isOpen) return open();
      setActive(moves[event.key]());
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (isOpen) choose(active);
      else open();
    } else if (event.key === "Escape" && isOpen) {
      event.preventDefault();
      setIsOpen(false);
    } else if (event.key.length === 1 && /\S/.test(event.key)) {
      const match = options.findIndex((option) => option.label.toLowerCase().startsWith(event.key.toLowerCase()));
      if (match >= 0) {
        if (isOpen) setActive(match);
        else onChange(options[match].value);
      }
    }
  }

  return (
    <div ref={rootRef} className={cn("relative w-full min-w-0", className)}>
      <button
        type="button"
        role="combobox"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listId}
        onClick={() => (isOpen ? setIsOpen(false) : open())}
        onKeyDown={handleKeyDown}
        onBlur={onBlur}
        className="flex w-full items-center justify-between gap-2 text-left focus:outline-none"
      >
        <span className="truncate">{options[selectedIndex]?.label ?? ""}</span>
        <ChevronDown className={cn("h-4 w-4 shrink-0 text-text-muted transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          className="absolute -inset-x-3 top-full z-30 mt-3 max-h-64 overflow-y-auto rounded-lg border border-border bg-surface p-1.5 shadow-lg"
        >
          {options.map((option, index) => (
            <li
              key={option.value}
              role="option"
              aria-selected={option.value === value}
              onMouseDown={(event) => event.preventDefault()}
              onMouseEnter={() => setActive(index)}
              onClick={() => choose(index)}
              className={cn(
                "flex cursor-pointer items-center justify-between gap-2 rounded-md px-3 py-2 text-sm text-text",
                index === active && "bg-bg",
                option.value === value && "font-medium",
              )}
            >
              {option.label}
              {option.value === value && <Check className="h-4 w-4 shrink-0 text-primary" />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
