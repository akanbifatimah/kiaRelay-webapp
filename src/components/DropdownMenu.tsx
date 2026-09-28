import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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

const MENU_WIDTH = 192;
const GAP = 4;

// First real (non-decorative) overflow menu in the app — CardMenuButton
// elsewhere is still a documented TODO stub. Built here for the driver
// queue's per-row actions; promote/replace CardMenuButton with this once
// its own actions are defined.
// 2026-09-28: the menu renders in a portal with fixed positioning. Tables
// scroll horizontally (overflow-x-auto), which clipped longer menus on the
// last rows. It flips upward when there isn't room below the trigger.
export function DropdownMenu({ items, ariaLabel = "Row options" }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (!triggerRef.current?.contains(target) && !menuRef.current?.contains(target)) setIsOpen(false);
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }
    const close = () => setIsOpen(false);
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [isOpen]);

  // Measure after the menu mounts so we know its real height before placing it.
  useLayoutEffect(() => {
    if (!isOpen || !triggerRef.current || !menuRef.current) return;
    const trigger = triggerRef.current.getBoundingClientRect();
    const height = menuRef.current.offsetHeight;
    const fitsBelow = trigger.bottom + GAP + height <= window.innerHeight - 8;
    setPosition({
      top: fitsBelow ? trigger.bottom + GAP : Math.max(8, trigger.top - GAP - height),
      left: Math.max(8, Math.min(trigger.right - MENU_WIDTH, window.innerWidth - MENU_WIDTH - 8)),
    });
  }, [isOpen]);

  // 2026-09-11 correction: don't render a 3-dot trigger for a row that has
  // no actions at all. This check comes after the hooks above so it never
  // changes their call order across renders.
  if (items.length === 0) return null;

  return (
    <div className="relative inline-flex" onClick={(event) => event.stopPropagation()}>
      <Tooltip label={ariaLabel}>
        <button
          ref={triggerRef}
          type="button"
          aria-label={ariaLabel}
          aria-haspopup="menu"
          aria-expanded={isOpen}
          onClick={() => {
            setPosition(null);
            setIsOpen((prev) => !prev);
          }}
          className="rounded-md p-1 text-text-muted hover:bg-bg hover:text-text"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </Tooltip>

      {isOpen &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            onClick={(event) => event.stopPropagation()}
            style={{ top: position?.top ?? 0, left: position?.left ?? 0, width: MENU_WIDTH, visibility: position ? "visible" : "hidden" }}
            className="fixed z-50 rounded-lg border border-border bg-surface py-1 shadow-lg"
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
          </div>,
          document.body,
        )}
    </div>
  );
}
