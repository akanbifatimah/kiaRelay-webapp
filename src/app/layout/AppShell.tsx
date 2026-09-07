import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { TopHeader } from "./TopHeader";
import { ConfirmModal } from "../../components/ConfirmModal";
import { logout } from "../../features/auth/authStorage";

// TODO: replace hardcoded user with the authenticated admin session once
// login carries a real profile (currently just gates access — see
// features/auth/authStorage.ts).
export function AppShell() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const navigate = useNavigate();

  function handleLogoutConfirmed() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="flex h-screen bg-bg">
      <Sidebar isOpen={isMobileNavOpen} onClose={() => setIsMobileNavOpen(false)} />
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
