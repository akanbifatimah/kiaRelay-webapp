import { BarChart3, Headset, HelpCircle, LayoutDashboard, MapPin, PackagePlus, PanelLeft, ReceiptText, Settings, ShieldAlert, Truck, Users, X } from "lucide-react";
import { SidebarNavLink } from "../../../app/layout/SidebarNavLink";
import { Tooltip } from "../../../components/Tooltip";
import { BUSINESS_BRAND } from "../../../constants/brand";
import { cn } from "../../../lib/cn";

const NAV = [
  { to: "/business", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/business/book", label: "Book a Delivery", icon: PackagePlus },
  { to: "/business/deliveries", label: "Deliveries", icon: Truck },
  { to: "/business/invoices", label: "Invoices & Statements", icon: ReceiptText },
  { to: "/business/spend", label: "Usage & Spend", icon: BarChart3 },
  { to: "/business/incidents", label: "Incident Reports", icon: ShieldAlert },
  { to: "/business/team", label: "Team & Branches", icon: Users },
  { to: "/business/locations", label: "Saved Locations", icon: MapPin },
  { to: "/business/support", label: "Support Tickets", icon: Headset },
  { to: "/business/help", label: "Help & FAQ", icon: HelpCircle },
  { to: "/business/settings", label: "Settings", icon: Settings },
];

interface PortalSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggleCollapsed: () => void;
}

// KiaRelay Business portal navigation (2026-09-30; collapsible 2026-10-01,
// same as the admin sidebar). Collapse is desktop-only: md+ shrinks to an
// icon rail with hover labels; phones always get the full overlay.
export function PortalSidebar({ isOpen, onClose, isCollapsed, onToggleCollapsed }: PortalSidebarProps) {
  return (
    <>
      {isOpen && <button type="button" aria-label="Close menu" className="fixed inset-0 z-30 bg-black/40 md:hidden" onClick={onClose} />}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-(--sidebar-width) flex-col bg-sidebar transition-transform md:static md:translate-x-0 md:transition-[width]",
          isOpen ? "translate-x-0" : "-translate-x-full",
          isCollapsed && "md:w-19",
        )}
      >
        <div className={cn("flex items-center gap-2 px-5 py-5", isCollapsed ? "md:flex-col md:gap-3 md:px-0" : "justify-between")}>
          <div className={cn("flex min-w-0 items-center gap-2", isCollapsed && "md:justify-center")}>
            <img src="/KiaRelay_logo.png" alt="KiaRelay" className="h-8 w-8 shrink-0 rounded-md" />
            <div className={cn("min-w-0", isCollapsed && "md:hidden")}>
              <p className="text-sm font-semibold text-white">KiaRelay</p>
              <p className="truncate text-xs text-sidebar-fg">{BUSINESS_BRAND}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Tooltip label="Close menu" side="bottom">
              <button type="button" aria-label="Close menu" onClick={onClose} className={cn("text-sidebar-fg md:hidden", isCollapsed && "hidden")}>
                <X className="h-5 w-5" />
              </button>
            </Tooltip>
            <Tooltip label={isCollapsed ? "Expand" : "Collapse"} side="bottom">
              <button
                type="button"
                aria-label={isCollapsed ? "Expand navigation" : "Collapse navigation"}
                onClick={(event) => {
                  onToggleCollapsed();
                  // Drop focus so the tooltip doesn't linger after the click (same as admin).
                  event.currentTarget.blur();
                }}
                className="hidden text-sidebar-fg hover:text-white md:flex"
              >
                <PanelLeft className="h-4 w-4" />
              </button>
            </Tooltip>
          </div>
        </div>
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-2">
          {NAV.map((item) => (
            <SidebarNavLink key={item.to} to={item.to} label={item.label} icon={item.icon} end={item.end} onNavigate={onClose} collapsed={isCollapsed} />
          ))}
        </nav>
      </aside>
    </>
  );
}
