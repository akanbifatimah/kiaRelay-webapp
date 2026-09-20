import { X, PanelLeft } from "lucide-react";
import { cn } from "../../lib/cn";
import { Tooltip } from "../../components/Tooltip";

interface SidebarHeaderProps {
  isCollapsed: boolean;
  onClose: () => void;
  onToggleCollapsed: () => void;
}

// Split out of Sidebar.tsx (2026-09-18) once the collapse-toggle rework
// pushed it past the 150-line limit — no behavior change, same header row.
export function SidebarHeader({ isCollapsed, onClose, onToggleCollapsed }: SidebarHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 px-5 py-5",
        isCollapsed ? "md:flex-col md:gap-3 md:px-0" : "justify-between",
      )}
    >
      <div className={cn("flex items-center gap-2", isCollapsed && "md:justify-center")}>
        <img src="/KiaRelay_logo.png" alt="KiaRelay" className="h-8 w-8 shrink-0 rounded-md" />
        <div className={cn(isCollapsed && "md:hidden")}>
          <p className="text-sm font-semibold text-white">KiaRelay</p>
          <p className="text-xs text-sidebar-fg">Admin Center</p>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Tooltip label="Close navigation" side="bottom">
          <button
            type="button"
            aria-label="Close navigation"
            onClick={onClose}
            className={cn("text-sidebar-fg md:hidden", isCollapsed && "hidden")}
          >
            <X className="h-5 w-5" />
          </button>
        </Tooltip>
        <Tooltip label={isCollapsed ? "Expand" : "Collapse"} side="bottom">
          <button
            type="button"
            aria-label={isCollapsed ? "Expand navigation" : "Collapse navigation"}
            onClick={(event) => {
              onToggleCollapsed();
              // The click's effect (the sidebar visibly collapsing/
              // expanding) is immediate feedback on its own — without this,
              // the button keeps focus after the click and Tooltip's
              // group-focus-within keeps the label showing until focus
              // moves elsewhere, not just on hover.
              event.currentTarget.blur();
            }}
            className="hidden text-sidebar-fg hover:text-white md:flex"
          >
            <PanelLeft className="h-4 w-4" />
          </button>
        </Tooltip>
      </div>
    </div>
  );
}
