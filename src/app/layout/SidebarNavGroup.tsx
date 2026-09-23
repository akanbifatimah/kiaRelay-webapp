import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { NavLink, useLocation } from "react-router-dom";
import { ChevronDown, type LucideIcon } from "lucide-react";
import { cn } from "../../lib/cn";

interface SidebarNavGroupProps {
  label: string;
  icon: LucideIcon;
  items: { to: string; label: string }[];
  onNavigate: () => void;
  /** Desktop icon-rail mode — the inline expand/collapse list has no room,
   * so this renders a hover/focus flyout with the same child links instead. */
  collapsed?: boolean;
  /** Highlights the group for any route under this prefix, not just its
   * children — e.g. Support's ticket/claim detail pages, which aren't under
   * any one sub-item's path. */
  matchPrefix?: string;
}

export function SidebarNavGroup({ label, icon: Icon, items, onNavigate, collapsed, matchPrefix }: SidebarNavGroupProps) {
  const location = useLocation();
  const isChildActive =
    (matchPrefix !== undefined && location.pathname.startsWith(matchPrefix)) ||
    items.some((child) => location.pathname.startsWith(child.to));
  const [isOpen, setIsOpen] = useState(false);
  const [isRailFlyoutOpen, setIsRailFlyoutOpen] = useState(false);
  const [flyoutPosition, setFlyoutPosition] = useState<{ top: number; left: number } | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const expanded = !collapsed && (isOpen || isChildActive);

  useEffect(() => () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  // Portal-based, same reason as RailTooltip: this trigger lives inside
  // <nav className="overflow-y-auto">, which clips a CSS-positioned flyout
  // escaping to the right. A short close delay lets the pointer cross the
  // gap from the trigger into the flyout without it disappearing first.
  function openFlyout() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    const rect = triggerRef.current?.getBoundingClientRect();
    if (rect) setFlyoutPosition({ top: rect.top, left: rect.right + 8 });
    setIsRailFlyoutOpen(true);
  }

  function scheduleCloseFlyout() {
    closeTimer.current = setTimeout(() => setIsRailFlyoutOpen(false), 150);
  }

  return (
    <div
      ref={triggerRef}
      onMouseEnter={collapsed ? openFlyout : undefined}
      onMouseLeave={collapsed ? scheduleCloseFlyout : undefined}
      onFocus={collapsed ? openFlyout : undefined}
      onBlur={collapsed ? scheduleCloseFlyout : undefined}
    >
      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className={cn(
          "text-badge-base relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 transition-colors",
          collapsed && "md:justify-center",
          isChildActive ? "uppercase text-white" : "normal-case text-sidebar-fg hover:bg-white/5 hover:text-white",
        )}
      >
        {isChildActive && <span className="absolute inset-y-1 left-0 w-1 rounded-r-full bg-primary" />}
        <span
          className={cn(
            "flex h-6 w-6 shrink-0 items-center justify-center rounded-md",
            isChildActive && "bg-white",
          )}
        >
          <Icon className={cn("h-4 w-4", isChildActive && "text-sidebar")} />
        </span>
        <span className={cn("flex-1 truncate text-left", collapsed && "md:hidden")}>{label}</span>
        <ChevronDown
          className={cn("h-4 w-4 shrink-0 transition-transform", expanded && "rotate-180", collapsed && "md:hidden")}
        />
      </button>
      {expanded && (
        <div className="ml-9 flex flex-col gap-0.5 border-l border-white/10 py-1 pl-3">
          {items.map((child) => (
            <NavLink
              key={child.to}
              to={child.to}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  "rounded-md px-2 py-2 text-xs normal-case transition-colors",
                  isActive ? "font-semibold text-primary" : "text-sidebar-fg hover:text-white",
                )
              }
            >
              {child.label}
            </NavLink>
          ))}
        </div>
      )}
      {collapsed &&
        isRailFlyoutOpen &&
        flyoutPosition &&
        createPortal(
          <div
            onMouseEnter={openFlyout}
            onMouseLeave={scheduleCloseFlyout}
            style={{ top: flyoutPosition.top, left: flyoutPosition.left }}
            className="fixed z-50 flex min-w-40 flex-col gap-0.5 rounded-lg border border-white/10 bg-sidebar p-2 shadow-lg"
          >
            <p className="px-2 py-1 text-badge-base text-sidebar-fg-muted">{label}</p>
            {items.map((child) => (
              <NavLink
                key={child.to}
                to={child.to}
                onClick={() => {
                  onNavigate();
                  setIsRailFlyoutOpen(false);
                }}
                className={({ isActive }) =>
                  cn(
                    "rounded-md px-2 py-2 text-xs normal-case transition-colors",
                    isActive ? "font-semibold text-primary" : "text-sidebar-fg hover:text-white",
                  )
                }
              >
                {child.label}
              </NavLink>
            ))}
          </div>,
          document.body,
        )}
    </div>
  );
}
