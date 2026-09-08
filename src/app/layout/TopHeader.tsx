import { Bell, HelpCircle, LogOut, Menu, Search, Settings } from "lucide-react";
import { Avatar } from "../../components/Avatar";
import { Tooltip } from "../../components/Tooltip";

interface TopHeaderProps {
  userName: string;
  userRole: string;
  userAvatarSrc?: string;
  onOpenNav: () => void;
  onLogout: () => void;
}

export function TopHeader({ userName, userRole, userAvatarSrc, onOpenNav, onLogout }: TopHeaderProps) {
  return (
    <header className="flex h-(--header-height) items-center justify-between gap-3 border-b border-border bg-surface px-4 sm:px-6">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <Tooltip label="Open navigation" side="bottom">
          <button
            type="button"
            aria-label="Open navigation"
            onClick={onOpenNav}
            className="text-text-muted md:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        </Tooltip>
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg bg-bg px-3 py-2 sm:max-w-md">
          <Search className="h-4 w-4 shrink-0 text-text-muted" />
          <input
            type="search"
            placeholder="Search drivers, loads, or ID..."
            className="w-full min-w-0 bg-transparent text-sm text-text placeholder:text-text-muted focus:outline-none"
          />
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-3 sm:gap-4">
        <Tooltip label="Notifications" side="bottom">
          <button type="button" aria-label="Notifications" className="text-text-muted hover:text-text">
            <Bell className="h-5 w-5" />
          </button>
        </Tooltip>
        <Tooltip label="Help" side="bottom">
          <button
            type="button"
            aria-label="Help"
            className="hidden text-text-muted hover:text-text sm:block"
          >
            <HelpCircle className="h-5 w-5" />
          </button>
        </Tooltip>
        <Tooltip label="Settings" side="bottom">
          <button
            type="button"
            aria-label="Settings"
            className="hidden text-text-muted hover:text-text sm:block"
          >
            <Settings className="h-5 w-5" />
          </button>
        </Tooltip>
        <div className="flex items-center gap-3 border-l border-border pl-3 sm:pl-4">
          <Avatar name={userName} src={userAvatarSrc} size="sm" />
          <div className="hidden text-left sm:block">
            <p className="text-sm font-medium text-text">{userName}</p>
            <p className="text-xs text-text-muted">{userRole}</p>
          </div>
          <Tooltip label="Log out" side="bottom">
            <button
              type="button"
              aria-label="Log out"
              onClick={onLogout}
              className="text-text-muted hover:text-danger"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </Tooltip>
        </div>
      </div>
    </header>
  );
}
