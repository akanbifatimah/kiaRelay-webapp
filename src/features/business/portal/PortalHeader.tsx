import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Headset, HelpCircle, LogOut, Menu, Settings } from "lucide-react";
import { Avatar } from "../../../components/Avatar";
import { Tooltip } from "../../../components/Tooltip";
import { BUSINESS_BRAND } from "../../../constants/brand";
import type { BusinessAccount } from "../businessAccounts";
import { fullName } from "../businessTypes";

interface PortalHeaderProps {
  account: BusinessAccount;
  onOpenNav: () => void;
  onSignOut: () => void;
}

const MENU = [
  { to: "/business/settings", label: "Settings", icon: Settings },
  { to: "/business/support", label: "Support Tickets", icon: Headset },
];

// Portal top bar (2026-10-01): company on the left; Help and Settings icons
// and a profile menu with Sign Out on the right, like the admin header.
export function PortalHeader({ account, onOpenNav, onSignOut }: PortalHeaderProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const name = fullName(account.owner.firstName, account.owner.lastName);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-border bg-surface px-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <Tooltip label="Open menu" side="bottom" className="md:hidden">
          <button type="button" aria-label="Open menu" onClick={onOpenNav} className="rounded-md p-1.5 text-text hover:bg-bg md:hidden">
            <Menu className="h-5 w-5" />
          </button>
        </Tooltip>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-text">{account.company.legalName}</p>
          <p className="text-xs text-text-muted">{BUSINESS_BRAND} · {account.id}</p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-3 sm:gap-4">
        <Tooltip label="Help & FAQ" side="bottom">
          <Link to="/business/help" aria-label="Help & FAQ" className="hidden text-text-muted hover:text-text sm:block">
            <HelpCircle className="h-5 w-5" />
          </Link>
        </Tooltip>
        <Tooltip label="Settings" side="bottom">
          <Link to="/business/settings" aria-label="Settings" className="text-text-muted hover:text-text">
            <Settings className="h-5 w-5" />
          </Link>
        </Tooltip>
        <div ref={menuRef} className="relative border-l border-border pl-3 sm:pl-4">
          <button type="button" aria-haspopup="menu" aria-expanded={open} aria-label="Account menu" onClick={() => setOpen((v) => !v)} className="flex items-center gap-2 rounded-lg p-1 hover:bg-bg">
            {account.photoUri ? <img src={account.photoUri} alt="" className="h-8 w-8 rounded-full object-cover" /> : <Avatar name={name} size="sm" />}
            <span className="hidden text-left leading-tight sm:block">
              <span className="block text-sm font-medium text-text">{name}</span>
              <span className="block text-xs text-text-muted">Account owner</span>
            </span>
            <ChevronDown className="h-4 w-4 text-text-muted" />
          </button>
          {open && (
            <div role="menu" className="absolute right-0 top-full z-30 mt-2 w-60 overflow-hidden rounded-xl border border-border bg-surface shadow-lg">
              <div className="border-b border-border px-4 py-3">
                <p className="truncate text-sm font-semibold text-text">{name}</p>
                <p className="truncate text-xs text-text-muted">{account.owner.email}</p>
              </div>
              {MENU.map(({ to, label, icon: Icon }) => (
                <Link key={to} to={to} role="menuitem" onClick={() => setOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-text hover:bg-bg">
                  <Icon className="h-4 w-4 text-text-muted" /> {label}
                </Link>
              ))}
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setOpen(false);
                  onSignOut();
                }}
                className="flex w-full items-center gap-2.5 border-t border-border px-4 py-2.5 text-left text-sm font-medium text-danger hover:bg-danger/5"
              >
                <LogOut className="h-4 w-4" /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
