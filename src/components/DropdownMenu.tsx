import { useEffect, useRef, useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { Tooltip } from "./Tooltip";
import { cn } from "../lib/cn";

export interface DropdownMenuItem {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  tone?: "default" | "danger";
}

interface DropdownMenuProps {
  items: DropdownMenuItem[];
  ariaLabel?: string;
}

// First real (non-decorative) overflow menu in the app — CardMenuButton
// elsewhere is still a documented TODO stub. Built here for the driver
// queue's per-row actions; promote/replace CardMenuButton with this once
// its own actions are defined.
export function DropdownMenu({ items, ariaLabel = "Row options" }: DropdownMenuProps) {
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

  // 2026-09-11 correction: don't render a 3-dot trigger for a row that has
  // no actions at all — showing one just to open a menu that says "No
  // actions available" was worse than showing nothing (same reasoning as
  // CardMenuButton's tooltip removal). This check comes after the hooks
  // above so it never changes their call order across renders.
  if (items.length === 0) return null;

  return (
    <div ref={containerRef} className="relative inline-flex" onClick={(event) => event.stopPropagation()}>
      <Tooltip label={ariaLabel}>
        <button
          type="button"
          aria-label={ariaLabel}
          onClick={() => setIsOpen((prev) => !prev)}
          className="text-text-muted hover:text-text"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </Tooltip>

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 top-full z-20 mt-1 w-48 rounded-lg border border-border bg-surface py-1 shadow-lg"
        >
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              role="menuitem"
              disabled={item.disabled}
              onClick={() => {
                item.onClick();
                setIsOpen(false);
              }}
              className={cn(
                "block w-full px-3 py-2 text-left text-sm hover:bg-bg disabled:cursor-not-allowed disabled:text-text-muted disabled:hover:bg-transparent",
                item.tone === "danger" ? "text-danger" : "text-text",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
