import { cn } from "../../../lib/cn";
import type { BranchUserRole } from "../companyBranches";

const classes: Record<BranchUserRole, string> = {
  admin: "bg-sidebar text-white",
  manager: "bg-bg text-text",
  viewer: "bg-bg text-text-muted",
};

const labels: Record<BranchUserRole, string> = {
  admin: "Admin",
  manager: "Manager",
  viewer: "Viewer",
};

export function BranchRoleBadge({ role }: { role: BranchUserRole }) {
  return <span className={cn("text-badge rounded-full px-2.5 py-0.5", classes[role])}>{labels[role]}</span>;
}
