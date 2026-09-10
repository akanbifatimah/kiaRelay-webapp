import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ChevronDown, type LucideIcon } from "lucide-react";
import { cn } from "../../lib/cn";

interface SidebarNavGroupProps {
  label: string;
  icon: LucideIcon;
  items: { to: string; label: string }[];
  onNavigate: () => void;
}

export function SidebarNavGroup({ label, icon: Icon, items, onNavigate }: SidebarNavGroupProps) {
  const location = useLocation();
  const isChildActive = items.some((child) => location.pathname.startsWith(child.to));
  const [isOpen, setIsOpen] = useState(false);
  const expanded = isOpen || isChildActive;

  return (
    <div>
      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className={cn(
          "text-badge-base relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 transition-colors",
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
        <span className="flex-1 truncate text-left">{label}</span>
        <ChevronDown className={cn("h-4 w-4 shrink-0 transition-transform", expanded && "rotate-180")} />
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
    </div>
  );
}
