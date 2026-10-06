import { useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { ConfirmModal } from "../../../components/ConfirmModal";
import { BUSINESS_BRAND } from "../../../constants/brand";
import { businessLogout } from "../businessAccounts";
import { PortalHeader } from "./PortalHeader";
import { PortalSidebar } from "./PortalSidebar";
import { usePortalAccount } from "./usePortalAccount";
import { seedPortalIncidents } from "./usePortalIncidents";
import { VerificationBanner } from "./VerificationBanner";

const COLLAPSED_KEY = "kiarelay-portal-sidebar-collapsed";

function initialCollapsed(): boolean {
  try {
    return localStorage.getItem(COLLAPSED_KEY) === "true";
  } catch {
    return false;
  }
}

// KiaRelay Business web portal shell (2026-09-30): replaces the single
// /business/account page. Business sessions only — it never opens the admin
// shell, and an admin session never opens this one.
export function PortalShell() {
  const account = usePortalAccount();
  const navigate = useNavigate();
  const [navOpen, setNavOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(initialCollapsed);
  // The demo company's incident reports (and their admin tickets), once.
  useEffect(() => {
    if (account) seedPortalIncidents(account);
  }, [account]);
  if (!account) return <Navigate to="/login" replace />;

  function toggleCollapsed() {
    setIsCollapsed((prev) => {
      try {
        localStorage.setItem(COLLAPSED_KEY, String(!prev));
      } catch {
        // Not remembered across reloads; the toggle still works.
      }
      return !prev;
    });
  }

  return (
    <div className="flex h-screen overflow-hidden bg-bg">
      <PortalSidebar isOpen={navOpen} onClose={() => setNavOpen(false)} isCollapsed={isCollapsed} onToggleCollapsed={toggleCollapsed} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <PortalHeader account={account} onOpenNav={() => setNavOpen(true)} onSignOut={() => setConfirmLogout(true)} />
        <VerificationBanner account={account} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
      {confirmLogout && (
        <ConfirmModal
          title="Sign out?"
          message={`You'll need your email and password to sign back in to ${BUSINESS_BRAND}.`}
          confirmLabel="Sign Out"
          onCancel={() => setConfirmLogout(false)}
          onConfirm={() => {
            businessLogout();
            navigate("/login", { replace: true });
          }}
        />
      )}
    </div>
  );
}
