import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { TopHeader } from "./TopHeader";
import { ConfirmModal } from "../../components/ConfirmModal";
import { logout } from "../../features/auth/authStorage";

const SIDEBAR_COLLAPSED_KEY = "kiarelay-sidebar-collapsed";

function getInitialCollapsed(): boolean {
  try {
    return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "true";
  } catch {
    return false;
  }
}

// TODO: replace hardcoded user with the authenticated admin session once
// login carries a real profile (currently just gates access — see
// features/auth/authStorage.ts).
export function AppShell() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(getInitialCollapsed);
  const navigate = useNavigate();

  function handleLogoutConfirmed() {
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
          userName="Alex Mercer"
          userRole="Fleet Admin"
          userAvatarSrc="/profile_img.png"
          onOpenNav={() => setIsMobileNavOpen(true)}
          onLogout={() => setIsLogoutConfirmOpen(true)}
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
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
