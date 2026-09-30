import { useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { LogOut, Menu } from "lucide-react";
import { Avatar } from "../../../components/Avatar";
import { ConfirmModal } from "../../../components/ConfirmModal";
import { Tooltip } from "../../../components/Tooltip";
import { BUSINESS_BRAND } from "../../../constants/brand";
import { businessLogout } from "../businessAccounts";
import { fullName } from "../businessTypes";
import { PortalSidebar } from "./PortalSidebar";
import { usePortalAccount } from "./usePortalAccount";
import { VerificationBanner } from "./VerificationBanner";

// KiaRelay Business web portal shell (2026-09-30): replaces the single
// /business/account page. Business sessions only — it never opens the admin
// shell, and an admin session never opens this one.
export function PortalShell() {
  const account = usePortalAccount();
  const navigate = useNavigate();
  const [navOpen, setNavOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  if (!account) return <Navigate to="/login" replace />;
  const name = fullName(account.owner.firstName, account.owner.lastName);

  return (
    <div className="flex h-screen bg-bg">
      <PortalSidebar isOpen={navOpen} onClose={() => setNavOpen(false)} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-border bg-surface px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Tooltip label="Open menu" side="bottom" className="md:hidden">
              <button type="button" aria-label="Open menu" onClick={() => setNavOpen(true)} className="rounded-md p-1.5 text-text hover:bg-bg md:hidden">
                <Menu className="h-5 w-5" />
              </button>
            </Tooltip>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-text">{account.company.legalName}</p>
              <p className="text-xs text-text-muted">
                {BUSINESS_BRAND} · {account.id}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 sm:flex">
              <Avatar name={name} />
              <div className="leading-tight">
                <p className="text-sm font-medium text-text">{name}</p>
                <p className="text-xs text-text-muted">{account.owner.email}</p>
              </div>
            </div>
            <Tooltip label="Sign out" side="bottom">
              <button type="button" aria-label="Sign out" onClick={() => setConfirmLogout(true)} className="rounded-md p-2 text-text-muted hover:bg-bg hover:text-text">
                <LogOut className="h-4 w-4" />
              </button>
            </Tooltip>
          </div>
        </header>
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
