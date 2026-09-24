import { useEffect, useRef, useState } from "react";
import { ChevronDown, Layers, Search } from "lucide-react";
import { cn } from "../../../lib/cn";
import { ROLES, type RoleKey } from "../../access/modules";

export type BatchAction = "activate" | "deactivate" | "role" | "delete";

interface TeamToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  role: RoleKey | "all";
  onRoleChange: (role: RoleKey | "all") => void;
  activeCount: number;
  selectedCount: number;
  onBatchAction: (action: BatchAction) => void;
}

const BATCH_ITEMS: { action: BatchAction; label: string; danger?: boolean }[] = [
  { action: "activate", label: "Activate" },
  { action: "deactivate", label: "Deactivate" },
  { action: "role", label: "Change Role…" },
  { action: "delete", label: "Delete", danger: true },
];

export function TeamToolbar({ search, onSearchChange, role, onRoleChange, activeCount, selectedCount, onBatchAction }: TeamToolbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setIsMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex min-w-56 flex-1 items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 sm:max-w-xs">
        <Search className="h-4 w-4 text-text-muted" />
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search team members by name or email"
          className="w-full bg-transparent text-sm text-text placeholder:text-text-muted focus:outline-none"
        />
      </div>
      <select
        aria-label="Role"
        value={role}
        onChange={(event) => onRoleChange(event.target.value as RoleKey | "all")}
        className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text"
      >
        <option value="all">Role: All</option>
        {ROLES.map((option) => (
          <option key={option.key} value={option.key}>
            Role: {option.label}
          </option>
        ))}
      </select>
      <span className="ml-auto flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1 text-xs font-medium text-success">
        <span className="h-1.5 w-1.5 rounded-full bg-success" />
        {activeCount} team member{activeCount === 1 ? "" : "s"} active
      </span>
      <div ref={menuRef} className="relative">
        <button
          type="button"
          disabled={selectedCount === 0}
          onClick={() => setIsMenuOpen((open) => !open)}
          className="flex items-center gap-1.5 rounded-lg px-2 py-2 text-xs font-semibold uppercase tracking-wide text-text hover:bg-bg disabled:cursor-not-allowed disabled:text-text-muted/60 disabled:hover:bg-transparent"
        >
          <Layers className="h-3.5 w-3.5" />
          Batch Actions{selectedCount > 0 && ` (${selectedCount})`}
          <ChevronDown className="h-3.5 w-3.5" />
        </button>
        {isMenuOpen && selectedCount > 0 && (
          <div role="menu" className="absolute right-0 top-full z-20 mt-1 w-44 rounded-lg border border-border bg-surface py-1 shadow-lg">
            {BATCH_ITEMS.map((item) => (
              <button
                key={item.action}
                type="button"
                role="menuitem"
                onClick={() => {
                  setIsMenuOpen(false);
                  onBatchAction(item.action);
                }}
                className={cn("block w-full px-3 py-2 text-left text-sm hover:bg-bg", item.danger ? "text-danger" : "text-text")}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
