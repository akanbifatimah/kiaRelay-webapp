import type { BranchUserRole } from "../companyBranches";

interface BranchUsersFilterBarProps {
  role: BranchUserRole | "all";
  onRoleChange: (value: BranchUserRole | "all") => void;
  branch: string | "all";
  branchOptions: string[];
  onBranchChange: (value: string | "all") => void;
  visibleCount: number;
}

export function BranchUsersFilterBar({
  role,
  onRoleChange,
  branch,
  branchOptions,
  onBranchChange,
  visibleCount,
}: BranchUsersFilterBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={role}
          onChange={(event) => onRoleChange(event.target.value as BranchUserRole | "all")}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text"
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="viewer">Viewer</option>
        </select>
        <select
          value={branch}
          onChange={(event) => onBranchChange(event.target.value)}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text"
        >
          <option value="all">All Branches</option>
          {branchOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <span className="text-sm text-text-muted">
        Showing {visibleCount} active user{visibleCount === 1 ? "" : "s"}
      </span>
    </div>
  );
}
