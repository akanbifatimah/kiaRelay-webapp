import { NavLink } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { cn } from "../../lib/cn";

interface SidebarNavLinkProps {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
  onNavigate: () => void;
}

export function SidebarNavLink({ to, label, icon: Icon, end, onNavigate }: SidebarNavLinkProps) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          "text-badge-base relative flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors",
          isActive ? "uppercase text-white" : "normal-case text-sidebar-fg hover:bg-white/5 hover:text-white",
        )
      }
    >
      {({ isActive }) => (
        <>
          {isActive && <span className="absolute inset-y-1 left-0 w-1 rounded-r-full bg-primary" />}
          <span
            className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-md", isActive && "bg-white")}
          >
            <Icon className={cn("h-4 w-4", isActive && "text-sidebar")} />
          </span>
          <span className="truncate">{label}</span>
        </>
      )}
    </NavLink>
  );
}
