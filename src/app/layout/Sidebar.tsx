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
  UserCog,
  Settings,
} from "lucide-react";
import { cn } from "../../lib/cn";
import { SidebarHeader } from "./SidebarHeader";
import { SidebarNavLink } from "./SidebarNavLink";
import { SidebarNavGroup } from "./SidebarNavGroup";
import { canAccessPath, SETTINGS_PAGES, useCurrentUser } from "../../features/access/permissions";
import type { TeamMember } from "../../features/access/teamMembers";

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
  | { kind: "group"; label: string; icon: typeof LayoutDashboard; items: { to: string; label: string }[]; matchPrefix?: string };

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
  {
    kind: "group",
    label: "Support",
    icon: HelpCircle,
    matchPrefix: "/support",
    items: [
      { to: "/support/unassigned", label: "Unassigned Tickets" },
      { to: "/support/my-tickets", label: "My Tickets" },
      { to: "/support/team", label: "Team Monitoring" },
      { to: "/support/claims", label: "Claims" },
      { to: "/support/knowledge-base", label: "Knowledge Base" },
    ],
  },
  // 2026-09-23: User Management (Super Admin only) and Settings, per the
  // user's request — neither was in the sidebar design.
  { kind: "link", to: "/users", label: "User Management", icon: UserCog },
  { kind: "group", label: "Settings", icon: Settings, matchPrefix: "/settings", items: SETTINGS_PAGES },
];

// Role-based nav (2026-09-23): an admin only sees the modules their account
// was granted; a group keeps just its permitted children and disappears when
// none are left. AppShell enforces the same rules on the route itself.
function visibleNavItems(user: TeamMember | undefined): NavEntry[] {
  return navItems.flatMap((item): NavEntry[] => {
    if (item.kind === "link") return canAccessPath(user, item.to) ? [item] : [];
    const items = item.items.filter((child) => canAccessPath(user, child.to));
    return items.length > 0 ? [{ ...item, items }] : [];
  });
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggleCollapsed: () => void;
}

// Collapse is a desktop-only concept (2026-09-18): the toggle button and the
// narrow-width/icon-rail styling only apply at md+ (via md:-prefixed
// classes), so resizing down to mobile always falls back to the full-width
// overlay sidebar regardless of the collapsed state's last value.
export function Sidebar({ isOpen, onClose, isCollapsed, onToggleCollapsed }: SidebarProps) {
  const user = useCurrentUser();
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
          "fixed inset-y-0 left-0 z-40 flex w-(--sidebar-width) flex-col bg-sidebar text-sidebar-fg transition-transform md:static md:translate-x-0 md:transition-[width]",
          isOpen ? "translate-x-0" : "-translate-x-full",
          isCollapsed && "md:w-19",
        )}
      >
        {/* Toggle placement (2026-09-18 revision): lives inline in the header
            row next to the logo — same row, right-aligned — instead of
            floating on the sidebar's edge. The floating version positioned
            itself relative to Tooltip's own wrapper span (which sits at
            ~(0,0) of the aside, ahead of the header row) rather than the
            aside itself, so its tooltip rendered clipped right at the top
            edge. Putting the button in normal flow inside the header row
            fixes that at the root and matches where this pattern usually
            lives (icon-only, top-right of the panel, tooltip on hover). */}
        <SidebarHeader isCollapsed={isCollapsed} onClose={onClose} onToggleCollapsed={onToggleCollapsed} />
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-2">
          {visibleNavItems(user).map((item) =>
            item.kind === "link" ? (
              <SidebarNavLink
                key={item.to}
                to={item.to}
                label={item.label}
                icon={item.icon}
                end={item.end}
                onNavigate={onClose}
                collapsed={isCollapsed}
              />
            ) : (
              <SidebarNavGroup
                key={item.label}
                label={item.label}
                icon={item.icon}
                items={item.items}
                matchPrefix={item.matchPrefix}
                onNavigate={onClose}
                collapsed={isCollapsed}
              />
            ),
          )}
        </nav>
      </aside>
    </>
  );
}
