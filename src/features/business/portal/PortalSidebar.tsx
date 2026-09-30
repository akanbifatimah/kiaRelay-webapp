import { BarChart3, Building2, HelpCircle, LayoutDashboard, MapPin, PackagePlus, ReceiptText, Truck, Users, X } from "lucide-react";
import { SidebarNavLink } from "../../../app/layout/SidebarNavLink";
import { Tooltip } from "../../../components/Tooltip";
import { BUSINESS_BRAND } from "../../../constants/brand";
import { cn } from "../../../lib/cn";

const NAV = [
  { to: "/business", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/business/book", label: "Book a Delivery", icon: PackagePlus },
  { to: "/business/deliveries", label: "Deliveries", icon: Truck },
  { to: "/business/invoices", label: "Invoices & Billing", icon: ReceiptText },
  { to: "/business/spend", label: "Usage & Spend", icon: BarChart3 },
  { to: "/business/team", label: "Team & Branches", icon: Users },
  { to: "/business/locations", label: "Saved Locations", icon: MapPin },
  { to: "/business/company", label: "Company", icon: Building2 },
  { to: "/business/help", label: "Help & Support", icon: HelpCircle },
];

interface PortalSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

// KiaRelay Business portal navigation (2026-09-30, no web design — first
// pass). Same dark rail and link component as the admin shell, with the
// portal's own sections (mirroring the customer app's Business screens).
export function PortalSidebar({ isOpen, onClose }: PortalSidebarProps) {
  return (
    <>
      {isOpen && <button type="button" aria-label="Close menu" className="fixed inset-0 z-30 bg-black/40 md:hidden" onClick={onClose} />}
      <aside className={cn("fixed inset-y-0 left-0 z-40 flex w-[232px] flex-col bg-sidebar transition-transform md:static md:translate-x-0", isOpen ? "translate-x-0" : "-translate-x-full")}>
        <div className="flex h-16 items-center justify-between gap-2 px-4">
          <div className="flex items-center gap-2">
            <img src="/business/logo.png" alt="KiaRelay" className="h-8 w-auto rounded bg-white p-0.5" />
            <span className="text-sm font-semibold text-white">{BUSINESS_BRAND}</span>
          </div>
          <Tooltip label="Close menu" side="bottom" className="md:hidden">
            <button type="button" aria-label="Close menu" onClick={onClose} className="rounded p-1 text-sidebar-fg hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </Tooltip>
        </div>
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-2">
          {NAV.map((item) => (
            <SidebarNavLink key={item.to} to={item.to} label={item.label} icon={item.icon} end={item.end} onNavigate={onClose} />
          ))}
        </nav>
      </aside>
    </>
  );
}
