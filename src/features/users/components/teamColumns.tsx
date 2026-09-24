import type { Column } from "../../../components/DataTable";
import type { ExportColumn } from "../../../lib/exportTable";
import { Avatar } from "../../../components/Avatar";
import { Switch } from "../../../components/Switch";
import { moduleLabel, roleMeta } from "../../access/modules";
import { effectiveModules } from "../../access/permissions";
import { formatLastActive, type TeamMember } from "../../access/teamMembersData";
import { ModuleChips, RoleBadge } from "./AccessBadges";

export type TeamSortKey = "name" | "email" | "role" | "status" | "lastActive";

export const TEAM_SORTERS: Record<TeamSortKey, (row: TeamMember) => string | number> = {
  name: (row) => row.name,
  email: (row) => row.email,
  role: (row) => roleMeta(row.role).label,
  status: (row) => (row.active ? 1 : 0),
  lastActive: (row) => new Date(row.lastActive).getTime(),
};

interface TeamColumnOptions {
  currentUserId?: string;
  selected: Set<string>;
  pageIds: string[];
  onToggleSelect: (id: string) => void;
  onTogglePage: (select: boolean) => void;
  onToggleActive: (member: TeamMember, active: boolean) => void;
  onEdit: (member: TeamMember) => void;
  onDelete: (member: TeamMember) => void;
}

export function teamColumns(o: TeamColumnOptions): Column<TeamMember>[] {
  const allOnPage = o.pageIds.length > 0 && o.pageIds.every((id) => o.selected.has(id));
  return [
    {
      header: "Select",
      headerCell: (
        <input type="checkbox" aria-label="Select all on this page" checked={allOnPage} onChange={(event) => o.onTogglePage(event.target.checked)} className="h-4 w-4 accent-primary" />
      ),
      accessor: (row) => (
        <input type="checkbox" aria-label={`Select ${row.name}`} checked={o.selected.has(row.id)} onChange={() => o.onToggleSelect(row.id)} className="h-4 w-4 accent-primary" />
      ),
    },
    {
      header: "Name",
      sortKey: "name",
      accessor: (row) => (
        <div className="flex items-center gap-3 whitespace-nowrap">
          <Avatar name={row.name} src={row.avatarSrc} />
          <div>
            <p className="font-semibold text-text">
              {row.name}
              {row.id === o.currentUserId && <span className="ml-1.5 text-xs font-normal text-text-muted">(You)</span>}
            </p>
            <p className="text-label text-text-muted">{row.title}</p>
          </div>
        </div>
      ),
    },
    { header: "Email", sortKey: "email", accessor: (row) => <span className="whitespace-nowrap text-text-muted">{row.email}</span> },
    { header: "Role", sortKey: "role", accessor: (row) => <RoleBadge role={row.role} /> },
    { header: "Modules", accessor: (row) => <ModuleChips role={row.role} modules={row.modules} /> },
    {
      header: "Status",
      sortKey: "status",
      accessor: (row) => (
        <Switch
          checked={row.active}
          tone="primary"
          label={`${row.active ? "Deactivate" : "Activate"} ${row.name}`}
          disabled={row.id === o.currentUserId}
          onChange={(active) => o.onToggleActive(row, active)}
        />
      ),
    },
    { header: "Last Active", sortKey: "lastActive", accessor: (row) => <span className="whitespace-nowrap text-text-muted">{formatLastActive(row.lastActive)}</span> },
    {
      header: "Actions",
      align: "right",
      accessor: (row) => (
        <div className="flex justify-end gap-3 whitespace-nowrap text-sm">
          <button type="button" onClick={() => o.onEdit(row)} className="font-medium text-text hover:text-primary">
            Edit
          </button>
          <button
            type="button"
            onClick={() => o.onDelete(row)}
            disabled={row.id === o.currentUserId}
            className="text-text-muted hover:text-danger disabled:cursor-not-allowed disabled:opacity-40"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];
}

export const teamExportColumns: ExportColumn<TeamMember>[] = [
  { header: "Name", value: (row) => row.name },
  { header: "Title", value: (row) => row.title },
  { header: "Email", value: (row) => row.email },
  { header: "Phone", value: (row) => row.phone ?? "" },
  { header: "Role", value: (row) => roleMeta(row.role).label },
  { header: "Modules", value: (row) => effectiveModules(row).map(moduleLabel).join("; ") },
  { header: "Status", value: (row) => (row.active ? "Active" : "Deactivated") },
  { header: "Last Active", value: (row) => new Date(row.lastActive).toLocaleString("en-US") },
];
