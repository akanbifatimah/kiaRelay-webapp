import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Truck,
  Package,
  Users,
  IdCard,
  Wallet,
  Mail,
  BarChart3,
  HelpCircle,
  X,
} from "lucide-react";
import { cn } from "../../lib/cn";

// Updated per the latest Figma nav (2026-09-07): Claims, Pricing,
// AI & Optimization, Security & Audit, and Settings are no longer in the
// sidebar (still exist as routes/PRD modules — just unlinked here); Finance,
// Marketing, and Support are new. Icons are a best-effort visual match at
// low screenshot resolution, not confirmed against Figma Dev Mode.
const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/dispatch", label: "Dispatch", icon: Truck },
  { to: "/orders", label: "Orders", icon: Package },
  { to: "/customers", label: "Customers", icon: Users },
  { to: "/drivers", label: "Drivers", icon: IdCard },
  { to: "/finance", label: "Finance", icon: Wallet },
  { to: "/marketing", label: "Marketing", icon: Mail },
  { to: "/reports", label: "Reports", icon: BarChart3 },
  { to: "/support", label: "Support", icon: HelpCircle },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onClose}
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-(--sidebar-width) flex-col bg-sidebar text-sidebar-fg transition-transform md:static md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <div className="flex items-center gap-2">
            <img src="/KiaRelay_logo.png" alt="KiaRelay" className="h-8 w-8 rounded-md" />
            <div>
              <p className="text-sm font-semibold text-white">KiaRelay</p>
              <p className="text-xs text-sidebar-fg">Admin Center</p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Close navigation"
            onClick={onClose}
            className="text-sidebar-fg md:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-2">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  "text-badge-base relative flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors",
                  isActive
                    ? "uppercase text-white"
                    : "normal-case text-sidebar-fg hover:bg-white/5 hover:text-white",
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute inset-y-1 left-0 w-1 rounded-r-full bg-primary" />
                  )}
                  <span
                    className={cn(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-md",
                      isActive && "bg-white",
                    )}
                  >
                    <Icon className={cn("h-4 w-4", isActive && "text-sidebar")} />
                  </span>
                  <span className="truncate">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
