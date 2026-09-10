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
import { Tooltip } from "../../components/Tooltip";
import { SidebarNavLink } from "./SidebarNavLink";
import { SidebarNavGroup } from "./SidebarNavGroup";

// Updated per the latest Figma nav (2026-09-07): Claims, Pricing,
// AI & Optimization, Security & Audit, and Settings are no longer in the
// sidebar (still exist as routes/PRD modules — just unlinked here); Finance,
// Marketing, and Support are new. Icons are a best-effort visual match at
// low screenshot resolution, not confirmed against Figma Dev Mode.
// Customers is a group (2026-09-08, per the user's explicit choice) since
// customer accounts split into Individual/Company — every other item stays
// a flat link.
type NavEntry =
  | { kind: "link"; to: string; label: string; icon: typeof LayoutDashboard; end?: boolean }
  | { kind: "group"; label: string; icon: typeof LayoutDashboard; items: { to: string; label: string }[] };

const navItems: NavEntry[] = [
  { kind: "link", to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { kind: "link", to: "/dispatch", label: "Dispatch", icon: Truck },
  { kind: "link", to: "/orders", label: "Orders", icon: Package },
  {
    kind: "group",
    label: "Customers",
    icon: Users,
    items: [
      { to: "/customers/individual", label: "Individual Accounts" },
      { to: "/customers/company", label: "Company Accounts" },
    ],
  },
  { kind: "link", to: "/drivers", label: "Drivers", icon: IdCard },
  { kind: "link", to: "/finance", label: "Finance", icon: Wallet },
  { kind: "link", to: "/marketing", label: "Marketing", icon: Mail },
  { kind: "link", to: "/reports", label: "Reports", icon: BarChart3 },
  { kind: "link", to: "/support", label: "Support", icon: HelpCircle },
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
          <Tooltip label="Close navigation" side="bottom">
            <button
              type="button"
              aria-label="Close navigation"
              onClick={onClose}
              className="text-sidebar-fg md:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </Tooltip>
        </div>
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-2">
          {navItems.map((item) =>
            item.kind === "link" ? (
              <SidebarNavLink
                key={item.to}
                to={item.to}
                label={item.label}
                icon={item.icon}
                end={item.end}
                onNavigate={onClose}
              />
            ) : (
              <SidebarNavGroup
                key={item.label}
                label={item.label}
                icon={item.icon}
                items={item.items}
                onNavigate={onClose}
              />
            ),
          )}
        </nav>
      </aside>
    </>
  );
}
