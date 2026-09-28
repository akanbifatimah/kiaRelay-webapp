import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Building2, ChevronDown, ShieldCheck } from "lucide-react";
import { cn } from "../../lib/cn";
import { BUSINESS_BRAND } from "../../constants/brand";

const OPTIONS = [
  { to: "/business", icon: Building2, label: BUSINESS_BRAND, description: "Sign in or register your company account." },
  { to: "/login", icon: ShieldCheck, label: "KiaRelay Admin", description: "For KiaRelay staff." },
];

/** Room the menu needs below the button (two options plus the gap), in px. */
const MENU_SPACE = 170;

// "Get Started" reveals the two ways in on hover (2026-09-28). Click and
// keyboard open it too, since touch screens have no hover; click outside or
// ESC closes it.
export function GetStartedMenu() {
  const [open, setOpen] = useState(false);
  // A click pins the menu open, so moving the pointer away (e.g. to scroll)
  // doesn't close it; hover alone opens and closes it freely.
  const [pinned, setPinned] = useState(false);
  const [dropUp, setDropUp] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  function show() {
    // Opens upward when the button sits too near the bottom of the viewport
    // for the menu to fit below it.
    const rect = ref.current?.getBoundingClientRect();
    if (rect) setDropUp(window.innerHeight - rect.bottom < MENU_SPACE);
    setOpen(true);
  }

  function close() {
    setOpen(false);
    setPinned(false);
  }

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) close();
    };
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && close();
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative" onMouseEnter={show} onMouseLeave={() => !pinned && setOpen(false)}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => {
          if (pinned) return close();
          show();
          setPinned(true);
        }}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
      >
        Get Started
        <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
      </button>

      {/* The padding bridges the gap so moving the pointer onto the menu
          doesn't count as leaving it. */}
      {open && (
        <div className={cn("absolute inset-x-0 z-20", dropUp ? "bottom-full pb-2" : "top-full pt-2")}>
          <ul role="menu" className="overflow-hidden rounded-lg border border-border bg-surface shadow-lg">
            {OPTIONS.map(({ to, icon: Icon, label, description }) => (
              <li key={to} role="none" className="border-b border-border last:border-b-0">
                <Link role="menuitem" to={to} className="flex items-start gap-3 px-4 py-3 text-left hover:bg-bg focus:bg-bg focus:outline-none">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-text">{label}</span>
                    <span className="block text-xs text-text-muted">{description}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
