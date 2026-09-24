import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { TopHeader } from "./TopHeader";
import { ConfirmModal } from "../../components/ConfirmModal";
import { logout } from "../../features/auth/authStorage";
import { canAccessPath, firstSettingsPath, restrictedArea, useCurrentUser } from "../../features/access/permissions";
import { roleMeta } from "../../features/access/modules";
import { logAudit } from "../../features/access/auditLog";
import { AccessRestrictedPage } from "../AccessRestrictedPage";

const SIDEBAR_COLLAPSED_KEY = "kiarelay-sidebar-collapsed";

function getInitialCollapsed(): boolean {
  try {
    return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "true";
  } catch {
    return false;
  }
}

// The header shows the signed-in admin (features/access), and every route
// is checked against their modules here — one central guard instead of a
// wrapper per route. A forbidden URL keeps the shell and shows Access
// Restricted in place of the page.
export function AppShell() {
  const user = useCurrentUser();
  const { pathname } = useLocation();
  const settingsPath = firstSettingsPath(user);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(getInitialCollapsed);
  const navigate = useNavigate();

  function handleLogoutConfirmed() {
    if (user) logAudit({ actor: user.name, category: "auth", action: "Signed out", target: user.email });
    logout();
    navigate("/login", { replace: true });
  }

  function toggleCollapsed() {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(next));
      } catch {
        // ignore — collapsed state just won't persist across reloads
      }
      return next;
    });
  }

  return (
    <div className="flex h-screen bg-bg">
      <Sidebar
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        isCollapsed={isCollapsed}
        onToggleCollapsed={toggleCollapsed}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopHeader
          userName={user?.name ?? "Admin"}
          userRole={user ? roleMeta(user.role).label : ""}
          userAvatarSrc={user?.avatarSrc}
          onOpenSettings={settingsPath ? () => navigate(settingsPath) : undefined}
          onOpenNav={() => setIsMobileNavOpen(true)}
          onLogout={() => setIsLogoutConfirmOpen(true)}
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {canAccessPath(user, pathname) ? <Outlet /> : <AccessRestrictedPage area={restrictedArea(pathname)} user={user} />}
        </main>
      </div>
      {isLogoutConfirmOpen && (
        <ConfirmModal
          title="Log out?"
          message="You'll need to sign in again to access the dashboard."
          confirmLabel="Log Out"
          tone="danger"
          onConfirm={handleLogoutConfirmed}
          onCancel={() => setIsLogoutConfirmOpen(false)}
        />
      )}
    </div>
  );
}
