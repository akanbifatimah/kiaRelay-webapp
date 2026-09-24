import { cn } from "../../../lib/cn";
import { moduleLabel, roleMeta, type ModuleKey, type RoleKey } from "../../access/modules";

export function RoleBadge({ role }: { role: RoleKey }) {
  return <span className={cn("text-badge whitespace-nowrap rounded-full px-2 py-0.5 text-[10px]", roleMeta(role).badge)}>{roleMeta(role).label}</span>;
}

/** Stacked module chips; Super Admins show "All Modules" instead of the full list. */
export function ModuleChips({ role, modules, max = 3 }: { role: RoleKey; modules: ModuleKey[]; max?: number }) {
  if (role === "super-admin") return <span className="rounded border border-border px-1.5 py-0.5 text-xs text-text">All Modules</span>;
  if (modules.length === 0) return <span className="text-xs text-text-muted">No modules</span>;
  const shown = modules.slice(0, max);
  return (
    <div className="flex max-w-48 flex-wrap gap-1">
      {shown.map((module) => (
        <span key={module} className="whitespace-nowrap rounded bg-bg px-1.5 py-0.5 text-xs text-text">
          {moduleLabel(module)}
        </span>
      ))}
      {modules.length > max && (
        <span className="rounded bg-bg px-1.5 py-0.5 text-xs text-text-muted" title={modules.slice(max).map(moduleLabel).join(", ")}>
          +{modules.length - max}
        </span>
      )}
    </div>
  );
}
